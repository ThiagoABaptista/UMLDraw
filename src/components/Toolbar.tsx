import React, { useState } from "react";
import {
  User, Circle, Square, Diamond, ArrowRight, Save,
  FileDown, FolderOpen, X, Image as ImageIcon, Play,
  GitFork, GitMerge, CircleDot, Trash2, LayoutPanelLeft,
  PanelRight, FilePlus, ChevronUp, ChevronDown
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
    const icons: Record<Tool, JSX.Element> = {
      select: <Circle size={18} />,
      actor: <User size={18} />,
      usecase: <Circle size={18} />,
      relationship: <ArrowRight size={18} />,
      activity: <Square size={18} />,
      decision: <Diamond size={18} />,
      start: <Play size={18} />,
      end: <Square size={18} />,
      fork: <GitFork size={18} />,
      join: <GitMerge size={18} />,
      merge: <CircleDot size={18} />,
    };
    return icons[t];
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

  console.log(`Selected Element: ${selectedElement}`);
  console.log(`Connection State: ${connectionState}`);
  console.log(`Creation State: ${creationState}`);

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
            title={t.charAt(0).toUpperCase() + t.slice(1)}
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

        {onNewDiagram && (
          <button onClick={onNewDiagram} className="toolbar-icon-button" title="Novo Diagrama">
            <FilePlus size={18} />
          </button>
        )}

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
