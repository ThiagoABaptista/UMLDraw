// __tests__/components/UMLShapes.test.tsx
import React from 'react';
import { render } from '@testing-library/react';
import {
  drawActor,
  drawUseCase,
  drawActivity,
  drawStart,
  drawEnd,
  drawDecision,
  drawFork,
  drawJoin,
  drawMerge,
} from '../../src/components/UMLShapes';

// Mock do react-konva
jest.mock('react-konva', () => ({
  Group: jest.fn(({ children, ...props }) => (
    <div data-testid="group" data-props={JSON.stringify(props)}>
      {children}
    </div>
  )),
  Circle: jest.fn((props) => (
    <div data-testid="circle" data-props={JSON.stringify(props)} />
  )),
  Line: jest.fn((props) => (
    <div data-testid="line" data-props={JSON.stringify(props)} />
  )),
  Ellipse: jest.fn((props) => (
    <div data-testid="ellipse" data-props={JSON.stringify(props)} />
  )),
  Rect: jest.fn((props) => (
    <div data-testid="rect" data-props={JSON.stringify(props)} />
  )),
}));

describe('UMLShapes', () => {
  const defaultParams = {
    x: 100,
    y: 100,
    width: 80,
    height: 60,
    color: '#000000',
    strokeWidth: 2,
    isSelected: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('drawActor', () => {
    it('renderiza ator com stickman', () => {
      const { container } = render(drawActor(
        defaultParams.x,
        defaultParams.y,
        defaultParams.width,
        defaultParams.height,
        defaultParams.color,
        defaultParams.strokeWidth,
        defaultParams.isSelected
      ));

      expect(container.querySelector('[data-testid="group"]')).toBeInTheDocument();
      expect(container.querySelectorAll('[data-testid="circle"]')).toHaveLength(1);
      expect(container.querySelectorAll('[data-testid="line"]')).toHaveLength(4);
    });

    it('aplica estilo de seleção quando selecionado', () => {
      const { container } = render(drawActor(
        defaultParams.x,
        defaultParams.y,
        defaultParams.width,
        defaultParams.height,
        defaultParams.color,
        defaultParams.strokeWidth,
        true // isSelected
      ));

      const group = container.querySelector('[data-testid="group"]');
      const groupProps = JSON.parse(group?.getAttribute('data-props') || '{}');
      
      expect(groupProps.x).toBe(100);
      expect(groupProps.y).toBe(100);
    });

    it('calcula proporções corretamente', () => {
      const customParams = {
        ...defaultParams,
        width: 100,
        height: 120,
      };

      render(drawActor(
        customParams.x,
        customParams.y,
        customParams.width,
        customParams.height,
        customParams.color,
        customParams.strokeWidth,
        customParams.isSelected
      ));

      // Verifica se as funções de desenho foram chamadas
      expect(jest.requireMock('react-konva').Circle).toHaveBeenCalled();
      expect(jest.requireMock('react-konva').Line).toHaveBeenCalled();
    });
  });

  describe('drawUseCase', () => {
    it('renderiza caso de uso como elipse', () => {
      const { container } = render(drawUseCase(
        defaultParams.x,
        defaultParams.y,
        defaultParams.width,
        defaultParams.height,
        defaultParams.color,
        defaultParams.strokeWidth,
        defaultParams.isSelected
      ));

      expect(container.querySelector('[data-testid="group"]')).toBeInTheDocument();
      expect(container.querySelector('[data-testid="ellipse"]')).toBeInTheDocument();
    });

    it('usa proporções corretas para elipse', () => {
      render(drawUseCase(
        defaultParams.x,
        defaultParams.y,
        defaultParams.width,
        defaultParams.height,
        defaultParams.color,
        defaultParams.strokeWidth,
        defaultParams.isSelected
      ));

      const ellipseMock = jest.requireMock('react-konva').Ellipse;
      const call = ellipseMock.mock.calls[0][0]; // Pega o primeiro argumento da primeira chamada
      
      expect(call.radiusX).toBe(40); // width * 0.5
      expect(call.radiusY).toBe(24); // height * 0.4
    });

    it('aplica seleção com cor azul', () => {
      render(drawUseCase(
        defaultParams.x,
        defaultParams.y,
        defaultParams.width,
        defaultParams.height,
        defaultParams.color,
        defaultParams.strokeWidth,
        true // isSelected
      ));

      const ellipseMock = jest.requireMock('react-konva').Ellipse;
      const call = ellipseMock.mock.calls[0][0];
      
      expect(call.stroke).toBe('#2563eb'); // azul quando selecionado
    });
  });

  describe('drawActivity', () => {
    it('renderiza atividade como retângulo com bordas arredondadas', () => {
      const { container } = render(drawActivity(
        defaultParams.x,
        defaultParams.y,
        defaultParams.width,
        defaultParams.height,
        defaultParams.color,
        defaultParams.strokeWidth,
        defaultParams.isSelected
      ));

      expect(container.querySelector('[data-testid="group"]')).toBeInTheDocument();
      expect(container.querySelector('[data-testid="rect"]')).toBeInTheDocument();
    });

    it('calcula corner radius baseado no menor lado', () => {
      const smallParams = {
        ...defaultParams,
        width: 50,
        height: 30,
      };

      render(drawActivity(
        smallParams.x,
        smallParams.y,
        smallParams.width,
        smallParams.height,
        smallParams.color,
        smallParams.strokeWidth,
        smallParams.isSelected
      ));

      const rectMock = jest.requireMock('react-konva').Rect;
      const call = rectMock.mock.calls[0][0];
      
      expect(call.cornerRadius).toBe(6); // Math.min(50, 30) * 0.2 = 6
    });

    it('usa propriedades comuns quando selecionado', () => {
      render(drawActivity(
        defaultParams.x,
        defaultParams.y,
        defaultParams.width,
        defaultParams.height,
        defaultParams.color,
        defaultParams.strokeWidth,
        true // isSelected
      ));

      const rectMock = jest.requireMock('react-konva').Rect;
      const call = rectMock.mock.calls[0][0];
      
      expect(call.stroke).toBe('#2563eb');
      expect(call.strokeWidth).toBe(3); // strokeWidth * 1.5
    });
  });

  describe('drawStart', () => {
    it('renderiza nó inicial como círculo preenchido', () => {
      const { container } = render(drawStart(
        defaultParams.x,
        defaultParams.y,
        defaultParams.width,
        defaultParams.height,
        defaultParams.color,
        defaultParams.strokeWidth,
        defaultParams.isSelected
      ));

      expect(container.querySelector('[data-testid="group"]')).toBeInTheDocument();
      expect(container.querySelector('[data-testid="circle"]')).toBeInTheDocument();
    });

    it('não tem borda quando não selecionado', () => {
      render(drawStart(
        defaultParams.x,
        defaultParams.y,
        defaultParams.width,
        defaultParams.height,
        defaultParams.color,
        defaultParams.strokeWidth,
        false // isSelected
      ));

      const circleMock = jest.requireMock('react-konva').Circle;
      const call = circleMock.mock.calls[0][0];
      
      expect(call.stroke).toBe('transparent');
      expect(call.strokeWidth).toBe(0);
    });

    it('adiciona borda azul quando selecionado', () => {
      render(drawStart(
        defaultParams.x,
        defaultParams.y,
        defaultParams.width,
        defaultParams.height,
        defaultParams.color,
        defaultParams.strokeWidth,
        true // isSelected
      ));

      const circleMock = jest.requireMock('react-konva').Circle;
      const call = circleMock.mock.calls[0][0];
      
      expect(call.stroke).toBe('#2563eb');
      expect(call.strokeWidth).toBe(3); // strokeWidth * 1.5
    });
  });

  describe('drawEnd', () => {
    it('renderiza nó final como círculo duplo', () => {
      const { container } = render(drawEnd(
        defaultParams.x,
        defaultParams.y,
        defaultParams.width,
        defaultParams.height,
        defaultParams.color,
        defaultParams.strokeWidth,
        defaultParams.isSelected
      ));

      expect(container.querySelector('[data-testid="group"]')).toBeInTheDocument();
      expect(container.querySelectorAll('[data-testid="circle"]')).toHaveLength(2);
    });

    it('cria círculo interno menor', () => {
      render(drawEnd(
        defaultParams.x,
        defaultParams.y,
        defaultParams.width,
        defaultParams.height,
        defaultParams.color,
        defaultParams.strokeWidth,
        defaultParams.isSelected
      ));

      const circleMock = jest.requireMock('react-konva').Circle;
      const calls = circleMock.mock.calls;
      
      // Segundo círculo (interno) deve ter radius menor
      const secondCallProps = calls[1][0];
      expect(secondCallProps.radius).toBeLessThan(calls[0][0].radius);
    });

    it('aplica seleção no círculo externo', () => {
      render(drawEnd(
        defaultParams.x,
        defaultParams.y,
        defaultParams.width,
        defaultParams.height,
        defaultParams.color,
        defaultParams.strokeWidth,
        true // isSelected
      ));

      const circleMock = jest.requireMock('react-konva').Circle;
      const calls = circleMock.mock.calls;
      
      // Primeiro círculo (externo) deve ter estilo de seleção
      expect(calls[0][0].stroke).toBe('#2563eb');
      // Segundo círculo (interno) mantém fill da cor original
      expect(calls[1][0].fill).toBe('#000000');
    });
  });

  describe('drawDecision', () => {
    it('renderiza decisão como losango', () => {
      const { container } = render(drawDecision(
        defaultParams.x,
        defaultParams.y,
        defaultParams.width,
        defaultParams.height,
        defaultParams.color,
        defaultParams.strokeWidth,
        defaultParams.isSelected
      ));

      expect(container.querySelector('[data-testid="group"]')).toBeInTheDocument();
      expect(container.querySelector('[data-testid="line"]')).toBeInTheDocument();
    });

    it('cria pontos corretos para losango', () => {
      render(drawDecision(
        defaultParams.x,
        defaultParams.y,
        defaultParams.width,
        defaultParams.height,
        defaultParams.color,
        defaultParams.strokeWidth,
        defaultParams.isSelected
      ));

      const lineMock = jest.requireMock('react-konva').Line;
      const call = lineMock.mock.calls[0][0];
      
      expect(call.points).toEqual([40, 0, 80, 30, 40, 60, 0, 30]); // [hw, 0, width, hh, hw, height, 0, hh]
      expect(call.closed).toBe(true);
    });

    it('usa propriedades comuns', () => {
      render(drawDecision(
        defaultParams.x,
        defaultParams.y,
        defaultParams.width,
        defaultParams.height,
        defaultParams.color,
        defaultParams.strokeWidth,
        true // isSelected
      ));

      const lineMock = jest.requireMock('react-konva').Line;
      const call = lineMock.mock.calls[0][0];
      
      expect(call.stroke).toBe('#2563eb');
      expect(call.strokeWidth).toBe(3);
    });
  });

  describe('drawFork', () => {
    it('renderiza fork como retângulo preenchido', () => {
      const { container } = render(drawFork(
        defaultParams.x,
        defaultParams.y,
        defaultParams.width,
        defaultParams.height,
        defaultParams.color,
        defaultParams.strokeWidth,
        defaultParams.isSelected
      ));

      expect(container.querySelector('[data-testid="group"]')).toBeInTheDocument();
      expect(container.querySelector('[data-testid="rect"]')).toBeInTheDocument();
    });

    it('não tem borda quando não selecionado', () => {
      render(drawFork(
        defaultParams.x,
        defaultParams.y,
        defaultParams.width,
        defaultParams.height,
        defaultParams.color,
        defaultParams.strokeWidth,
        false // isSelected
      ));

      const rectMock = jest.requireMock('react-konva').Rect;
      const call = rectMock.mock.calls[0][0];
      
      expect(call.stroke).toBe('transparent');
      expect(call.strokeWidth).toBe(0);
    });

    it('adiciona borda quando selecionado', () => {
      render(drawFork(
        defaultParams.x,
        defaultParams.y,
        defaultParams.width,
        defaultParams.height,
        defaultParams.color,
        defaultParams.strokeWidth,
        true // isSelected
      ));

      const rectMock = jest.requireMock('react-konva').Rect;
      const call = rectMock.mock.calls[0][0];
      
      expect(call.stroke).toBe('#2563eb');
      expect(call.strokeWidth).toBe(3);
    });

    it('usa corner radius pequeno', () => {
      render(drawFork(
        defaultParams.x,
        defaultParams.y,
        defaultParams.width,
        defaultParams.height,
        defaultParams.color,
        defaultParams.strokeWidth,
        defaultParams.isSelected
      ));

      const rectMock = jest.requireMock('react-konva').Rect;
      const call = rectMock.mock.calls[0][0];
      
      expect(call.cornerRadius).toBe(2);
    });
  });

  describe('drawJoin', () => {
    it('é igual a drawFork', () => {
      expect(drawJoin).toBe(drawFork);
    });
  });

  describe('drawMerge', () => {
    it('é igual a drawDecision', () => {
      expect(drawMerge).toBe(drawDecision);
    });
  });

  describe('Comportamento de seleção consistente', () => {
    it('todas as formas usam azul quando selecionadas', () => {
      const testCases = [
        { shape: drawActor, name: 'Actor' },
        { shape: drawUseCase, name: 'UseCase' },
        { shape: drawActivity, name: 'Activity' },
        { shape: drawDecision, name: 'Decision' },
      ];

      testCases.forEach(({ shape, name }) => {
        render(shape(0, 0, 50, 50, '#000000', 2, true));
        
        // Verifica se alguma das formas mockadas foi chamada com cor azul
        const konvaMocks = jest.requireMock('react-konva');
        const hadBlueStroke = Object.values(konvaMocks).some((mock: any) =>
          mock.mock.calls.some((call: any[]) => 
            call[0]?.stroke === '#2563eb'
          )
        );
        
        expect(hadBlueStroke).toBe(true);
        
        // Limpa os mocks para o próximo teste
        jest.clearAllMocks();
      });
    });

    it('aumenta strokeWidth quando selecionado', () => {
      const testCases = [
        { shape: drawActor, name: 'Actor' },
        { shape: drawUseCase, name: 'UseCase' },
        { shape: drawActivity, name: 'Activity' },
        { shape: drawDecision, name: 'Decision' },
      ];

      testCases.forEach(({ shape, name }) => {
        render(shape(0, 0, 50, 50, '#000000', 2, true));
        
        const konvaMocks = jest.requireMock('react-konva');
        const hadIncreasedStroke = Object.values(konvaMocks).some((mock: any) =>
          mock.mock.calls.some((call: any[]) => 
            call[0]?.strokeWidth === 3
          )
        );
        
        expect(hadIncreasedStroke).toBe(true);
        
        jest.clearAllMocks();
      });
    });
  });

  describe('Testes de posicionamento', () => {
    it('todas as formas usam as coordenadas x e y fornecidas', () => {
      const testCases = [
        { shape: drawActor, name: 'Actor' },
        { shape: drawUseCase, name: 'UseCase' },
        { shape: drawActivity, name: 'Activity' },
        { shape: drawStart, name: 'Start' },
        { shape: drawEnd, name: 'End' },
        { shape: drawDecision, name: 'Decision' },
        { shape: drawFork, name: 'Fork' },
      ];

      const testX = 150;
      const testY = 200;

      testCases.forEach(({ shape, name }) => {
        render(shape(testX, testY, 50, 50, '#000000', 2, false));
        
        const groupMock = jest.requireMock('react-konva').Group;
        const lastCall = groupMock.mock.calls[groupMock.mock.calls.length - 1][0];
        
        expect(lastCall.x).toBe(testX);
        expect(lastCall.y).toBe(testY);
        
        jest.clearAllMocks();
      });
    });
  });
});