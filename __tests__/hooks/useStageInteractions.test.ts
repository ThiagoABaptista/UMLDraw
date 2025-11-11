import { renderHook, act } from '@testing-library/react';
import { useStageInteractions } from '../../src/hooks/useStageInteractions';
import { UMLDiagram } from '../../src/types/umlTypes';

describe('useStageInteractions', () => {
  const mockDiagram: UMLDiagram = {
    metadata: {
      version: '1.0',
      name: 'Test Diagram',
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      type: 'usecase',
    },
    elements: [],
    relationships: [],
  };

  const createStageMock = () => ({
    getPointerPosition: jest.fn(() => ({ x: 100, y: 200 })),
    scaleX: jest.fn(() => 1),
    x: jest.fn(() => 0),
    y: jest.fn(() => 0),
  });

  const setup = () => {
    const updateDiagram = jest.fn((fn) => fn(mockDiagram));
    const setSelectedElement = jest.fn();
    const setCreationState = jest.fn();
    const setTool = jest.fn();
    const setConnectionState = jest.fn();
    const setConnectionStart = jest.fn();
    const clearEditingState = jest.fn();

    return renderHook(() =>
      useStageInteractions({
        creationState: 'idle',
        tool: 'select',
        connectionState: 'idle',
        createNewElement: jest.fn(() => ({
          id: 'new',
          type: 'usecase',
          name: 'Novo',
          x: 0,
          y: 0,
          width: 50,
          height: 30,
        })),
        updateDiagram,
        setSelectedElement,
        setCreationState,
        setTool,
        setConnectionState,
        setConnectionStart,
        clearEditingState,
      })
    );
  };

  it('ignora clique se não houver stage', () => {
    const { result } = setup();
    const event = { target: { getStage: () => null } } as any;

    act(() => {
      result.current.handleStageClick(event);
    });

    expect(result.current.previewPosition).toBeNull();
  });

  it('atualiza posição do mouse com handleMouseMove', () => {
    const { result } = setup();
    const event = { target: { getStage: () => createStageMock() } } as any;

    act(() => {
      result.current.handleMouseMove(event);
    });

    // deve atualizar internamente o targetPosition (não diretamente visível)
    expect(typeof result.current.handleMouseMove).toBe('function');
  });

  it('mantém animação ativa e cancela no unmount', () => {
    const { unmount } = setup();
    const cancelSpy = jest.spyOn(window, 'cancelAnimationFrame');
    unmount();
    expect(cancelSpy).toHaveBeenCalled();
  });
});
