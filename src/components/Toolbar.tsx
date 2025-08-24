import React from 'react';

interface ToolbarProps {
  tool: string;
  onToolChange: (tool: 'select' | 'class' | 'relationship') => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ tool, onToolChange }) => {
  return (
    <div style={{
      padding: '10px',
      backgroundColor: '#f3f4f6',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      gap: '10px'
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
        Selecionar
      </button>
      
      <button
        onClick={() => onToolChange('class')}
        style={{
          padding: '8px 16px',
          backgroundColor: tool === 'class' ? '#3b82f6' : 'white',
          color: tool === 'class' ? 'white' : '#374151',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        Adicionar Classe
      </button>
      
      <button
        onClick={() => onToolChange('relationship')}
        style={{
          padding: '8px 16px',
          backgroundColor: tool === 'relationship' ? '#3b82f6' : 'white',
          color: tool === 'relationship' ? 'white' : '#374151',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        Adicionar Relacionamento
      </button>
    </div>
  );
};