// Utility functions for EmailComposer

/** Replace placeholders like {{name}} in HTML/text */
export function replacePlaceholders(text = '', data = {}) {
  return text.replace(/{{\s*([a-zA-Z0-9_\.]+)\s*}}/g, (match, key) => {
    const value = key.split('.').reduce((acc, k) => (acc && acc[k] != null ? acc[k] : ''), data);
    return String(value != null ? value : '');
  });
}

export function validarEmail(email = '') {
  // simples
  return /[^@\s]+@[^@\s]+\.[^@\s]+/.test(String(email).trim());
}

export function validarAnexos(files = [], { maxCount = 10, maxTotalBytes = 20 * 1024 * 1024 } = {}) {
  if (!Array.isArray(files)) return { valid: false, reason: 'invalid_files' };
  if (files.length > maxCount) return { valid: false, reason: 'max_count' };
  const total = files.reduce((s, f) => s + (f.size || 0), 0);
  if (total > maxTotalBytes) return { valid: false, reason: 'max_total_size' };
  return { valid: true };
}

export function formatAttachmentMeta(file) {
  if (!file) return { name: '', size: 0 };
  return { name: file.name || 'unknown', size: file.size || 0, type: file.type || '' };
}
