// __tests__/components/UseCaseComponent.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { UseCaseComponent } from '../../src/components/UseCaseComponent';
import { UseCaseElement } from '../../src/types/umlTypes';

// Mock dos componentes
jest.mock('../../src/components/ElementIcon', () => ({
  ElementIcon: jest.fn((props) => (
    <div 
      data-testid="element-icon" 
      data-element={JSON.stringify(props.element)}
      data-is-selected={props.isSelected}
    />
  )),
}));

jest.mock('../../src/components/EditableText', () => ({
  EditableText: jest.fn((props) => (
    <div 
      data-testid="editable-text" 
      data-editing={props.isEditing}
      data-text={props.text}
      onClick={() => props.onEditEnd?.('Updated Text')}
    >
      {props.text}
    </div>
  )),
}));

// Mock melhorado do Konva - removendo propriedades inválidas
jest.mock('react-konva', () => ({
  Group: jest.fn(({ children, onClick, onDragEnd, onDragMove, draggable, listening, ...props }) => {
    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      onClick?.(e as any);
    };

    const handleDragEnd = (e: React.DragEvent) => {
      e.preventDefault();
      // Simula o objeto Konva com métodos x() e y()
      const mockKonvaEvent = {
        target: {
          x: () => 150,
          y: () => 150
        }
      };
      onDragEnd?.(mockKonvaEvent as any);
    };

    const handleDragMove = (e: React.DragEvent) => {
      e.preventDefault();
      const mockKonvaEvent = {
        target: {
          x: () => 120,
          y: () => 120
        }
      };
      onDragMove?.(mockKonvaEvent as any);
    };

    return (
      <div 
        data-testid="group" 
        data-x={props.x}
        data-y={props.y}
        data-draggable={draggable}
        onClick={handleClick}
        onDragEnd={handleDragEnd}
        onDrag={handleDragMove}
        style={{ cursor: draggable ? 'move' : 'default' }}
      >
        {children}
      </div>
    );
  }),
}));

describe('UseCaseComponent', () => {
  const mockElement: UseCaseElement = {
    id: 'elem1',
    type: 'actor',
    name: 'Test Actor',
    x: 100,
    y: 100,
    width: 60,
    height: 80,
    color: '#000000',
    isEditing: false,
  };

  const defaultProps = {
    element: mockElement,
    onDragMove: jest.fn(),
    onDragEnd: jest.fn(),
    onClick: jest.fn(),
    onTextEdit: jest.fn(),
    isSelected: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza elemento de ator', () => {
    render(<UseCaseComponent {...defaultProps} />);
    
    expect(screen.getByTestId('group')).toBeInTheDocument();
    expect(screen.getByTestId('element-icon')).toBeInTheDocument();
    expect(screen.getByTestId('editable-text')).toBeInTheDocument();
  });

  it('renderiza elemento de caso de uso', () => {
    const useCaseElement = {
      ...mockElement,
      type: 'usecase' as const,
    };
    
    render(<UseCaseComponent {...defaultProps} element={useCaseElement} />);
    
    expect(screen.getByTestId('element-icon')).toBeInTheDocument();
    expect(screen.getByText('Test Actor')).toBeInTheDocument();
  });

  it('chama onClick quando clicado', () => {
    render(<UseCaseComponent {...defaultProps} />);
    
    fireEvent.click(screen.getByTestId('group'));
    
    expect(defaultProps.onClick).toHaveBeenCalledWith('elem1');
  });

  it('chama onTextEdit quando texto é editado', () => {
    render(<UseCaseComponent {...defaultProps} />);
    
    fireEvent.click(screen.getByTestId('editable-text'));
    
    expect(defaultProps.onTextEdit).toHaveBeenCalledWith('elem1', 'Updated Text');
  });

  it('ativa modo edição quando isEditing é true e está selecionado', () => {
    const editingElement = {
      ...mockElement,
      isEditing: true,
    };
    
    render(<UseCaseComponent {...defaultProps} element={editingElement} isSelected={true} />);
    
    const editableText = screen.getByTestId('editable-text');
    expect(editableText).toHaveAttribute('data-editing', 'true');
  });

  it('não ativa modo edição quando não está selecionado', () => {
    const editingElement = {
      ...mockElement,
      isEditing: true,
    };
    
    render(<UseCaseComponent {...defaultProps} element={editingElement} isSelected={false} />);
    
    const editableText = screen.getByTestId('editable-text');
    expect(editableText).toHaveAttribute('data-editing', 'false');
  });

  it('chama onDragEnd quando arrastado', () => {
    render(<UseCaseComponent {...defaultProps} />);
    
    // Simula evento de drag end
    const group = screen.getByTestId('group');
    fireEvent.dragEnd(group);
    
    expect(defaultProps.onDragEnd).toHaveBeenCalledWith('elem1', 150, 150);
  });

  it('chama onDragMove quando arrastado', () => {
    render(<UseCaseComponent {...defaultProps} />);
    
    const group = screen.getByTestId('group');
    fireEvent.drag(group);
    
    expect(defaultProps.onDragMove).toHaveBeenCalledWith('elem1', 120, 120);
  });

  it('aplica propriedades de posição corretamente', () => {
    render(<UseCaseComponent {...defaultProps} />);
    
    const group = screen.getByTestId('group');
    expect(group).toHaveAttribute('data-x', '100');
    expect(group).toHaveAttribute('data-y', '100');
    expect(group).toHaveAttribute('data-draggable', 'true');
  });

  it('passa propriedades corretas para ElementIcon', () => {
    render(<UseCaseComponent {...defaultProps} />);
    
    const elementIcon = screen.getByTestId('element-icon');
    expect(elementIcon).toHaveAttribute('data-is-selected', 'false');
  });

  it('passa propriedades corretas quando selecionado', () => {
    render(<UseCaseComponent {...defaultProps} isSelected={true} />);
    
    const elementIcon = screen.getByTestId('element-icon');
    expect(elementIcon).toHaveAttribute('data-is-selected', 'true');
  });
});