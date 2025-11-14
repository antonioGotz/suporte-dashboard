const STORAGE_KEY = 'demo-subscribers:v1';

let memoryCache = [];
const listeners = new Set();

function nowISO() {
  return new Date().toISOString();
}

function safeWindow() {
  return typeof window !== 'undefined' ? window : undefined;
}

function getLocalStorage() {
  const w = safeWindow();
  return w ? w.localStorage : undefined;
}

function readStore() {
  if (memoryCache.length > 0) return memoryCache;
  try {
    const ls = getLocalStorage();
    if (!ls) return memoryCache;
    const raw = ls.getItem(STORAGE_KEY);
    if (!raw) return memoryCache;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const { list: migrated, changed } = migrateLegacyRecords(parsed);
      memoryCache = migrated;
      if (changed) {
        // Persist migration so o painel principal assume controle dos status.
        writeStore(migrated);
      }
    }
  } catch (err) {
    console.warn('[demoSubscribersStore] readStore failed', err);
  }
  return memoryCache;
}

function migrateLegacyRecords(records) {
  if (!Array.isArray(records) || records.length === 0) {
    return { list: Array.isArray(records) ? records : [], changed: false };
  }

  let changed = false;
  const list = records.map((item) => {
    if (!item || typeof item !== 'object') return item;

    const rawHistory = Array.isArray(item.history) ? item.history : [];
    const history = rawHistory.filter((entry) => entry?.type !== 'status:reset');
    if (history.length !== rawHistory.length) {
      changed = true;
    }
    const emailKey = normalizeEmail(item.email);
    if (emailKey && item.emailKey !== emailKey) {
      changed = true;
    }
    const allowed = new Set(['pending', 'active', 'suspended', 'cancelled']);
    const latestStatusEntry = [...history]
      .reverse()
      .find((entry) => {
        if (!entry || typeof entry.type !== 'string') return false;
        if (!entry.type.startsWith('status:')) return false;
        const candidate = entry.type.slice('status:'.length);
        return allowed.has(candidate);
      });
    const derivedStatus = latestStatusEntry
      ? latestStatusEntry.type.slice('status:'.length)
      : null;

    const next = {
      ...item,
      history,
      emailKey,
    };

    if (derivedStatus && allowed.has(derivedStatus) && derivedStatus !== item.status) {
      next.status = derivedStatus;
    }

    if (next.status !== item.status || next.emailKey !== item.emailKey || next.history !== item.history) {
      changed = true;
    }

    return next;
  });

  return { list, changed };
}

function normalizeEmail(email) {
  return (email || '').trim().toLowerCase();
}

function writeStore(next) {
  memoryCache = Array.isArray(next) ? next : [];
  try {
    const ls = getLocalStorage();
    if (ls) {
      ls.setItem(STORAGE_KEY, JSON.stringify(memoryCache));
    }
  } catch (err) {
    console.warn('[demoSubscribersStore] writeStore failed', err);
  }
  listeners.forEach((listener) => {
    try { listener(memoryCache); } catch (err) { console.error(err); }
  });
  const w = safeWindow();
  if (w && typeof w.dispatchEvent === 'function') {
    w.dispatchEvent(new CustomEvent('demo-subscribers:changed'));
  }
}

