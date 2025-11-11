/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DiagramTabs } from '../../src/components/DiagramTabs';
import { UMLDiagram } from '../../src/types/umlTypes';

// Mock simples dos ícones - apenas para evitar erros
jest.mock('lucide-react', () => ({
  X: (props: any) => <span {...props}>×</span>,
  Plus: (props: any) => <span {...props}>+</span>,
}));

describe('DiagramTabs', () => {
  const mockDiagrams: UMLDiagram[] = [
    {
      metadata: {
        version: '1.0',
        name: 'Diagrama 1',
        created: '2024-01-01',
        lastModified: '2024-01-01',
        type: 'usecase' as const,
        comments: ''
      },
      elements: [],
      relationships: []
    },
    {
      metadata: {
        version: '1.0',
        name: 'Diagrama 2',
        created: '2024-01-02',
        lastModified: '2024-01-02',
        type: 'activity' as const,
        comments: ''
      },
      elements: [],
      relationships: []
    }
  ];

  const defaultProps = {
    diagrams: mockDiagrams,
    activeIndex: 0,
    onSwitch: jest.fn(),
    onNew: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza todas as abas dos diagramas', () => {
    render(<DiagramTabs {...defaultProps} />);
    
    expect(screen.getByText('Diagrama 1')).toBeInTheDocument();
    expect(screen.getByText('Diagrama 2')).toBeInTheDocument();
    expect(screen.getByTestId('diagram-tabs')).toBeInTheDocument();
  });

  it('chama onSwitch quando uma aba é clicada', () => {
    render(<DiagramTabs {...defaultProps} />);
    
    const tab2 = screen.getByTestId('tab-1'); // Usa data-testid em vez de texto
    fireEvent.click(tab2);
    
    expect(defaultProps.onSwitch).toHaveBeenCalledWith(1);
  });

  it('chama onNew quando o botão de nova aba é clicado', () => {
    render(<DiagramTabs {...defaultProps} />);
    
    const newButton = screen.getByTestId('new-tab-btn');
    fireEvent.click(newButton);
    
    expect(defaultProps.onNew).toHaveBeenCalledTimes(1);
  });

  it('chama onDelete quando o ícone X é clicado', () => {
    render(<DiagramTabs {...defaultProps} />);
    
    const xIcons = screen.getAllByTestId('x-icon');
    fireEvent.click(xIcons[0]);
    
    expect(defaultProps.onDelete).toHaveBeenCalledWith(0);
    expect(defaultProps.onSwitch).not.toHaveBeenCalled();
  });

  it('não chama onDelete quando a aba em si é clicada', () => {
    render(<DiagramTabs {...defaultProps} />);
    
    const tab1 = screen.getByTestId('tab-0');
    fireEvent.click(tab1);
    
    expect(defaultProps.onSwitch).toHaveBeenCalledWith(0);
    expect(defaultProps.onDelete).not.toHaveBeenCalled();
  });

  it('renderiza botão de nova aba com ícone Plus', () => {
    render(<DiagramTabs {...defaultProps} />);
    
    const newButton = screen.getByTestId('new-tab-btn');
    const plusIcon = screen.getByTestId('plus-icon');
    
    expect(newButton).toContainElement(plusIcon);
  });
});