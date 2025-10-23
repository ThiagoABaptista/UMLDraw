import React from "react";
import {
  User,
  Circle,
  Square,
  Diamond,
  ArrowRight,
  Save,
  Edit,
  FileDown,
  FolderOpen,
  X,
  Image as ImageIcon,
  Play,
  GitFork,
  GitMerge,
  CircleDot,
  Trash2,
  LayoutPanelLeft,
  PanelRight,
  FilePlus,
} from "lucide-react";
import { Tool, CreationState, RelationshipType } from "../types/umlTypes";

interface ToolbarProps {
  tool: Tool;
  onToolChange: (tool: Tool) => void;
  onToggleEdit: () => void;
  onSave: () => void;
  onSaveAs: () => void;
  onLoad: () => void;
  onExportPNG: () => void;
  onExportPDF: () => void;
  onDeleteRequested: () => void;
  isEditing: boolean;
  selectedElement: string | null;
  creationState: CreationState;
  connectionState: "idle" | "selecting-first" | "selecting-second";
  diagramType: "usecase" | "activity";
  selectedRelationshipType: RelationshipType;
  onRelationshipTypeChange: (type: RelationshipType) => void;
  onDiagramTypeChange: (type: "usecase" | "activity") => void;
  onToggleSidebar?: () => void;
  showSidebar?: boolean;
  onNewDiagram?: () => void;
  diagrams?: string[];
  currentDiagram?: string;
  onSwitchDiagram?: (name: string) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  tool,
  onToolChange,
  onToggleEdit,
  onSave,
  onSaveAs,
  onLoad,
  onExportPNG,
  onExportPDF,
  onDeleteRequested,
  isEditing,
  selectedElement,
  creationState,
  connectionState,
  diagramType,
  selectedRelationshipType,
  onRelationshipTypeChange,
  onDiagramTypeChange,
  onToggleSidebar,
  showSidebar = true,
  onNewDiagram,
  diagrams,
  currentDiagram,
  onSwitchDiagram,
}) => {
  const getButtonClass = (buttonTool: Tool) =>
    `toolbar-button ${tool === buttonTool ? "toolbar-button-primary" : "toolbar-button-secondary"}`;

  const getAvailableTools = (): Tool[] =>
    diagramType === "usecase"
      ? ["actor", "usecase", "relationship"]
      : ["activity", "decision", "relationship", "start", "end", "fork", "join", "merge"];

  const getToolIcon = (t: Tool) => {
    const icons: Record<Tool, JSX.Element> = {
      select: <Circle size={16} />,
      actor: <User size={16} />,
      usecase: <Circle size={16} />,
      relationship: <ArrowRight size={16} />,
      activity: <Square size={16} />,
      decision: <Diamond size={16} />,
      start: <Play size={16} />,
      end: <Square size={16} />,
      fork: <GitFork size={16} />,
      join: <GitMerge size={16} />,
      merge: <CircleDot size={16} />,
    };
    return icons[t];
  };

  const getToolName = (t: Tool): string => {
    const names: Record<Tool, string> = {
      select: "Selecionar",
      actor: "Ator",
      usecase: "Caso de Uso",
      relationship: "Relacionamento",
      activity: "Atividade",
      decision: "Decisão",
      start: "Início",
      end: "Fim",
      fork: "Fork",
      join: "Join",
      merge: "Merge",
    };
    return names[t];
  };

  const handleCancel = () => window.dispatchEvent(new Event("cancel-creation"));

  const getConnectionText = () => {
    if (connectionState === "selecting-first") return "Selecione o primeiro elemento...";
    if (connectionState === "selecting-second") return "Selecione o segundo elemento...";
    return "";
  };

  return (
    <div className="toolbar">
      <div className="toolbar-row"
      >
        {/* Tipo de Diagrama */}
        <div className="toolbar-section">
          <span className="toolbar-label">Tipo:</span>
          <select
            value={diagramType}
            onChange={(e) => onDiagramTypeChange(e.target.value as "usecase" | "activity")}
            className="toolbar-select"
            disabled={creationState !== "idle" || connectionState !== "idle"}
          >
            <option value="usecase">Casos de Uso</option>
            <option value="activity">Atividades</option>
          </select>
        </div>

        {/* Diagramas no Projeto */}
        {diagrams && diagrams.length > 0 && (
          <div className="toolbar-section">
            <span className="toolbar-label">Diagrama:</span>
            <select
              value={currentDiagram}
              onChange={(e) => onSwitchDiagram?.(e.target.value)}
              className="toolbar-select"
            >
              {diagrams.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        )}

        {/* Ferramentas */}
        <div 
          className="toolbar-section" 
          style={
            "flexGrow" in CSSStyleDeclaration.prototype ? { flexGrow: 1,justifyContent: "center" } : { flex: 1, justifyContent: "center" }
          }
        >
          <span className="toolbar-label">Ferramentas:</span>
          {getAvailableTools().map((availableTool) => (
            <button
              key={availableTool}
              onClick={() => onToolChange(availableTool)}
              className={getButtonClass(availableTool)}
              disabled={creationState !== "idle" && tool !== availableTool}
              title={getToolName(availableTool)}
            >
              {getToolIcon(availableTool)}
              <span>{getToolName(availableTool)}</span>
            </button>
          ))}
        </div>
        {/* Tipo de Relação */}
        {tool === "relationship" && (
          <div className="toolbar-section">
            <span className="toolbar-label">Relação:</span>
            <select
              value={selectedRelationshipType}
              onChange={(e) => onRelationshipTypeChange(e.target.value as RelationshipType)}
              className="toolbar-select"
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
          </div>
        )}
        <div className="toolbar-section" >
          {/* Excluir Elemento */}
          <button
            onClick={onDeleteRequested}
            className="toolbar-button toolbar-button-danger"
            disabled={!selectedElement || connectionState !== "idle" || creationState !== "idle"}
          >
              <Trash2 size={16} />
              <span>Excluir</span>
          </button>
        </div>
      </div>

      <div className="toolbar-row">
        {/* Ações */}
        <div className="toolbar-section">
          <span className="toolbar-label">Ações:</span>

          {/* Novo Diagrama */}
          {onNewDiagram && (
            <button
              onClick={onNewDiagram}
              className="toolbar-button toolbar-button-secondary"
              disabled={connectionState !== "idle" || creationState !== "idle"}
              title="Novo Diagrama"
            >
              <FilePlus size={16} />
              <span>Novo</span>
            </button>
          )}

          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="toolbar-button toolbar-button-secondary"
              title="Mostrar/Ocultar propriedades"
            >
              {showSidebar ? <PanelRight size={16} /> : <LayoutPanelLeft size={16} />}
              <span>{showSidebar ? "Ocultar Propriedades" : "Mostrar Propriedades"}</span>
            </button>
          )}

          {selectedElement && (
            <button
              onClick={onToggleEdit}
              className="toolbar-button toolbar-button-success"
              disabled={connectionState !== "idle" || creationState !== "idle"}
              title="Editar elemento"
            >
              {isEditing ? <Save size={16} /> : <Edit size={16} />}
              <span>{isEditing ? "Salvar" : "Editar"}</span>
            </button>
          )}

          <button
            onClick={onSave}
            className="toolbar-button toolbar-button-success"
            disabled={connectionState !== "idle" || creationState !== "idle"}
          >
            <Save size={16} />
            <span>Salvar</span>
          </button>

          <button
            onClick={onSaveAs}
            className="toolbar-button toolbar-button-secondary"
            disabled={connectionState !== "idle" || creationState !== "idle"}
          >
            <Save size={16} />
            <span>Salvar Como</span>
          </button>

          <button
            onClick={onLoad}
            className="toolbar-button toolbar-button-secondary"
            disabled={connectionState !== "idle" || creationState !== "idle"}
          >
            <FolderOpen size={16} />
            <span>Abrir</span>
          </button>

          <button
            onClick={onExportPNG}
            className="toolbar-button toolbar-button-export"
            disabled={connectionState !== "idle" || creationState !== "idle"}
          >
            <ImageIcon size={16} />
            <span>PNG</span>
          </button>

          <button
            onClick={onExportPDF}
            className="toolbar-button toolbar-button-export"
            disabled={connectionState !== "idle" || creationState !== "idle"}
          >
            <FileDown size={16} />
            <span>PDF</span>
          </button>
        </div>
      </div>
      <div className="toolbar-row">
        {/* Cancelar */}
        {(creationState === "placing" || connectionState !== "idle") && (
          <button
            onClick={handleCancel}
            className="toolbar-button toolbar-button-danger"
            title="Cancelar operação"
          >
            <X size={16} />
            <span>Cancelar</span>
          </button>
        )}
      </div> 
      <div className="toolbar-row">
        {/* Status */}
        <div className="toolbar-section toolbar-status-section">
          <span className="toolbar-status">
            {connectionState !== "idle"
              ? getConnectionText()
              : creationState === "placing"
              ? "Clique para posicionar o elemento..."
              : selectedElement
              ? `Selecionado: ${selectedElement.slice(0, 8)}...`
              : "Selecione ou crie novos elementos"}
          </span>
        </div>
      </div>
    </div>
  );
};
