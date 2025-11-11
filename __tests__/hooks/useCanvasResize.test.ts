import { renderHook, act } from '@testing-library/react';
import { useCanvasResize } from '../../src/hooks/useCanvasResize';

describe('useCanvasResize', () => {
  it('retorna tamanho inicial baseado na janela', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 800 });
    Object.defineProperty(window, 'innerHeight', { writable: true, value: 600 });

    const { result } = renderHook(() => useCanvasResize(50));

    expect(result.current).toEqual({ width: 800, height: 550 });
  });

  it('atualiza tamanho ao redimensionar janela', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 1024 });
    Object.defineProperty(window, 'innerHeight', { writable: true, value: 768 });

    const { result } = renderHook(() => useCanvasResize(100));

    act(() => {
      window.innerWidth = 1200;
      window.innerHeight = 900;
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current.width).toBe(1200);
    expect(result.current.height).toBe(800);
  });
});
