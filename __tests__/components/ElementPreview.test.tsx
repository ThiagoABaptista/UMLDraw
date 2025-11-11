/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ElementPreview } from '../../src/components/ElementPreview';
import { Tool } from '../../src/types/umlTypes';

// Mock do ElementIcon corrigido
jest.mock('../../src/components/ElementIcon', () => ({
  ElementIcon: ({ element, isSelected, ...props }: any) => (
    <div 
      data-testid="element-icon" 
      data-type={element.type} 
      data-selected={isSelected}
      {...props} 
    />
  ),
}));

// Mock do react-konva corrigido
jest.mock('react-konva', () => ({
  Group: ({ children, listening, ...props }: any) => (
    <div data-testid="konva-group" {...props}>
      {children}
    </div>
  ),
}));

describe('ElementPreview', () => {
  const defaultProps = {
    tool: 'activity' as Tool,
    x: 100,
    y: 100,
    size: 40,
    visible: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza preview quando visible é true', () => {
    render(<ElementPreview {...defaultProps} />);
    
    expect(screen.getByTestId('konva-group')).toBeInTheDocument();
    expect(screen.getByTestId('element-icon')).toBeInTheDocument();
  });

  it('não renderiza quando visible é false', () => {
    const { container } = render(<ElementPreview {...defaultProps} visible={false} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('renderiza diferentes tipos de ferramentas', () => {
    const tools: Tool[] = [
      'activity', 'actor', 'usecase', 'decision', 'start', 'end'
    ];

    tools.forEach(tool => {
      const { unmount } = render(<ElementPreview {...defaultProps} tool={tool} />);
      
      expect(screen.getByTestId('element-icon')).toHaveAttribute('data-type', tool);
      unmount();
    });
  });

  it('aplica posição corretamente', () => {
    render(<ElementPreview {...defaultProps} x={50} y={75} />);
    
    const group = screen.getByTestId('konva-group');
    expect(group).toBeInTheDocument();
  });

  it('usa tamanhos padrão do elemento', () => {
    render(<ElementPreview {...defaultProps} tool="actor" />);
    
    const elementIcon = screen.getByTestId('element-icon');
    expect(elementIcon).toHaveAttribute('data-type', 'actor');
  });
});