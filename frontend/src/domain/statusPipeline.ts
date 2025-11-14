export type StatusCode = "waiting" | "in_progress" | "ready" | "shipped";

export interface Stage {
  key: string;                 // chave da coluna
  label: string;               // label da coluna (UI)
  statusCode: StatusCode;      // código que o backend entende
  statusLabel: string;         // label do status (UI no card)
  nextStatusLabel: string | null;
  prevStatusLabel: string | null;
  nextCode: StatusCode | null; // próximo código para transição
  prevCode: StatusCode | null; // código anterior
}

export type StageOrFallback = Stage | { key: "unmapped"; isFallback: true };

// Verdade única dos status e transições
export const STATUS_PIPELINE: StageOrFallback[] = [
  {
    key: "waiting",
    label: "Alertas de Envio",
    statusCode: "waiting",
    statusLabel: "Aguardando Separação",
    nextStatusLabel: "Em Separação",
    prevStatusLabel: null,
    nextCode: "in_progress",
    prevCode: null,
  },
  {
    key: "in_progress",
    label: "Em Separação",
    statusCode: "in_progress",
    statusLabel: "Em Separação",
    nextStatusLabel: "Pendente de Envio",
    prevStatusLabel: "Aguardando Separação",
    nextCode: "ready",
    prevCode: "waiting",
  },
  {
    key: "ready",
    label: "Pendente de Envio",
    statusCode: "ready",
    statusLabel: "Pendente de Envio",
    nextStatusLabel: "Enviado/Coletado",
    prevStatusLabel: "Em Separação",
    nextCode: "shipped",
    prevCode: "in_progress",
  },
  {
    key: "shipped",
    label: "Concluído",
    statusCode: "shipped",
    statusLabel: "Enviado/Coletado",
    nextStatusLabel: null,
    prevStatusLabel: "Pendente de Envio",
    nextCode: null,
    prevCode: "ready",
  },
  { key: "unmapped", isFallback: true },
];

// Mapa por código (ex.: stageByCode["ready"])
export const stageByCode = Object.fromEntries(
  (STATUS_PIPELINE.filter((s): s is Stage => (s as any).statusCode) as Stage[]).map((s) => [
    s.statusCode,
    s,
  ])
) as Record<StatusCode, Stage>;

// Helpers (opcionais)
export function getNextCode(code: StatusCode): StatusCode | null {
  return stageByCode[code]?.nextCode ?? null;
}
export function getPrevCode(code: StatusCode): StatusCode | null {
  return stageByCode[code]?.prevCode ?? null;
}
export function getStatusLabel(code: StatusCode): string {
  return stageByCode[code]?.statusLabel ?? code;
}
