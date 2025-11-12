import { renderHook, act } from '@testing-library/react';
import { useStageInteractions } from '../../src/hooks/useStageInteractions';
import {
  UMLDiagram,
  CreationState,
  Tool,
  ConnectionState,
  UseCaseElement,
} from '../../src/types/umlTypes';

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

  const createStageMock = (pointer: any = { x: 100, y: 200 }) => {
    const stage: any = {
      getPointerPosition: jest.fn(() => pointer),
      scaleX: jest.fn(() => 2),
      x: jest.fn(() => 10),
      y: jest.fn(() => 20),
      getStage: jest.fn(),
    };
    stage.getStage.mockReturnValue(stage); // garante compatibilidade
    return stage;
  };

  const setup = (overrides: Partial<any> = {}) => {
    const createNewElement = jest.fn((): UseCaseElement => ({
      id: 'new',
      type: 'usecase',
      name: 'Novo caso de uso',
      x: 0,
      y: 0,
      width: 50,
      height: 30,
    }));

    const props = {
      creationState: 'idle' as CreationState,
      tool: 'select' as Tool,
      connectionState: 'idle' as ConnectionState,
      createNewElement,
      updateDiagram: jest.fn((fn) => fn(mockDiagram)),
      setSelectedElement: jest.fn(),
      setCreationState: jest.fn(),
      setTool: jest.fn(),
      setConnectionState: jest.fn(),
      setConnectionStart: jest.fn(),
      clearEditingState: jest.fn(),
      onMousePositionChange: jest.fn(),
      ...overrides,
    };

    return {
      ...props,
      ...renderHook(() => useStageInteractions(props)),
    };
  };

  it('ignora clique se não houver stage', () => {
    const { result } = setup();
    const event = { target: { getStage: () => null } } as any;

    act(() => {
      result.current.handleStageClick(event);
    });

    expect(result.current.previewPosition).toBeNull();
  });

  it('cria novo elemento quando em modo "placing"', () => {
    const createNewElement = jest.fn(() => ({
      id: '123',
      type: 'usecase',
      name: 'Novo',
      x: 10,
      y: 20,
      width: 40,
      height: 30,
    }));
    const updateDiagram = jest.fn((fn) => fn(mockDiagram));
    const setSelectedElement = jest.fn();
    const setCreationState = jest.fn();
    const setTool = jest.fn();

    const { result } = setup({
      creationState: 'placing' as CreationState,
      tool: 'usecase' as Tool,
      createNewElement,
      updateDiagram,
      setSelectedElement,
      setCreationState,
      setTool,
    });

    const stage = createStageMock();

    // precisa ser o próprio stage no target
    const event = { target: stage } as any;

    act(() => {
      result.current.handleStageClick(event);
    });

    expect(createNewElement).toHaveBeenCalled();
    expect(updateDiagram).toHaveBeenCalled();
    expect(setSelectedElement).toHaveBeenCalledWith('123');
    expect(setCreationState).toHaveBeenCalledWith('idle');
    expect(setTool).toHaveBeenCalledWith('select');
  });

  it('limpa estado quando clicado em canvas vazio e connectionState=idle', () => {
    const clearEditingState = jest.fn();
    const setSelectedElement = jest.fn();

    const { result } = setup({ clearEditingState, setSelectedElement });
    const stage = createStageMock();

    act(() => {
      result.current.handleStageClick({ target: stage } as any);
    });

    expect(clearEditingState).toHaveBeenCalled();
    expect(setSelectedElement).toHaveBeenCalledWith(null);
  });

  it('mantém estado quando connectionState ≠ idle', () => {
    const clearEditingState = jest.fn();
    const setSelectedElement = jest.fn();

    const { result } = setup({
      connectionState: 'connecting' as ConnectionState,
      clearEditingState,
      setSelectedElement,
    });

    const stage = createStageMock();
    act(() => {
      result.current.handleStageClick({ target: stage } as any);
    });

    expect(clearEditingState).not.toHaveBeenCalled();
    expect(setSelectedElement).not.toHaveBeenCalled();
  });

  it('atualiza posição do mouse e chama onMousePositionChange', () => {
    const onMousePositionChange = jest.fn();
    const { result } = setup({ onMousePositionChange });
    const stage = createStageMock();

    act(() => {
      result.current.handleMouseMove({ target: stage });
    });

    expect(onMousePositionChange).toHaveBeenCalledWith(
      expect.objectContaining({ x: expect.any(Number), y: expect.any(Number) })
    );
  });

  it('inicia e cancela animação no ciclo de vida', () => {
    const cancelSpy = jest.spyOn(window, 'cancelAnimationFrame');
    const { unmount } = setup();
    unmount();
    expect(cancelSpy).toHaveBeenCalled();
  });

  it('reage ao evento "cancel-creation"', () => {
    const setCreationState = jest.fn();
    const setTool = jest.fn();
    const setConnectionState = jest.fn();
    const setConnectionStart = jest.fn();
    const clearEditingState = jest.fn();
    const setSelectedElement = jest.fn();

    const { unmount } = setup({
      setCreationState,
      setTool,
      setConnectionState,
      setConnectionStart,
      clearEditingState,
      setSelectedElement,
    });

    act(() => {
      window.dispatchEvent(new Event('cancel-creation'));
    });

    expect(setCreationState).toHaveBeenCalledWith('idle');
    expect(setTool).toHaveBeenCalledWith('select');
    expect(setConnectionState).toHaveBeenCalledWith('idle');
    expect(setConnectionStart).toHaveBeenCalledWith(null);
    expect(clearEditingState).toHaveBeenCalled();
    expect(setSelectedElement).toHaveBeenCalledWith(null);

    unmount();
  });
});
