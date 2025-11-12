/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ElementIcon } from '../../src/components/ElementIcon';
import { ActivityElement, UseCaseElement } from '../../src/types/umlTypes';

// Mock do react-konva corrigido
jest.mock('react-konva', () => ({
  Group: ({ children, ...props }: any) => {
    // Remove propriedades inválidas para DOM
    const { listening, ...validProps } = props;
    return (
      <div data-testid="konva-group" {...validProps}>
        {children}
      </div>
    );
  },
  Rect: (props: any) => {
    // Remove propriedades inválidas para DOM
    const { fillEnabled, ...validProps } = props;
    return <div data-testid="konva-rect" {...validProps} />;
  },
}));

// Mock das funções de desenho
jest.mock('../../src/components/UMLShapes', () => ({
  drawActor: jest.fn(() => <div data-testid="actor-shape" />),
  drawUseCase: jest.fn(() => <div data-testid="usecase-shape" />),
  drawActivity: jest.fn(() => <div data-testid="activity-shape" />),
  drawStart: jest.fn(() => <div data-testid="start-shape" />),
  drawEnd: jest.fn(() => <div data-testid="end-shape" />),
  drawDecision: jest.fn(() => <div data-testid="decision-shape" />),
  drawMerge: jest.fn(() => <div data-testid="merge-shape" />),
  drawFork: jest.fn(() => <div data-testid="fork-shape" />),
  drawJoin: jest.fn(() => <div data-testid="join-shape" />),
}));

describe('ElementIcon', () => {
  const baseProps = {
    x: 10,
    y: 20,
    width: 100,
    height: 60,
    isSelected: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza ícone de atividade corretamente', () => {
    const element: ActivityElement = {
      id: '1',
      name: 'Atividade Teste',
      x: 0,
      y: 0,
      width: 100,
      height: 60,
      type: 'activity',
      isEditing: false,
      color: '#000000',
    };

    render(<ElementIcon element={element} {...baseProps} />);
    
    expect(screen.getByTestId('activity-shape')).toBeInTheDocument();
  });

  it('renderiza ícone de ator corretamente', () => {
    const element: UseCaseElement = {
      id: '2',
      name: 'Ator Teste',
      x: 0,
      y: 0,
      width: 50,
      height: 80,
      type: 'actor',
      isEditing: false,
      color: '#123456',
    };

    render(<ElementIcon element={element} {...baseProps} />);
    expect(screen.getByTestId('actor-shape')).toBeInTheDocument();
  });

  it('renderiza ícone de caso de uso corretamente', () => {
    render(
      <ElementIcon
        element={{ ...baseProps, id: '3', name: 'UC', type: 'usecase', isEditing: false } as UseCaseElement}
        {...baseProps}
      />
    );
    expect(screen.getByTestId('usecase-shape')).toBeInTheDocument();
  });

  it('renderiza ícone de start corretamente', () => {
    render(
      <ElementIcon
        element={{ ...baseProps, id: '4', name: 'Start', type: 'start', isEditing: false } as ActivityElement}
        {...baseProps}
      />
    );
    expect(screen.getByTestId('start-shape')).toBeInTheDocument();
  });

  it('renderiza ícone de end corretamente', () => {
    render(
      <ElementIcon
        element={{ ...baseProps, id: '5', name: 'End', type: 'end', isEditing: false } as ActivityElement}
        {...baseProps}
      />
    );
    expect(screen.getByTestId('end-shape')).toBeInTheDocument();
  });

  it('renderiza ícone de decision corretamente', () => {
    render(
      <ElementIcon
        element={{ ...baseProps, id: '6', name: 'Decision', type: 'decision', isEditing: false } as ActivityElement}
        {...baseProps}
      />
    );
    expect(screen.getByTestId('decision-shape')).toBeInTheDocument();
  });

  it('renderiza ícone de merge corretamente', () => {
    render(
      <ElementIcon
        element={{ ...baseProps, id: '7', name: 'Merge', type: 'merge', isEditing: false } as ActivityElement}
        {...baseProps}
      />
    );
    expect(screen.getByTestId('merge-shape')).toBeInTheDocument();
  });

  it('renderiza ícone de fork corretamente', () => {
    render(
      <ElementIcon
        element={{ ...baseProps, id: '8', name: 'Fork', type: 'fork', isEditing: false } as ActivityElement}
        {...baseProps}
      />
    );
    expect(screen.getByTestId('fork-shape')).toBeInTheDocument();
  });

  it('renderiza ícone de join corretamente', () => {
    render(
      <ElementIcon
        element={{ ...baseProps, id: '9', name: 'Join', type: 'join', isEditing: false } as ActivityElement}
        {...baseProps}
      />
    );
    expect(screen.getByTestId('join-shape')).toBeInTheDocument();
  });

  it('renderiza retângulo padrão quando o tipo é desconhecido', () => {
    render(
      <ElementIcon
        element={{ ...baseProps, id: '10', name: 'Desconhecido', type: 'custom', isEditing: false } as any}
        {...baseProps}
      />
    );

    expect(screen.getByTestId('konva-group')).toBeInTheDocument();
    expect(screen.getByTestId('konva-rect')).toBeInTheDocument();
  });
});