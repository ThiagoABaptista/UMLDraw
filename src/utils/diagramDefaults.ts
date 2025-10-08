export interface ElementDefaults {
  width: number;
  height: number;
  scaleBoost: number;
}

export const UML_DEFAULTS: Record<string, ElementDefaults> = {
  // === Diagrama de Caso de Uso ===
  actor:    { width: 60,  height: 120, scaleBoost: 3.0 },
  usecase:  { width: 140, height: 70,  scaleBoost: 1.8 },

  // === Diagrama de Atividade ===
  start:    { width: 40,  height: 40,  scaleBoost: 2.0 },
  end:      { width: 40,  height: 40,  scaleBoost: 2.0 },
  activity: { width: 140, height: 70,  scaleBoost: 1.6 },
  decision: { width: 60,  height: 60,  scaleBoost: 2.2 },
  fork:     { width: 120, height: 40,  scaleBoost: 2.0 },
  join:     { width: 120, height: 40,  scaleBoost: 2.0 },
  merge:    { width: 60,  height: 60,  scaleBoost: 2.0 },
};

// Fallback padrão
export const getElementDefaults = (type: string): ElementDefaults => {
  return UML_DEFAULTS[type] || { width: 100, height: 60, scaleBoost: 1.0 };
};
