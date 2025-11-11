import { renderHook, act } from '@testing-library/react';
import { useStageDragFeedback } from '../../src/hooks/useStageDragFeedback';
import { UMLDiagram } from '../../src/types/umlTypes';

jest.useFakeTimers();

describe('useStageDragFeedback', () => {
  const baseDiagram: UMLDiagram = {
    metadata: { version: '1.0', name: '', created: '', lastModified: '', type: 'usecase' },
    elements: [{ id: '1', type: 'usecase', name: 'A', x: 0, y: 0, width: 100, height: 50 }],
    relationships: [],
  };

  it('atualiza posição do elemento após debounce', () => {
    const updateDiagram = jest.fn((fn) => fn(baseDiagram));
    const { result } = renderHook(() => useStageDragFeedback({ updateDiagram }));

    act(() => {
      result.current.handleDragMove('1', 50, 80);
    });

    jest.advanceTimersByTime(100);

    expect(updateDiagram).toHaveBeenCalledTimes(1);
    const updated = updateDiagram.mock.calls[0][0](baseDiagram);
    expect(updated.elements[0].x).toBe(50);
    expect(updated.elements[0].y).toBe(80);
  });

  it('substitui posição se várias chamadas ocorrerem antes do debounce', () => {
    const updateDiagram = jest.fn((fn) => fn(baseDiagram));
    const { result } = renderHook(() => useStageDragFeedback({ updateDiagram }));

    act(() => {
      result.current.handleDragMove('1', 10, 10);
      result.current.handleDragMove('1', 20, 20);
      result.current.handleDragMove('1', 30, 30);
    });

    jest.advanceTimersByTime(100);

    expect(updateDiagram).toHaveBeenCalledTimes(1);
    const updated = updateDiagram.mock.calls[0][0](baseDiagram);
    expect(updated.elements[0].x).toBe(30);
  });
});
