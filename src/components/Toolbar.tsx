import React, { useState } from "react";
import {
  User, Square, Diamond, ArrowRight, Save,
  FileDown, FolderOpen, X, Image as ImageIcon,
  GitFork, GitMerge, Trash2, LayoutPanelLeft,
  PanelRight, FilePlus, ChevronUp, ChevronDown, Merge,
  Circle,
  CircleDot,
  RectangleHorizontal
} from "lucide-react";
import { Tool, CreationState, RelationshipType } from "../types/umlTypes";

interface ToolbarProps {
  tool: Tool;
  onToolChange: (tool: Tool) => void;
  onSave: () => void;
  onLoad: () => void;
  onExportPNG: () => void;
  onExportPDF: () => void;
  onDeleteRequested: () => void;
  creationState: CreationState;
  connectionState: "idle" | "selecting-first" | "selecting-second";
  diagramType: "usecase" | "activity";
  selectedRelationshipType: RelationshipType;
  onRelationshipTypeChange: (type: RelationshipType) => void;
  onDiagramTypeChange: (type: "usecase" | "activity") => void;
  onToggleSidebar?: () => void;
  showSidebar?: boolean;
  onNewDiagram?: () => void;
  projectName: string;
  onProjectNameChange: (newName: string) => void;
  selectedElement?: string | null; 
}

