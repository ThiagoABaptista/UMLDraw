import { renderHook, act } from '@testing-library/react';
import { useDiagramState } from '../../src/hooks/useDiagramState';

describe('useDiagramState', () => {
  it('retorna estado inicial válido', () => {
    const { result } = renderHook(() => useDiagramState());
    expect(result.current.diagram.metadata.type).toBe('usecase');
    expect(Array.isArray(result.current.diagram.elements)).toBe(true);
  });

  it('atualiza o diagrama com updateDiagram', () => {
    const { result } = renderHook(() => useDiagramState());
    const oldLength = result.current.diagram.elements.length;

    act(() => {
      result.current.updateDiagram((prev) => ({
        ...prev,
        elements: [
          ...prev.elements,
          {
            id: '99',
            type: 'actor',
            name: 'Novo',
            x: 0,
            y: 0,
            width: 50,
            height: 50,
          },
        ],
      }));
    });

    expect(result.current.diagram.elements.length).toBe(oldLength + 1);
  });

  it('limpa edição com clearEditingState', () => {
    const { result } = renderHook(() => useDiagramState());

    act(() => {
      result.current.setIsEditing(true);
      result.current.clearEditingState();
    });

    expect(result.current.isEditing).toBe(false);
    expect(result.current.diagram.elements.every((el) => !el.isEditing)).toBe(true);
  });
});
