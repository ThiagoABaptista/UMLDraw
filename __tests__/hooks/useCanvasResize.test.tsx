import { renderHook, act } from '@testing-library/react';
import { useCanvasResize } from '../../src/hooks/useCanvasResize';

describe('useCanvasResize', () => {
  beforeEach(() => {
    (window.innerWidth as number) = 800;
    (window.innerHeight as number) = 600;
  });

  it('retorna tamanho inicial baseado no offset', () => {
    const { result } = renderHook(() => useCanvasResize(100));
    expect(result.current).toEqual({ width: 800, height: 500 });
  });

  it('atualiza tamanho ao disparar resize', () => {
    const { result } = renderHook(() => useCanvasResize(50));
    act(() => {
      (window.innerWidth as number) = 1000;
      (window.innerHeight as number) = 700;
      window.dispatchEvent(new Event('resize'));
    });
    expect(result.current).toEqual({ width: 1000, height: 650 });
  });

  it('remove listener ao desmontar', () => {
    const removeSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useCanvasResize());
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });
});