function randomId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `demo-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

const STATUS_LABELS = {
  pending: 'Aguardando aprovação',
  active: 'Ativo',
  suspended: 'Suspenso',
  cancelled: 'Cancelado',
};

const PLAN_CONTENT = {
  'evolua-petit': {
    toys: ['Kit Motor Fino', 'Blocos Magnéticos', 'Painel Sensorial'],
    videos: ['Introdução ao Kit Petit', 'Como organizar o espaço do bebê'],
  },
  'evolua-bebe': {
    toys: ['Cubos de Textura', 'Mesa Musical', 'Livro de Tecido Interativo'],
    videos: ['Tour pelo Kit Bebê', 'Atividades guiadas pelo terapeuta'],
  },
  default: {
    toys: ['Kit Sensório-Motor', 'Brinquedo Interativo de Luzes'],
    videos: ['Boas vindas ao Evolua', 'Dicas para pais e cuidadores'],
  },
};

export function getStatusLabel(status) {
  return STATUS_LABELS[status] || status;
}

export function getAllDemoSubscribers() {
  return [...readStore()];
}

export function subscribeDemoSubscribers(listener) {
  if (typeof listener !== 'function') return () => {};
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function createDemoSubscriber(payload) {
  const list = readStore();
  const id = randomId();
  const planKey = payload?.plan || 'default';
  const content = PLAN_CONTENT[planKey] || PLAN_CONTENT.default;
  const emailKey = normalizeEmail(payload?.email);
  const record = {
    id,
    status: 'pending',
    createdAt: nowISO(),
    updatedAt: nowISO(),
    name: payload?.name?.trim() || 'Assinante Demo',
    email: payload?.email?.trim() || '',
    emailKey,
    phone: payload?.phone?.trim() || '',
    plan: planKey,
    planLabel: payload?.planLabel || planKey,
    childName: payload?.childName?.trim() || '',
    childAgeLabel: payload?.childAgeLabel || '',
    address: payload?.address || {},
    notes: payload?.notes || '',
    toys: content.toys,
    videos: content.videos,
    history: [
      {
        at: nowISO(),
        type: 'created',
        description: 'Cadastro enviado e aguardando aprovação.',
      },
    ],
  };
  writeStore([...list, record]);
  return record;
}

export function updateDemoSubscriberStatus(id, status, options = {}) {
  const allowed = ['pending', 'active', 'suspended', 'cancelled'];
  if (!allowed.includes(status)) {
    console.warn('[demoSubscribersStore] Status inválido recebido:', status);
    return null;
  }

  const list = readStore();
  let updated = null;
  let changed = false;
  const next = list.map((item) => {
    if (item.id !== id) return item;
    const history = Array.isArray(item.history) ? item.history : [];
    if (item.status === status && !options.forceHistory) {
      updated = item;
      return item;
    }
    changed = true;
    updated = {
      ...item,
      status,
      updatedAt: nowISO(),
      history: [
        ...history,
        {
          at: nowISO(),
          type: `status:${status}`,
          description: options.description || STATUS_LABELS[status] || status,
        },
      ],
    };
    return updated;
  });
  if (!updated) return null;
  if (changed) {
    writeStore(next);
  }
  return updated;
}

export function getDemoSubscriberByEmail(email) {
  if (!email) return null;
  const target = normalizeEmail(email);
  return readStore().find((item) => {
    const itemKey = item.emailKey || normalizeEmail(item.email);
    return itemKey === target;
  }) || null;
}

export function updateDemoSubscriberStatusByEmail(email, status, options = {}) {
  if (!email) return null;
  const record = getDemoSubscriberByEmail(email);
  if (!record) return null;
  return updateDemoSubscriberStatus(record.id, status, options);
}

export function updateDemoSubscriber(id, patch) {
  const list = readStore();
  let updated = null;
  const next = list.map((item) => {
    if (item.id !== id) return item;
    const nextEmail = typeof patch?.email === 'string' ? patch.email : item.email;
    updated = {
      ...item,
      ...patch,
      email: nextEmail,
      emailKey: normalizeEmail(nextEmail),
      updatedAt: nowISO(),
    };
    return updated;
  });
  if (!updated) return null;
  writeStore(next);
  return updated;
}

export function mergeDemoSubscriberMetadata(id, metadata) {
  if (!id || !metadata || typeof metadata !== 'object') return null;
  const current = getDemoSubscriberById(id);
  if (!current) return null;
  const nextMeta = {
    ...(current.metadata || {}),
    ...metadata,
  };
  return updateDemoSubscriber(id, { metadata: nextMeta });
}

export function getDemoSubscriberById(id) {
  return readStore().find((item) => item.id === id) || null;
}

export function resetDemoSubscribers() {
  writeStore([]);
}

export function ensureDemoSeed(seedFn) {
  const list = readStore();
  if (list.length === 0 && typeof seedFn === 'function') {
    const seeded = seedFn();
    if (Array.isArray(seeded) && seeded.length > 0) {
      writeStore(seeded);
    }
  }
}
