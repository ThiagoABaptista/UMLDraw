import React from 'react';
import {
  User, Circle, Square, Diamond, ArrowRight, MousePointer,
  Save, Edit, FileDown, FolderOpen, X, Image as ImageIcon
} from 'lucide-react';
import { Tool, CreationState } from '../types/umlTypes';

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
  const getButtonClass = (buttonTool: Tool) => {
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

  const getToolName = (toolType: Tool) => {
    const names = {
      select: 'Selecionar',
      actor: 'Ator',
      usecase: 'Caso de Uso',
      activity: 'Atividade',
      decision: 'Decisão',
      relationship: 'Relacionamento'
    };
    return names[toolType];
  };

  const getButtonIcon = (tool: Tool): JSX.Element => {
    const icons: Record<Tool, JSX.Element> = {
      select: <MousePointer size={16} />,
      actor: <User size={16} />,
      usecase: <Circle size={16} />,
      activity: <Square size={16} />,
      decision: <Diamond size={16} />,
      relationship: <ArrowRight size={16} />,
    };
    return icons[tool];
  };

  const getAvailableTools = (): Tool[] => {
    if (diagramType === 'usecase') {
      return ['select', 'actor', 'usecase', 'relationship'];
    } else {
      return ['select', 'activity', 'decision', 'relationship'];
    }
  };

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
            disabled={connectionState !== 'idle'}
            title="Editar elemento"
          >
            {isEditing ? <Save size={16}/> : <Edit size={16}/>}
            <span>{isEditing ? 'Salvar' : 'Editar'}</span>
          </button>
        )}

        <button onClick={onSave} className="toolbar-button toolbar-button-success" disabled={connectionState !== 'idle'}>
          <Save size={16}/> <span>Salvar</span>
        </button>

        <button onClick={onLoad} className="toolbar-button toolbar-button-secondary" disabled={connectionState !== 'idle'}>
          <FolderOpen size={16}/> <span>Abrir</span>
        </button>

        <button onClick={onExportPNG} className="toolbar-button toolbar-button-export" disabled={connectionState !== 'idle'}>
          <ImageIcon size={16}/> <span>PNG</span>
        </button>

        <button onClick={onExportPDF} className="toolbar-button toolbar-button-export" disabled={connectionState !== 'idle'}>
          <FileDown size={16}/> <span>PDF</span>
        </button>
      </div>

      {/* Status */}
      <div className="toolbar-section toolbar-status-section">
        <span className="toolbar-status">
          {connectionState !== 'idle' ? getConnectionText() :
           creationState === 'placing' ? `Clique para posicionar ${getToolName(tool).toLowerCase()}` : 
           selectedElement ? `Selecionado: ${selectedElement.slice(0, 8)}...` : 
           diagramType === 'usecase' ? 'Diagrama de Caso de Uso' : 'Diagrama de Atividade'}
        </span>
      </div>

      {/* Cancelar */}
      {(creationState === 'placing' || connectionState !== 'idle') && (
        <button onClick={() => onToolChange('select')} className="toolbar-button toolbar-button-danger" title="Cancelar operação">
          <X size={16}/> <span>Cancelar</span>
        </button>
      )}
    </div>
  );
};
