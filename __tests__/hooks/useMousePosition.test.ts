import { renderHook, act } from '@testing-library/react';
import { useMousePosition } from '../../src/hooks/useMousePosition';

describe('useMousePosition', () => {
  it('retorna posição inicial como (0,0)', () => {
    const { result } = renderHook(() => useMousePosition());
    expect(result.current.mousePosition).toEqual({ x: 0, y: 0 });
  });

  it('atualiza posição do mouse corretamente com escala e deslocamento', () => {
    const { result } = renderHook(() => useMousePosition());

    // Mock do stage do Konva
    const mockStage = {
      getPointerPosition: jest.fn(() => ({ x: 200, y: 100 })),
      scaleX: jest.fn(() => 2),
      x: jest.fn(() => 50),
      y: jest.fn(() => 20),
    };

    const mockEvent = {
      target: {
        getStage: () => mockStage,
      },
    } as any;

    act(() => {
      result.current.handleMouseMove(mockEvent);
    });

    // (pointer.x - stageX) / scale = (200 - 50) / 2 = 75
    // (pointer.y - stageY) / scale = (100 - 20) / 2 = 40
    expect(result.current.mousePosition).toEqual({ x: 75, y: 40 });
  });

  it('ignora eventos sem stage válido', () => {
    const { result } = renderHook(() => useMousePosition());
    const prev = result.current.mousePosition;

    const mockEvent = {
      target: { getStage: () => null },
    } as any;

    act(() => {
      result.current.handleMouseMove(mockEvent);
    });

    expect(result.current.mousePosition).toEqual(prev);
  });

  it('ignora eventos sem pointer position', () => {
    const { result } = renderHook(() => useMousePosition());

    const mockStage = {
      getPointerPosition: jest.fn(() => null),
      scaleX: jest.fn(() => 1),
      x: jest.fn(() => 0),
      y: jest.fn(() => 0),
    };

    const mockEvent = {
      target: { getStage: () => mockStage },
    } as any;

    act(() => {
      result.current.handleMouseMove(mockEvent);
    });

    expect(result.current.mousePosition).toEqual({ x: 0, y: 0 });
  });
});