export const Toolbar: React.FC<ToolbarProps> = ({
  tool,
  onToolChange,
  onSave,
  onLoad,
  onExportPNG,
  onExportPDF,
  onDeleteRequested,
  creationState,
  connectionState,
  diagramType,
  selectedRelationshipType,
  onRelationshipTypeChange,
  onDiagramTypeChange,
  onToggleSidebar,
  showSidebar = true,
  onNewDiagram,
  projectName,
  onProjectNameChange,
  selectedElement,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(projectName);

  const getToolIcon = (t: Tool) => {
    const color = "#111827";

    const shapeStyle: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "22px",
      height: "22px",
      position: "relative",
    };

    switch (t) {
      case "select":
        return (
          <div style={shapeStyle}>
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: "10px solid transparent",
                borderRight: "10px solid transparent",
                borderBottom: `14px solid ${color}`,
                transform: "rotate(90deg)",
                opacity: 0.8,
              }}
            />
          </div>
        );

      case "actor":
        return (
          <User size={18} />
        );

      case "usecase":
        return (
          <div style={shapeStyle}>
            <div
              style={{
                width: "20px",
                height: "12px",
                borderRadius: "50%",
                border: `1.5px solid ${color}`,
              }}
            />
          </div>
        );

      case "relationship":
        return (
          <div style={shapeStyle}>
            <ArrowRight size={20} strokeWidth={2} color={color} />
          </div>
        );

      case "activity":
        return (
          <RectangleHorizontal size={18} />
        );

      case "decision":
        return (
          <Diamond size={18} />
        );

      case "start":
        return (
          <Circle size={18} />
        );

      case "end":
        return (
          <CircleDot size={18} />
        );

      case "fork":
        return (
          <GitFork size={18} />
        );
      case "join":
        return (
          <GitMerge size={18} />
        );

      case "merge":
        return (
           <Merge size={18} />
        );



      default:
        return <Square size={20} color={color} />;
    }
  };

  const getAvailableTools = (): Tool[] =>
    diagramType === "usecase"
      ? ["actor", "usecase", "relationship"]
      : ["activity", "decision", "relationship", "start", "end", "fork", "join", "merge"];

  const handleCancel = () => window.dispatchEvent(new Event("cancel-creation"));

  const getConnectionText = () => {
    if (connectionState === "selecting-first") return "Selecione o primeiro elemento...";
    if (connectionState === "selecting-second") return "Selecione o segundo elemento...";
    return "";
  };

  const handleBlur = () => {
    setIsEditingName(false);
    const newName = tempName.trim();
    if (newName && newName !== projectName) onProjectNameChange(newName);
  };

  if (collapsed) {
    return (
      <div className="toolbar toolbar-collapsed">
        <div className="toolbar-header">
          {isEditingName ? (
            <input
              className="editable-title-input"
              value={tempName}
              autoFocus
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={(e) => e.key === "Enter" && handleBlur()}
            />
          ) : (
            <span
              className="toolbar-project-name"
              title="Duplo clique para renomear projeto"
              onDoubleClick={() => setIsEditingName(true)}
            >
              {projectName}
            </span>
          )}

          <button
            className="toolbar-toggle"
            title="Expandir Toolbar"
            onClick={() => setCollapsed(false)}
          >
            <ChevronDown size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`toolbar ${(creationState === "placing" || connectionState !== "idle") ? "active-mode" : ""}`}>
      <div className="toolbar-header">
        {isEditingName ? (
          <input
            className="editable-title-input"
            value={tempName}
            autoFocus
            onChange={(e) => setTempName(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => e.key === "Enter" && handleBlur()}
          />
        ) : (
          <h2
            className="toolbar-project-name"
            title="Duplo clique para renomear projeto"
            onDoubleClick={() => setIsEditingName(true)}
          >
            {projectName}
          </h2>
        )}

        <button
          className="toolbar-toggle"
          title="Recolher Toolbar"
          onClick={() => setCollapsed(true)}
        >
          <ChevronUp size={18} />
        </button>
      </div>

      <div className="toolbar-row">
        <select
          value={diagramType}
          onChange={(e) => onDiagramTypeChange(e.target.value as "usecase" | "activity")}
          className="toolbar-select"
          title="Selecionar tipo de diagrama"
        >
          <option value="usecase">Casos de Uso</option>
          <option value="activity">Atividades</option>
        </select>

        {getAvailableTools().map((t) => (
          <button
            key={t}
            onClick={() => onToolChange(t)}
            className={`toolbar-icon-button ${tool === t ? "active" : ""}`}
            title={{
              actor: "Ator",
              usecase: "Caso de Uso",
              relationship: "Relacionamento",
              activity: "Atividade",
              decision: "Decisão",
              start: "Início",
              end: "Fim",
              fork: "Ramo Paralelo (Fork)",
              join: "Junção (Join)",
              merge: "Mesclagem (Merge)",
              select: "Selecionar",
            }[t] || t}
          >
            {getToolIcon(t)}
          </button>
        ))}

        <button onClick={onSave} className="toolbar-icon-button" title="Salvar">
          <Save size={18} />
        </button>

        <button onClick={onLoad} className="toolbar-icon-button" title="Abrir">
          <FolderOpen size={18} />
        </button>

        <button onClick={onExportPNG} className="toolbar-icon-button" title="Exportar PNG">
          <ImageIcon size={18} />
        </button>

        <button onClick={onExportPDF} className="toolbar-icon-button" title="Exportar PDF">
          <FileDown size={18} />
        </button>

        <button
          onClick={onDeleteRequested}
          className="toolbar-icon-button danger"
          title="Excluir elemento selecionado"
          disabled={!selectedElement || connectionState !== "idle" || creationState !== "idle"} 
        >
          <Trash2 size={18} />
        </button>

        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="toolbar-icon-button"
            title={showSidebar ? "Ocultar propriedades" : "Mostrar propriedades"}
          >
            {showSidebar ? <PanelRight size={18} /> : <LayoutPanelLeft size={18} />}
          </button>
        )}
      </div>

      {(tool === "relationship" || connectionState !== "idle" || creationState === "placing") && (
        <div className="toolbar-row toolbar-relationship-row">
          {tool === "relationship" && (
            <select
              value={selectedRelationshipType}
              onChange={(e) => onRelationshipTypeChange(e.target.value as RelationshipType)}
              className="toolbar-select"
              title="Tipo de relacionamento"
            >
              {diagramType === "usecase" ? (
                <>
                  <option value="association">Associação</option>
                  <option value="include">Include</option>
                  <option value="extend">Extend</option>
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
          )}

          {(creationState === "placing" || connectionState !== "idle") && (
            <button
              onClick={handleCancel}
              className="toolbar-icon-button danger"
              title="Cancelar operação atual"
            >
              <X size={18} />
            </button>
          )}

          <span className="toolbar-status">{getConnectionText()}</span>
        </div>
      )}
    </div>
  );
};
