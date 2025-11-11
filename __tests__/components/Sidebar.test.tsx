import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from '../../src/components/Sidebar';
import { UMLDiagram } from '../../src/types/umlTypes';

// Mock para evitar erros de Konva
jest.mock('react-konva', () => ({
  Line: jest.fn(() => null),
}));

describe('Sidebar', () => {
  const mockDiagram: UMLDiagram = {
    metadata: {
      name: 'Test Diagram',
      type: 'usecase',
      version: '1.0',
      created: '2024-01-01',
      lastModified: '2024-01-01',
    },
    elements: [
      {
        id: 'elem1',
        type: 'actor',
        name: 'Test Actor',
        x: 100,
        y: 100,
        width: 60,
        height: 80,
        color: '#000000',
      },
      {
        id: 'elem2',
        type: 'usecase',
        name: 'Test Use Case',
        x: 200,
        y: 200,
        width: 120,
        height: 60,
        color: '#000000',
      },
    ],
    relationships: [
      {
        id: 'rel1',
        type: 'association',
        from: 'elem1',
        to: 'elem2',
        label: 'Test Label',
      },
    ],
  };

  const defaultProps = {
    selectedId: null,
    diagram: mockDiagram,
    onUpdate: jest.fn(),
    onSelect: jest.fn(),
    onClearSelection: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ... outros testes permanecem iguais ...

  it('mostra detalhes da relação selecionada', () => {
    render(<Sidebar {...defaultProps} selectedId="rel1" />);
    
    // Quando uma relação está selecionada, a aba Relações é automaticamente ativada
    const typeSelect = screen.getByDisplayValue('Associação'); // Busca pelo texto exibido
    expect(typeSelect).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Label')).toBeInTheDocument();
  });

  it('atualiza tipo da relação', () => {
    render(<Sidebar {...defaultProps} selectedId="rel1" />);
    
    const typeSelect = screen.getByDisplayValue('Associação');
    fireEvent.change(typeSelect, {
      target: { value: 'include' },
    });
    
    expect(defaultProps.onUpdate).toHaveBeenCalled();
  });

  it('atualiza nome do diagrama', () => {
    render(<Sidebar {...defaultProps} />);
    
    const nameInput = screen.getByDisplayValue('Test Diagram');
    fireEvent.change(nameInput, {
      target: { value: 'Updated Diagram' },
    });
    
    expect(defaultProps.onUpdate).toHaveBeenCalled();
  });

  it('mostra mensagem quando não há elementos', () => {
    const emptyDiagram = {
      ...mockDiagram,
      elements: [],
    };
    
    render(<Sidebar {...defaultProps} diagram={emptyDiagram} />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Elementos' }));
    
    expect(screen.getByText('Nenhum elemento criado.')).toBeInTheDocument();
  });

  it('mostra mensagem quando não há relações', () => {
    const emptyDiagram = {
      ...mockDiagram,
      relationships: [],
    };
    
    render(<Sidebar {...defaultProps} diagram={emptyDiagram} />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Relações' }));
    
    expect(screen.getByText('Nenhuma relação criada.')).toBeInTheDocument();
  });

  it('muda automaticamente para aba elementos quando elemento é selecionado', () => {
    const { rerender } = render(<Sidebar {...defaultProps} selectedId={null} />);
    
    // Inicialmente na aba geral
    expect(screen.getByDisplayValue('Test Diagram')).toBeInTheDocument();
    
    // Seleciona um elemento
    rerender(<Sidebar {...defaultProps} selectedId="elem1" />);
    
    // Deve mudar automaticamente para aba elementos
    expect(screen.getByDisplayValue('Test Actor')).toBeInTheDocument();
  });

  it('muda automaticamente para aba relações quando relação é selecionada', () => {
    const { rerender } = render(<Sidebar {...defaultProps} selectedId={null} />);
    
    // Inicialmente na aba geral
    expect(screen.getByDisplayValue('Test Diagram')).toBeInTheDocument();
    
    // Seleciona uma relação
    rerender(<Sidebar {...defaultProps} selectedId="rel1" />);
    
    // Deve mudar automaticamente para aba relações
    expect(screen.getByDisplayValue('Test Label')).toBeInTheDocument();
  });

  it('permite editar comentários do diagrama', () => {
    render(<Sidebar {...defaultProps} />);
    
    const commentsTextarea = screen.getByPlaceholderText('Adicione observações...');
    fireEvent.change(commentsTextarea, {
      target: { value: 'Novo comentário' },
    });
    
    expect(defaultProps.onUpdate).toHaveBeenCalled();
  });
});