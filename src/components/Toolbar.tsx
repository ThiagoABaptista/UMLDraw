import React from 'react';
import { Tool } from '../types/umlTypes';

interface ToolbarProps {
  tool: Tool;
  onToolChange: (tool: Tool) => void;
  onAddClass: () => void;
  onToggleEdit: () => void;
  isEditing: boolean;
  selectedElement: string | null;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  tool,
  onToolChange,
  onAddClass,
  onToggleEdit,
  isEditing,
  selectedElement
}) => {
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
        style={{
          padding: '8px 16px',
          backgroundColor: tool === 'select' ? '#3b82f6' : 'white',
          color: tool === 'select' ? 'white' : '#374151',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        ✋ Selecionar
      </button>
      
      <button
        onClick={onAddClass}
        style={{
          padding: '8px 16px',
          backgroundColor: tool === 'class' ? '#3b82f6' : 'white',
          color: tool === 'class' ? 'white' : '#374151',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        ➕ Classe
      </button>

      <button
        onClick={() => onToolChange('association')}
        style={{
          padding: '8px 16px',
          backgroundColor: tool === 'association' ? '#3b82f6' : 'white',
          color: tool === 'association' ? 'white' : '#374151',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        ➡️ Associação
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

      <span style={{ marginLeft: 'auto', color: '#6b7280' }}>
        {selectedElement ? `Selecionado: ${selectedElement}` : 'Nenhum elemento selecionado'}
      </span>
    </div>
  );
};