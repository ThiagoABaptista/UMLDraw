import React from 'react';
import { Tool } from '../types/umlTypes';

interface ToolbarProps {
  tool: Tool;
  onToolChange: (tool: Tool) => void;
  onToggleEdit: () => void;
  isEditing: boolean;
  selectedElement: string | null;
  creationState: 'idle' | 'placing' | 'connecting';
}

export const Toolbar: React.FC<ToolbarProps> = ({
  tool,
  onToolChange,
  onToggleEdit,
  isEditing,
  selectedElement,
  creationState
}) => {
  const getButtonStyle = (buttonTool: Tool) => ({
    padding: '8px 16px',
    backgroundColor: tool === buttonTool ? '#3b82f6' : 'white',
    color: tool === buttonTool ? 'white' : '#374151',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    cursor: creationState === 'placing' ? 'default' : 'pointer',
    opacity: creationState === 'placing' && tool !== buttonTool ? 0.5 : 1
  });

  return (
    <div style={{
      padding: '10px',
      backgroundColor: '#f3f4f6',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      gap: '10px',
      alignItems: 'center'
    }}>
      <button
        onClick={() => onToolChange('select')}
        style={getButtonStyle('select')}
        disabled={creationState === 'placing'}
      >
        ✋ Selecionar
      </button>
      
      <button
        onClick={() => onToolChange('class')}
        style={getButtonStyle('class')}
        disabled={creationState === 'placing'}
      >
        {creationState === 'placing' ? '📍 Clique na tela...' : '➕ Classe'}
      </button>

      <button
        onClick={() => onToolChange('association')}
        style={getButtonStyle('association')}
        disabled={creationState === 'placing'}
      >
        ➡️ Associação
      </button>

      <button
        onClick={() => onToolChange('inheritance')}
        style={getButtonStyle('inheritance')}
        disabled={creationState === 'placing'}
      >
        ⬆️ Herança
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
        >
          {isEditing ? '💾 Salvar' : '✏️ Editar'}
        </button>
      )}

      {creationState === 'placing' && (
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

      <span style={{ marginLeft: 'auto', color: '#6b7280' }}>
        {creationState === 'placing' ? 'Clique na tela para posicionar' : 
         selectedElement ? `Selecionado: ${selectedElement}` : 'Nenhum elemento selecionado'}
      </span>
    </div>
  );
};