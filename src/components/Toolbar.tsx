import React from 'react';
import { Tool, CreationState } from '../types/umlTypes';

interface ToolbarProps {
  tool: Tool;
  onToolChange: (tool: Tool) => void;
  onToggleEdit: () => void;
  isEditing: boolean;
  selectedElement: string | null;
  creationState: CreationState;
  connectionState: 'idle' | 'selecting-first' | 'selecting-second';
}

export const Toolbar: React.FC<ToolbarProps> = ({
  tool,
  onToolChange,
  onToggleEdit,
  isEditing,
  selectedElement,
  creationState,
  connectionState
}) => {
  const getButtonStyle = (buttonTool: Tool) => ({
    padding: '8px 16px',
    backgroundColor: tool === buttonTool ? '#3b82f6' : 'white',
    color: tool === buttonTool ? 'white' : '#374151',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    cursor: creationState !== 'idle' ? 'default' : 'pointer',
    opacity: creationState !== 'idle' && tool !== buttonTool ? 0.5 : 1
  });

  const getConnectionText = () => {
    if (connectionState === 'selecting-first') return 'Selecione o primeiro elemento...';
    if (connectionState === 'selecting-second') return 'Selecione o segundo elemento...';
    return '';
  };

  return (
    <div style={{
      padding: '10px',
      backgroundColor: '#f3f4f6',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
      flexWrap: 'wrap'
    }}>
      <button
        onClick={() => onToolChange('select')}
        style={getButtonStyle('select')}
        disabled={creationState !== 'idle'}
      >
        ✋ Selecionar
      </button>
      
      <button
        onClick={() => onToolChange('class')}
        style={getButtonStyle('class')}
        disabled={creationState !== 'idle'}
      >
        {creationState === 'placing' ? '📍 Clique na tela...' : '➕ Classe'}
      </button>

      <button
        onClick={() => onToolChange('relationship')}
        style={getButtonStyle('relationship')}
        disabled={creationState !== 'idle'}
      >
        {connectionState !== 'idle' ? '🔗 Conectando...' : '➡️ Associação'}
      </button>

      {selectedElement && (
        <button
          onClick={onToggleEdit}
          style={{
            padding: '8px 16px',
            backgroundColor: isEditing ? '#ef4444' : '#10b981',
            color: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
          disabled={connectionState !== 'idle'}
        >
          {isEditing ? '💾 Salvar' : '✏️ Editar'}
        </button>
      )}

      {(creationState === 'placing' || connectionState !== 'idle') && (
        <button
          onClick={() => onToolChange('select')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          ❌ Cancelar
        </button>
      )}

      <span style={{ marginLeft: 'auto', color: '#6b7280', minWidth: '200px' }}>
        {connectionState !== 'idle' ? getConnectionText() :
         creationState === 'placing' ? 'Clique na tela para posicionar' : 
         selectedElement ? `Selecionado: ${selectedElement}` : 'Nenhum elemento selecionado'}
      </span>
    </div>
  );
};