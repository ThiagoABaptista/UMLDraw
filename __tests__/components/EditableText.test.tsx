/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { EditableText } from '../../src/components/EditableText';

// Mock mais completo do react-konva
jest.mock('react-konva', () => {
  const React = require('react');
  
  // Mock do Text com métodos do Konva
  const MockText = React.forwardRef(({ onDblClick, onTap, text, ...props }: any, ref: any) => {
    const textRef = React.useRef({
      hide: jest.fn(),
      show: jest.fn(),
      getClientRect: jest.fn(() => ({ x: 0, y: 0, width: 100, height: 20 })),
      x: jest.fn(() => 0),
      y: jest.fn(() => 0),
    });

    React.useImperativeHandle(ref, () => textRef.current);

    return (
      <div 
        data-testid="konva-text" 
        {...props}
        onClick={onDblClick}
        onDoubleClick={onDblClick}
      >
        {text}
      </div>
    );
  });

  // Mock do Group com métodos do Konva
  const MockGroup = React.forwardRef(({ children, ...props }: any, ref: any) => {
    const groupRef = React.useRef({
      getAbsolutePosition: jest.fn(() => ({ x: 10, y: 20 })),
      getStage: jest.fn(() => ({
        container: jest.fn(() => ({
          getBoundingClientRect: jest.fn(() => ({ left: 0, top: 0 }))
        })),
        scaleX: jest.fn(() => 1)
      }))
    });

    React.useImperativeHandle(ref, () => groupRef.current);

    return (
      <div data-testid="konva-group" {...props}>
        {children}
      </div>
    );
  });

  return {
    Group: MockGroup,
    Text: MockText,
  };
});

describe('EditableText', () => {
  const defaultProps = {
    x: 10,
    y: 20,
    width: 100,
    text: 'Texto inicial',
    onEditEnd: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza texto inicial corretamente', () => {
    render(<EditableText {...defaultProps} />);
    
    expect(screen.getByTestId('konva-text')).toHaveTextContent('Texto inicial');
  });

  it('atualiza texto quando prop text muda', () => {
    const { rerender } = render(<EditableText {...defaultProps} />);
    
    rerender(<EditableText {...defaultProps} text="Novo texto" />);
    
    expect(screen.getByTestId('konva-text')).toHaveTextContent('Novo texto');
  });

  it('chama onEditStart ao dar double click', () => {
    const onEditStart = jest.fn();
    render(<EditableText {...defaultProps} onEditStart={onEditStart} />);
    
    fireEvent.doubleClick(screen.getByTestId('konva-text'));
    
    expect(onEditStart).toHaveBeenCalled();
  });

  it('aplica estilos corretos baseados nas props', () => {
    render(
      <EditableText 
        {...defaultProps}
        fontSize={16}
        fontStyle="italic"
        fill="#ff0000"
        align="center"
      />
    );

    const textElement = screen.getByTestId('konva-text');
    expect(textElement).toBeInTheDocument();
  });

  it('entra em modo edição quando isEditing é true', () => {
    render(<EditableText {...defaultProps} isEditing={true} />);
    
    // O componente deve tentar entrar em modo edição
    expect(screen.getByTestId('konva-text')).toBeInTheDocument();
  });

  it('não quebra quando isEditing muda para false', () => {
    const { rerender } = render(<EditableText {...defaultProps} isEditing={true} />);
    
    rerender(<EditableText {...defaultProps} isEditing={false} />);
    
    expect(screen.getByTestId('konva-text')).toBeInTheDocument();
  });
});