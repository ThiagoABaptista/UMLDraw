import React from 'react';
import { Tool, CreationState } from '../types/umlTypes';

interface ToolbarProps {
  tool: Tool;
  onToolChange: (tool: Tool) => void;
  onToggleEdit: () => void;
  onSave: () => void;
  onLoad: () => void;
  isEditing: boolean;
  selectedElement: string | null;
  creationState: CreationState;
  connectionState: 'idle' | 'selecting-first' | 'selecting-second';
}

export const Toolbar: React.FC<ToolbarProps> = ({
  tool,
  onToolChange,
  onToggleEdit,
  onSave,
  onLoad,
  isEditing,
  selectedElement,
  creationState,
  connectionState
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

  return (
    <div className="toolbar">
      <button
        onClick={() => onToolChange('select')}
        className={getButtonClass('select')}
        disabled={creationState !== 'idle'}
      >
        ✋ Selecionar
      </button>
      
      <button
        onClick={() => onToolChange('class')}
        className={getButtonClass('class')}
        disabled={creationState !== 'idle'}
      >
        {creationState === 'placing' ? '📍 Clique na tela...' : '➕ Classe'}
      </button>

      <button
        onClick={() => onToolChange('relationship')}
        className={getButtonClass('relationship')}
        disabled={creationState !== 'idle'}
      >
        {connectionState !== 'idle' ? '🔗 Conectando...' : '➡️ Associação'}
      </button>

      {selectedElement && (
        <button
          onClick={onToggleEdit}
          className="toolbar-button toolbar-button-success"
          disabled={connectionState !== 'idle'}
        >
          {isEditing ? '💾 Salvar' : '✏️ Editar'}
        </button>
      )}

      <button
        onClick={onSave}
        className="toolbar-button toolbar-button-success"
        disabled={connectionState !== 'idle'}
      >
        💾 Salvar
      </button>

      <button
        onClick={onLoad}
        className="toolbar-button toolbar-button-secondary"
        disabled={connectionState !== 'idle'}
      >
        📂 Abrir
      </button>

      {(creationState === 'placing' || connectionState !== 'idle') && (
        <button
          onClick={() => onToolChange('select')}
          className="toolbar-button toolbar-button-danger"
        >
          ❌ Cancelar
        </button>
      )}

      <span className="toolbar-status">
        {connectionState !== 'idle' ? getConnectionText() :
         creationState === 'placing' ? 'Clique na tela para posicionar' : 
         selectedElement ? `Selecionado: ${selectedElement}` : 'Nenhum elemento selecionado'}
      </span>
    </div>
  );
};