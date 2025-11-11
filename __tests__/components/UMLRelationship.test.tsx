// __tests__/components/UMLRelationship.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { UMLRelationshipComponent } from '../../src/components/UMLRelationship';
import { UseCaseElement, ActivityElement, UMLRelationship } from '../../src/types/umlTypes';

// Mock melhorado do react-konva - removendo propriedades inválidas
jest.mock('react-konva', () => ({
  Arrow: jest.fn(({ pointerLength, pointerWidth, pointerAtEnding, pointerClosed, shadowColor, shadowBlur, shadowOpacity, ...props }) => (
    <div 
      data-testid="arrow" 
      data-points={props.points?.join(',')}
      data-stroke={props.stroke}
      data-stroke-width={props.strokeWidth}
      data-dash={props.dash?.join(',')}
      {...props} 
    />
  )),
  Group: jest.fn(({ onTap, listening, ...props }) => (
    <div 
      data-testid="group" 
      {...props}
      onClick={props.onClick}
    />
  )),
  Text: jest.fn((props) => (
    <div 
      data-testid="text" 
      data-text={props.text}
      data-x={props.x}
      data-y={props.y}
      data-fill={props.fill}
      {...props} 
    >
      {props.text}
    </div>
  )),
}));

// Mock da geometria
jest.mock('../../src/utils/geometry', () => ({
  getBorderPoint: jest.fn(() => ({ x: 50, y: 50 })),
}));

describe('UMLRelationshipComponent', () => {
  const mockFromElement: UseCaseElement = {
    id: 'elem1',
    type: 'actor',
    name: 'Actor',
    x: 100,
    y: 100,
    width: 60,
    height: 80,
    color: '#000000',
  };

  const mockToElement: UseCaseElement = {
    id: 'elem2',
    type: 'usecase',
    name: 'Use Case',
    x: 200,
    y: 200,
    width: 120,
    height: 60,
    color: '#000000',
  };

  const defaultRelationship: UMLRelationship = {
    id: 'rel1',
    type: 'association',
    from: 'elem1',
    to: 'elem2',
    label: 'Test Label',
  };

  const defaultProps = {
    relationship: defaultRelationship,
    fromElement: mockFromElement,
    toElement: mockToElement,
    isSelected: false,
    onClick: jest.fn(),
    diagramType: 'usecase' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza relação de associação', () => {
    render(<UMLRelationshipComponent {...defaultProps} />);
    
    expect(screen.getByTestId('group')).toBeInTheDocument();
    expect(screen.getByTestId('arrow')).toBeInTheDocument();
  });

  it('renderiza label quando fornecido', () => {
    render(<UMLRelationshipComponent {...defaultProps} />);
    
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renderiza label automático para include', () => {
    const includeRelationship: UMLRelationship = {
      ...defaultRelationship,
      type: 'include',
      label: '',
    };
    
    render(<UMLRelationshipComponent {...defaultProps} relationship={includeRelationship} />);
    
    expect(screen.getByText('<<include>>')).toBeInTheDocument();
  });

  it('renderiza label automático para extend', () => {
    const extendRelationship: UMLRelationship = {
      ...defaultRelationship,
      type: 'extend',
      label: '',
    };
    
    render(<UMLRelationshipComponent {...defaultProps} relationship={extendRelationship} />);
    
    expect(screen.getByText('<<extend>>')).toBeInTheDocument();
  });

  it('renderiza guard quando fornecido', () => {
    const relationshipWithGuard: UMLRelationship = {
      ...defaultRelationship,
      type: 'control_flow',
      guard: 'condition',
    };
    
    render(<UMLRelationshipComponent {...defaultProps} relationship={relationshipWithGuard} />);
    
    expect(screen.getByText('[condition]')).toBeInTheDocument();
  });

  it('aplica estilo de seleção quando selecionado', () => {
    render(<UMLRelationshipComponent {...defaultProps} isSelected={true} />);
    
    const arrow = screen.getByTestId('arrow');
    expect(arrow).toBeInTheDocument();
  });

  it('chama onClick quando clicado', () => {
    render(<UMLRelationshipComponent {...defaultProps} />);
    
    fireEvent.click(screen.getByTestId('group'));
    
    expect(defaultProps.onClick).toHaveBeenCalledWith('rel1');
  });

  it('funciona com elementos de atividade', () => {
    const activityFromElement: ActivityElement = {
      id: 'activity1',
      type: 'activity',
      name: 'Test Activity',
      x: 100,
      y: 100,
      width: 100,
      height: 60,
      color: '#000000',
    };
    
    const activityToElement: ActivityElement = {
      id: 'activity2',
      type: 'activity',
      name: 'Another Activity',
      x: 250,
      y: 100,
      width: 100,
      height: 60,
      color: '#000000',
    };
    
    const activityProps = {
      ...defaultProps,
      fromElement: activityFromElement,
      toElement: activityToElement,
      diagramType: 'activity' as const,
    };
    
    render(<UMLRelationshipComponent {...activityProps} />);
    
    expect(screen.getByTestId('group')).toBeInTheDocument();
    expect(screen.getByTestId('arrow')).toBeInTheDocument();
  });

  it('renderiza sem problemas quando não há label', () => {
    const relationshipWithoutLabel: UMLRelationship = {
      ...defaultRelationship,
      label: '',
    };
    
    render(<UMLRelationshipComponent {...defaultProps} relationship={relationshipWithoutLabel} />);
    
    expect(screen.getByTestId('group')).toBeInTheDocument();
  });
});