import React from 'react';
import {
  User, Circle, Square, Diamond, ArrowRight,
  Save, Edit, FileDown, FolderOpen, X, Image as ImageIcon,
  Play, GitFork, GitMerge, CircleDot
} from 'lucide-react';
import { Tool, CreationState } from '../types/umlTypes';

// Definir um tipo sem o 'select'
type AvailableTool = Exclude<Tool, 'select'>;

interface ToolbarProps {
  tool: Tool;
  onToolChange: (tool: Tool) => void;
  onToggleEdit: () => void;
  onSave: () => void;
  onLoad: () => void;
  onExportPNG: () => void;
  onExportPDF: () => void;
  isEditing: boolean;
  selectedElement: string | null;
  creationState: CreationState;
  connectionState: 'idle' | 'selecting-first' | 'selecting-second';
  diagramType: 'usecase' | 'activity';
  onDiagramTypeChange: (type: 'usecase' | 'activity') => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  tool,
  onToolChange,
  onToggleEdit,
  onSave,
  onLoad,
  onExportPNG,
  onExportPDF,
  isEditing,
  selectedElement,
  creationState,
  connectionState,
  diagramType,
  onDiagramTypeChange
}) => {
  const getButtonClass = (buttonTool: AvailableTool) => {
    const baseClass = 'toolbar-button';
    const isActive = tool === buttonTool;
    if (isActive) return `${baseClass} toolbar-button-primary`;
    return `${baseClass} toolbar-button-secondary`;
  };

  const getConnectionText = () => {
    if (connectionState === 'selecting-first') return 'Selecione o primeiro elemento...';
    if (connectionState === 'selecting-second') return 'Selecione o segundo elemento...';
    return '';
  };

  const getToolName = (toolType: AvailableTool): string => {
    const names: Record<AvailableTool, string> = {
      actor: 'Ator',
      usecase: 'Caso de Uso',
      activity: 'Atividade',
      decision: 'Decisão',
      relationship: 'Relacionamento',
      start: 'Início',
      end: 'Fim',
      fork: 'Fork',
      join: 'Join',
      merge: 'Merge'
    };
    return names[toolType];
  };

  const getButtonIcon = (tool: AvailableTool): JSX.Element => {
    const icons: Record<AvailableTool, JSX.Element> = {
      actor: <User size={16} />,
      usecase: <Circle size={16} />,
      activity: <Square size={16} />,
      decision: <Diamond size={16} />,
      relationship: <ArrowRight size={16} />,
      start: <Play size={16} />,
      end: <Square size={16} />,
      fork: <GitFork size={16} />,
      join: <GitMerge size={16} />,
      merge: <CircleDot size={16} />
    };
    return icons[tool];
  };

  const getAvailableTools = (): AvailableTool[] => {
    if (diagramType === 'usecase') {
      return ['actor', 'usecase', 'relationship'];
    } else {
      return ['activity', 'decision', 'relationship', 'start', 'end', 'fork', 'join', 'merge'];
    }
  };

  // Função para cancelar operações em andamento
  const handleCancel = () => {
    // Volta para a primeira ferramenta disponível
    const availableTools = getAvailableTools();
    if (availableTools.length > 0) {
      onToolChange(availableTools[0]);
    }
  };

  // Converter o tool atual para AvailableTool (removendo 'select' se necessário)
  const currentTool = tool === 'select' ? getAvailableTools()[0] : tool as AvailableTool;

  return (
    <div className="toolbar">
      {/* Seletor de Tipo de Diagrama */}
      <div className="toolbar-section">
        <span className="toolbar-label">Tipo de Diagrama:</span>
        <select 
          value={diagramType}
          onChange={(e) => onDiagramTypeChange(e.target.value as 'usecase' | 'activity')}
          className="toolbar-select"
          disabled={creationState !== 'idle' || connectionState !== 'idle'}
        >
          <option value="usecase">Caso de Uso</option>
          <option value="activity">Atividade</option>
        </select>
      </div>

      {/* Ferramentas */}
      <div className="toolbar-section">
        <span className="toolbar-label">Ferramentas:</span>
        {getAvailableTools().map((availableTool) => (
          <button
            key={availableTool}
            onClick={() => onToolChange(availableTool)}
            className={getButtonClass(availableTool)}
            disabled={creationState !== 'idle' && tool !== availableTool}
            title={getToolName(availableTool)}
          >
            {getButtonIcon(availableTool)}
            <span>{getToolName(availableTool)}</span>
          </button>
        ))}
      </div>

      {/* Ações */}
      <div className="toolbar-section">
        <span className="toolbar-label">Ações:</span>
        {selectedElement && (
          <button
            onClick={onToggleEdit}
            className="toolbar-button toolbar-button-success"
            disabled={connectionState !== 'idle' || creationState !== 'idle'}
            title="Editar elemento"
          >
            {isEditing ? <Save size={16}/> : <Edit size={16}/>}
            <span>{isEditing ? 'Salvar' : 'Editar'}</span>
          </button>
        )}

        <button onClick={onSave} className="toolbar-button toolbar-button-success" disabled={connectionState !== 'idle' || creationState !== 'idle'}>
          <Save size={16}/> <span>Salvar</span>
        </button>

        <button onClick={onLoad} className="toolbar-button toolbar-button-secondary" disabled={connectionState !== 'idle' || creationState !== 'idle'}>
          <FolderOpen size={16}/> <span>Abrir</span>
        </button>

        <button onClick={onExportPNG} className="toolbar-button toolbar-button-export" disabled={connectionState !== 'idle' || creationState !== 'idle'}>
          <ImageIcon size={16}/> <span>PNG</span>
        </button>

        <button onClick={onExportPDF} className="toolbar-button toolbar-button-export" disabled={connectionState !== 'idle' || creationState !== 'idle'}>
          <FileDown size={16}/> <span>PDF</span>
        </button>
      </div>

      {/* Status */}
      <div className="toolbar-section toolbar-status-section">
        <span className="toolbar-status">
          {connectionState !== 'idle' ? getConnectionText() :
           creationState === 'placing' ? `Clique para posicionar ${getToolName(currentTool).toLowerCase()}` : 
           selectedElement ? `Selecionado: ${selectedElement.slice(0, 8)}...` : 
           'Clique em um elemento para selecionar ou use as ferramentas para criar novos'}
        </span>
      </div>

      {/* Cancelar */}
      {(creationState === 'placing' || connectionState !== 'idle') && (
        <button onClick={handleCancel} className="toolbar-button toolbar-button-danger" title="Cancelar operação">
          <X size={16}/> <span>Cancelar</span>
        </button>
      )}
    </div>
  );
};