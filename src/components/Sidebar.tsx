import React from "react";
import { UMLDiagram, UseCaseElement, ActivityElement } from "../types/umlTypes";

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
  const selectedElement =
    diagram.elements.find((el) => el.id === selectedId) || null;

  // Atualiza metadados do diagrama (nome, comentários etc)
  const handleMetadataChange = (
    key: keyof typeof diagram.metadata,
    value: string
  ) => {
    onUpdate({
      ...diagram,
      metadata: {
        ...diagram.metadata,
        [key]: value,
        lastModified: new Date().toISOString(),
      },
    });
  };

  // Atualiza comentários
  const handleCommentChange = (value: string) => {
    onUpdate({
      ...diagram,
      metadata: {
        ...diagram.metadata,
        comments: value,
        lastModified: new Date().toISOString(),
      },
    });
  };

  // Atualiza atributos de um elemento selecionado
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

  // Mapeia tipo → nome legível
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
      association: "Associação",
      include: "Inclusão",
      extend: "Extensão",
      generalization: "Generalização",
    };
    return map[type] || type;
  };

  return (
    <div
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
    >
      {!selectedElement ? (
        <>
          <h2
            style={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              marginBottom: "0.5rem",
            }}
          >
            Propriedades do Diagrama
          </h2>

          <label style={{ fontWeight: 600 }}>Nome</label>
          <input
            type="text"
            value={diagram.metadata.name}
            onChange={(e) => handleMetadataChange("name", e.target.value)}
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
            value={(diagram.metadata as any).comments || ""}
            onChange={(e) => handleCommentChange(e.target.value)}
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
      ) : (
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

          <h2 style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
            {selectedElement.name || "Elemento"}
          </h2>
          <p style={{ marginBottom: "0.5rem", color: "#555" }}>
            Tipo: {getElementTypeLabel(selectedElement.type)}
          </p>

          <label style={{ fontWeight: 600 }}>Nome</label>
          <input
            type="text"
            value={selectedElement.name}
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
            value={(selectedElement as any).color || "#ffffff"}
            onChange={(e) => handleElementChange("color", e.target.value)}
            style={{ width: "100%", height: "2rem", border: "none" }}
          />
        </>
      )}
    </div>
  );
};
