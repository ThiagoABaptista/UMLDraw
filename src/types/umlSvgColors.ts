/**
 * 🎨 Paleta de cores padronizada para elementos e relacionamentos UML.
 * Segue convenções inspiradas em ferramentas profissionais como Gaphor, Lucidchart e PlantUML.
 */
export const umlSvgColors: Record<string, string> = {
  // === 🧍 Diagrama de Caso de Uso ===
  actor: "#4f46e5",        // Índigo — Atores
  usecase: "#10b981",      // Verde — Casos de Uso
  system: "#6b7280",       // Cinza Médio — Fronteira do Sistema
  note: "#9ca3af",         // Cinza Claro — Notas / Comentários
  object: "#3b82f6",       // Azul — Objetos (se usado)

  // === ⚙️ Diagrama de Atividades ===
  activity: "#2563eb",     // Azul Forte — Ações / Atividades
  decision: "#f59e0b",     // Âmbar — Decisões
  start: "#16a34a",        // Verde Escuro — Nó Inicial
  end: "#dc2626",          // Vermelho — Nó Final
  fork: "#ea580c",         // Laranja — Fork / Join
  join: "#ea580c",         // Laranja — Join
  merge: "#8b5cf6",        // Violeta — Merge
  swimlane: "#6b7280",     // Cinza — Partição / Raia

  // === 🔗 Relacionamentos (Casos de Uso e Atividades) ===
  association: "#374151",       // Cinza Escuro — Associação
  include: "#2563eb",           // Azul — <<include>>
  extend: "#7c3aed",            // Roxo — <<extend>>
  generalization: "#111827",    // Preto — Herança
  realization: "#111827",       // Preto — Realização
  dependency: "#9ca3af",        // Cinza Claro — Dependência
  control_flow: "#0f172a",      // Azul Petróleo — Fluxo de Controle
  object_flow: "#334155",       // Azul Cobalto — Fluxo de Objetos
};
