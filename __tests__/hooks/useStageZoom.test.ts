import { renderHook, act } from '@testing-library/react';
import { useStageZoom } from '../../src/hooks/useStageZoom';

describe('useStageZoom', () => {
  const mockStage = {
    getPointerPosition: jest.fn(() => ({ x: 100, y: 100 })),
    scaleX: jest.fn(() => 1),
    x: jest.fn(() => 0),
    y: jest.fn(() => 0),
    scale: jest.fn(),
    position: jest.fn(),
    batchDraw: jest.fn(),
  };

  const mockEvent = (deltaY = -1, ctrlKey = false, buttons = 0) => ({
    evt: { preventDefault: jest.fn(), deltaY, ctrlKey, buttons, clientX: 0, clientY: 0 },
    target: { getStage: () => mockStage },
  });

  it('faz zoom in ao rolar para cima', () => {
    const { result } = renderHook(() => useStageZoom());
    const e = mockEvent(-100);
    act(() => result.current.handleStageWheel(e as any));
    expect(mockStage.scale).toHaveBeenCalled();
    expect(mockStage.position).toHaveBeenCalled();
  });

  it('faz pan quando botão esquerdo está pressionado', () => {
    const { result } = renderHook(() => useStageZoom());
    const e = mockEvent(0, false, 1);
    act(() => result.current.handleStagePan(e as any));
    expect(mockStage.batchDraw).toHaveBeenCalled();
  });

  it('reseta zoom e posição ao dar duplo clique', () => {
    const { result } = renderHook(() => useStageZoom());
    const e = { target: { getStage: () => mockStage } } as any;
    act(() => result.current.handleDoubleClick(e));
    expect(mockStage.scale).toHaveBeenCalledWith({ x: 1, y: 1 });
    expect(mockStage.position).toHaveBeenCalledWith({ x: 0, y: 0 });
  });
});
