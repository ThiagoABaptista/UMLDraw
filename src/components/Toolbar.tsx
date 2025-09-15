import React from 'react';
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
    const isDisabled = creationState !== 'idle';
    
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

      {/* Ferramentas do Diagrama */}
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
            {creationState === 'placing' && tool === availableTool ? 
              `📍 ${getToolName(availableTool)}...` : 
              getButtonIcon(availableTool) + ' ' + getToolName(availableTool)}
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
            {isEditing ? '💾 Salvar' : '✏️ Editar'}
          </button>
        )}

        <button
          onClick={onSave}
          className="toolbar-button toolbar-button-success"
          disabled={connectionState !== 'idle'}
          title="Salvar diagrama"
        >
          💾 Salvar
        </button>

        <button
          onClick={onLoad}
          className="toolbar-button toolbar-button-secondary"
          disabled={connectionState !== 'idle'}
          title="Abrir diagrama"
        >
          📂 Abrir
        </button>

        <button
          onClick={onExportPNG}
          className="toolbar-button toolbar-button-export"
          disabled={connectionState !== 'idle'}
          title="Exportar como PNG"
        >
          🖼️ PNG
        </button>

        <button
          onClick={onExportPDF}
          className="toolbar-button toolbar-button-export"
          disabled={connectionState !== 'idle'}
          title="Exportar como PDF"
        >
          📄 PDF
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
        <button
          onClick={() => onToolChange('select')}
          className="toolbar-button toolbar-button-danger"
          title="Cancelar operação"
        >
          ❌ Cancelar
        </button>
      )}
    </div>
  );
};

// Helper para ícones das ferramentas
const getButtonIcon = (tool: Tool): string => {
  const icons = {
    select: '✋',
    actor: '👤',
    usecase: '○',
    activity: '▭',
    decision: '◇',
    relationship: '➡️'
  };
  return icons[tool];
};