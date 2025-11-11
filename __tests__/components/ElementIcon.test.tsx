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

  // ... manter os outros testes do ElementIcon (eles estão funcionando)
});