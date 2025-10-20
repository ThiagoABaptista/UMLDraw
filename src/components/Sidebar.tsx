import React, { useEffect, useState } from "react";
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
  onSelect: (id: string | null) => void;
  onClearSelection: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedId,
  diagram,
  onUpdate,
  onSelect,
  onClearSelection,
}) => {
  const [activeTab, setActiveTab] = useState<"geral" | "elementos" | "relacoes">("geral");

  // se o usuário selecionar algo fora do sidebar (canvas), trocamos a aba automaticamente
  useEffect(() => {
    if (!selectedId) {
      setActiveTab("geral");
      return;
    }
    const isElement = diagram.elements.some((e) => e.id === selectedId);
    const isRel = diagram.relationships.some((r) => r.id === selectedId);
    if (isElement) setActiveTab("elementos");
    else if (isRel) setActiveTab("relacoes");
  }, [selectedId, diagram.elements, diagram.relationships]);

  const selectedElement = diagram.elements.find((el) => el.id === selectedId) ?? null;
  const selectedRel = diagram.relationships.find((r) => r.id === selectedId) ?? null;

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

  return (
    <aside
      style={{
        width: "280px",
        background: "#fafafa",
        borderLeft: "1px solid #ddd",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Abas */}
      <div style={{ display: "flex", borderBottom: "1px solid #ddd", background: "#f3f4f6" }}>
        {[
          { id: "geral", label: "Geral" },
          { id: "elementos", label: "Elementos" },
          { id: "relacoes", label: "Relações" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              flex: 1,
              padding: "0.5rem",
              background: activeTab === tab.id ? "#fff" : "#f3f4f6",
              border: "none",
              borderBottom: activeTab === tab.id ? "2px solid #3b82f6" : "2px solid transparent",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, padding: "1rem", overflowY: "auto" }}>
        {/* ABA GERAL */}
        {activeTab === "geral" && (
          <>
            <h2 style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: 8 }}>
              Propriedades do Diagrama
            </h2>

            <label style={{ fontWeight: 600, marginTop: 8 }}>Nome</label>
            <input
              type="text"
              value={diagram.metadata.name ?? ""}
              onChange={(e) => updateMetadata({ name: e.target.value })}
              style={{ width: "100%", marginBottom: "1rem", padding: "0.4rem", borderRadius: "6px", border: "1px solid #ccc" }}
            />

            <label style={{ fontWeight: 600 }}>Comentários</label>
            <textarea
              value={diagram.metadata.comments ?? ""}
              onChange={(e) => updateMetadata({ comments: e.target.value })}
              placeholder="Adicione anotações ou observações..."
              style={{ width: "100%", height: "120px", borderRadius: "6px", padding: "0.4rem", border: "1px solid #ccc", resize: "vertical" }}
            />
          </>
        )}

        {/* ABA ELEMENTOS */}
        {activeTab === "elementos" && (
          <>
            <h2 style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: 8 }}>Elementos</h2>
            {diagram.elements.length === 0 && <p>Nenhum elemento adicionado.</p>}
            <ul style={{ listStyle: "none", padding: 0 }}>
              {diagram.elements.map((el) => (
                <li key={el.id}>
                  <button
                    onClick={() => onSelect(el.id)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "0.4rem",
                      borderRadius: "6px",
                      border: selectedId === el.id ? "2px solid #3b82f6" : "1px solid #ccc",
                      background: selectedId === el.id ? "#e0e7ff" : "transparent",
                      marginBottom: "0.3rem",
                      cursor: "pointer",
                    }}
                  >
                    {el.name || "(Sem nome)"} — {getElementTypeLabel(el.type)}
                  </button>
                </li>
              ))}
            </ul>

            {/* Se um elemento está selecionado, mostramos detalhes abaixo da lista */}
            {selectedElement && (
              <>
                <hr />
                <h3 style={{ marginTop: 8 }}>Detalhes do Elemento</h3>
                <p style={{ marginBottom: 6 }}>Tipo: <strong>{getElementTypeLabel(selectedElement.type)}</strong></p>
                <label style={{ fontWeight: 600 }}>Nome</label>
                <input type="text" value={selectedElement.name ?? ""} onChange={(e) => handleElementChange("name", e.target.value)}
                  style={{ width: "100%", marginBottom: "0.5rem", padding: "0.4rem", borderRadius: "6px", border: "1px solid #ccc" }} />
                <label style={{ fontWeight: 600 }}>Cor</label>
                <input type="color" value={(selectedElement as any).color ?? "#000000"} onChange={(e) => handleElementChange("color", e.target.value)}
                  style={{ width: "100%", height: "2rem", border: "none", marginTop: 8 }} />
              </>
            )}
          </>
        )}

        {/* ABA RELAÇÕES */}
        {activeTab === "relacoes" && (
          <>
            <h2 style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: 8 }}>Relações</h2>
            {diagram.relationships.length === 0 && <p>Nenhuma relação criada.</p>}
            <ul style={{ listStyle: "none", padding: 0 }}>
              {diagram.relationships.map((rel) => (
                <li key={rel.id}>
                  <button
                    onClick={() => onSelect(rel.id)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "0.4rem",
                      borderRadius: "6px",
                      border: selectedId === rel.id ? "2px solid #3b82f6" : "1px solid #ccc",
                      background: selectedId === rel.id ? "#e0e7ff" : "transparent",
                      marginBottom: "0.3rem",
                      cursor: "pointer",
                    }}
                  >
                    {getElementTypeLabel(rel.type)} {rel.label ? `(${rel.label})` : ""}
                  </button>
                </li>
              ))}
            </ul>

            {/* Se uma relação estiver selecionada, mostramos detalhes */}
            {selectedRel && (
              <>
                <hr />
                <h3 style={{ marginTop: 8 }}>Detalhes da Relação</h3>
                <p>Tipo atual: <strong>{getElementTypeLabel(selectedRel.type)}</strong></p>

                <label style={{ fontWeight: 600 }}>Tipo de relação</label>
                <select value={selectedRel.type} onChange={(e) => handleRelationshipChange("type", e.target.value as any)}
                  style={{ width: "100%", marginBottom: "0.5rem", padding: "0.4rem", borderRadius: "6px", border: "1px solid #ccc" }}>
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

                <label style={{ fontWeight: 600 }}>Rótulo</label>
                <input type="text" value={selectedRel.label ?? ""} onChange={(e) => handleRelationshipChange("label", e.target.value)}
                  style={{ width: "100%", marginBottom: "0.5rem", padding: "0.4rem", borderRadius: "6px", border: "1px solid #ccc" }} />

                {(selectedRel.type === "control_flow" || selectedRel.type === "object_flow") && (
                  <>
                    <label style={{ fontWeight: 600 }}>Condição (guard)</label>
                    <input type="text" value={selectedRel.guard ?? ""} onChange={(e) => handleRelationshipChange("guard", e.target.value)}
                      placeholder="[condição]"
                      style={{ width: "100%", marginBottom: "0.5rem", padding: "0.4rem", borderRadius: "6px", border: "1px solid #ccc" }} />
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </aside>
  );
};
