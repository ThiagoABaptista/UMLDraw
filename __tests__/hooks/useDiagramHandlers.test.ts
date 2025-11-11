import { useDiagramHandlers } from '../../src/hooks/useDiagramHandlers';
import { renderHook, act } from '@testing-library/react';

describe('useDiagramHandlers', () => {
  const updateTool = jest.fn();
  const setSelectedRelationshipType = jest.fn();
  const setDiagram = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('configura corretamente para diagrama de caso de uso', () => {
    const { result } = renderHook(() =>
      useDiagramHandlers(updateTool, setSelectedRelationshipType, setDiagram)
    );

    act(() => {
      result.current.handleDiagramTypeChange('usecase');
    });

    expect(updateTool).toHaveBeenCalledWith('select');
    expect(setSelectedRelationshipType).toHaveBeenCalledWith('association');
    expect(setDiagram).toHaveBeenCalledWith(expect.objectContaining({
      metadata: expect.objectContaining({ type: 'usecase' }),
      elements: [],
      relationships: [],
    }));
  });

  it('configura corretamente para diagrama de atividade', () => {
    const { result } = renderHook(() =>
      useDiagramHandlers(updateTool, setSelectedRelationshipType, setDiagram)
    );

    act(() => {
      result.current.handleDiagramTypeChange('activity');
    });

    expect(setSelectedRelationshipType).toHaveBeenCalledWith('control_flow');
    expect(setDiagram).toHaveBeenCalledWith(expect.objectContaining({
      metadata: expect.objectContaining({ type: 'activity' }),
    }));
  });
});
