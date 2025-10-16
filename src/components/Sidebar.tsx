import React from "react";
import {
  UMLDiagram,
  UseCaseElement,
  ActivityElement,
  UMLRelationship,
} from "../types/umlTypes";

interface SidebarProps {
  selectedId: string | null;
  diagram: UMLDiagram;
  onUpdate: (newDiagram: UMLDiagram) => void;
  onClearSelection: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedId,
  diagram,
  onUpdate,
  onClearSelection,
}) => {
  // busca item selecionado (pode ser elemento ou relação)
  const selectedElement =
    diagram.elements.find((el) => el.id === selectedId) ?? null;
  const selectedRel =
    diagram.relationships.find((r) => r.id === selectedId) ?? null;

  // helpers de atualização
  const updateMetadata = (patch: Partial<typeof diagram.metadata>) => {
    onUpdate({
      ...diagram,
      metadata: {
        ...diagram.metadata,
        ...patch,
        lastModified: new Date().toISOString(),
      },
    });
  };

  const handleElementChange = (
    key: keyof (UseCaseElement | ActivityElement),
    value: any
  ) => {
    if (!selectedElement) return;
    const updatedElements = diagram.elements.map((el) =>
      el.id === selectedElement.id ? { ...el, [key]: value } : el
    );
    onUpdate({ ...diagram, elements: updatedElements });
  };

  const handleRelationshipChange = (key: keyof UMLRelationship, value: any) => {
    if (!selectedRel) return;
    const updatedRelationships = diagram.relationships.map((r) =>
      r.id === selectedRel.id ? { ...r, [key]: value } : r
    );
    onUpdate({ ...diagram, relationships: updatedRelationships });
  };

  const getElementTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      actor: "Ator",
      usecase: "Caso de Uso",
      object: "Objeto",
      note: "Nota",
      start: "Início",
      end: "Fim",
      activity: "Atividade",
      decision: "Decisão",
      merge: "Junção",
      fork: "Divisão",
      join: "Sincronização",
      control_flow: "Fluxo de Controle",
      object_flow: "Fluxo de Objeto",
      association: "Associação",
      include: "Inclusão",
      extend: "Extensão",
      generalization: "Generalização",
      dependency: "Dependência",
    };
    return map[type] ?? type;
  };

  // sempre renderiza um container para evitar "faixa preta" vazia
  return (
    <aside
      style={{
        width: "280px",
        background: "#fafafa",
        borderLeft: "1px solid #ddd",
        padding: "1rem",
        overflowY: "auto",
        color: "#111",
        display: "flex",
        flexDirection: "column",
      }}
      aria-label="Sidebar de propriedades"
    >
      {/* --------- Caso: nada selecionado -> propriedades do diagrama --------- */}
      {!selectedElement && !selectedRel && (
        <>
          <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: 8 }}>
            Propriedades do Diagrama
          </h2>

          <label style={{ fontWeight: 600, marginTop: 8 }}>Nome</label>
          <input
            type="text"
            value={diagram.metadata.name ?? ""}
            onChange={(e) => updateMetadata({ name: e.target.value })}
            style={{
              width: "100%",
              marginBottom: "1rem",
              padding: "0.4rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />

          <label style={{ fontWeight: 600 }}>Comentários</label>
          <textarea
            value={diagram.metadata.comments ?? ""}
            onChange={(e) => updateMetadata({ comments: e.target.value })}
            placeholder="Adicione anotações ou observações sobre o diagrama..."
            style={{
              width: "100%",
              height: "120px",
              borderRadius: "6px",
              padding: "0.4rem",
              border: "1px solid #ccc",
              resize: "vertical",
            }}
          />
        </>
      )}

      {/* --------- Caso: relacionamento selecionado --------- */}
      {selectedRel && (
        <>
          <button
            onClick={onClearSelection}
            style={{
              background: "#f3f4f6",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "0.5rem",
              marginBottom: "1rem",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            ← Voltar ao Diagrama
          </button>

          <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: 8 }}>
            Relação
          </h2>

          <p style={{ marginBottom: 8, color: "#555" }}>
            Tipo atual: <strong>{getElementTypeLabel(selectedRel.type)}</strong>
          </p>

          <label style={{ fontWeight: 600 }}>Tipo de relação</label>
          <select
            value={selectedRel.type}
            onChange={(e) => handleRelationshipChange("type", e.target.value as any)}
            style={{
              width: "100%",
              marginBottom: "1rem",
              padding: "0.4rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          >
            {diagram.metadata.type === "usecase" ? (
              <>
                <option value="association">Associação</option>
                <option value="include">Inclusão</option>
                <option value="extend">Extensão</option>
                <option value="generalization">Generalização</option>
                <option value="dependency">Dependência</option>
              </>
            ) : (
              <>
                <option value="control_flow">Fluxo de Controle</option>
                <option value="object_flow">Fluxo de Objeto</option>
              </>
            )}
          </select>

          {/* Label (ex: <<include>> / <<extend>> / rótulos gerais) */}
          <label style={{ fontWeight: 600 }}>Rótulo</label>
          <input
            type="text"
            value={selectedRel.label ?? ""}
            onChange={(e) => handleRelationshipChange("label", e.target.value)}
            style={{
              width: "100%",
              marginBottom: "1rem",
              padding: "0.4rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />

          {/* Guard — só faz sentido em control_flow / object_flow */}
          {(selectedRel.type === "control_flow" || selectedRel.type === "object_flow") && (
            <>
              <label style={{ fontWeight: 600 }}>Condição (guard)</label>
              <input
                type="text"
                value={selectedRel.guard ?? ""}
                onChange={(e) => handleRelationshipChange("guard", e.target.value)}
                placeholder="[condição]"
                style={{
                  width: "100%",
                  marginBottom: "1rem",
                  padding: "0.4rem",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
            </>
          )}
        </>
      )}

      {/* --------- Caso: elemento selecionado --------- */}
      {selectedElement && (
        <>
          <button
            onClick={onClearSelection}
            style={{
              background: "#f3f4f6",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "0.5rem",
              marginBottom: "1rem",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            ← Voltar ao Diagrama
          </button>

          <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: 8 }}>
            {selectedElement.name ?? "Elemento"}
          </h2>

          <p style={{ marginBottom: 12, color: "#555" }}>
            Tipo: <strong>{getElementTypeLabel(selectedElement.type)}</strong>
          </p>

          <label style={{ fontWeight: 600 }}>Nome</label>
          <input
            type="text"
            value={selectedElement.name ?? ""}
            onChange={(e) => handleElementChange("name", e.target.value)}
            style={{
              width: "100%",
              marginBottom: "1rem",
              padding: "0.4rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />

          <label style={{ fontWeight: 600 }}>Cor</label>
          <input
            type="color"
            value={(selectedElement as any).color ?? "#000000"}
            onChange={(e) => handleElementChange("color", e.target.value)}
            style={{ width: "100%", height: "2rem", border: "none", marginTop: 8 }}
          />
        </>
      )}
    </aside>
  );
};
