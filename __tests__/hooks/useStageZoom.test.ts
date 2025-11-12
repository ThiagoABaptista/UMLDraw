import { renderHook, act } from "@testing-library/react";
import { useStageZoom } from "../../src/hooks/useStageZoom";

describe("useStageZoom", () => {
  let mockStage: any;

  beforeEach(() => {
    mockStage = {
      getPointerPosition: jest.fn(() => ({ x: 100, y: 100 })),
      scaleX: jest.fn(() => 1),
      x: jest.fn(() => 0),
      y: jest.fn(() => 0),
      scale: jest.fn(),
      position: jest.fn(),
      batchDraw: jest.fn(),
    };
    jest.clearAllMocks();
  });

  const mockEvent = (overrides: any = {}) => ({
    evt: {
      preventDefault: jest.fn(),
      deltaY: -1,
      ctrlKey: false,
      buttons: 0,
      clientX: 10,
      clientY: 20,
      ...overrides,
    },
    target: {
      getStage: jest.fn(() => mockStage),
    },
  });

  it("faz zoom in ao rolar para cima", () => {
    const { result } = renderHook(() => useStageZoom());
    const e = mockEvent({ deltaY: -100 });
    act(() => result.current.handleStageWheel(e as any));
    expect(e.evt.preventDefault).toHaveBeenCalled();
    expect(mockStage.scale).toHaveBeenCalled();
    expect(mockStage.position).toHaveBeenCalled();
    expect(mockStage.batchDraw).toHaveBeenCalled();
  });

  it("faz zoom out ao rolar para baixo", () => {
    mockStage.scaleX.mockReturnValue(2);
    const { result } = renderHook(() => useStageZoom());
    const e = mockEvent({ deltaY: 200 });
    act(() => result.current.handleStageWheel(e as any));
    expect(mockStage.scale).toHaveBeenCalledWith(
      expect.objectContaining({ x: expect.any(Number), y: expect.any(Number) })
    );
  });

  it("retorna sem stage no zoom", () => {
    const { result } = renderHook(() => useStageZoom());
    const e = mockEvent();
    e.target.getStage.mockReturnValue(null);
    act(() => result.current.handleStageWheel(e as any));
    expect(mockStage.scale).not.toHaveBeenCalled();
  });

  it("retorna sem pointer no zoom", () => {
    mockStage.getPointerPosition.mockReturnValue(null);
    const { result } = renderHook(() => useStageZoom());
    const e = mockEvent();
    act(() => result.current.handleStageWheel(e as any));
    expect(mockStage.scale).not.toHaveBeenCalled();
  });

  it("clampa o zoom máximo e mínimo", () => {
    const { result } = renderHook(() => useStageZoom());

    // Simula zoom exagerado (para cima)
    mockStage.scaleX.mockReturnValue(100);
    let e = mockEvent({ deltaY: -999 });
    act(() => result.current.handleStageWheel(e as any));
    expect(mockStage.scale).toHaveBeenCalledWith({ x: 3, y: 3 }); // maxScale = 3

    // Simula zoom exagerado (para baixo)
    mockStage.scaleX.mockReturnValue(0.001);
    e = mockEvent({ deltaY: 999 });
    act(() => result.current.handleStageWheel(e as any));
    expect(mockStage.scale).toHaveBeenCalledWith({ x: 0.3, y: 0.3 }); // minScale = 0.3
  });

  it("inicia pan e move o stage no segundo evento", () => {
    const { result } = renderHook(() => useStageZoom());

    // Primeiro evento: inicializa o lastPosition (não deve chamar batchDraw ainda)
    const e1 = mockEvent({ buttons: 1, ctrlKey: false, clientX: 10, clientY: 20 });
    act(() => result.current.handleStagePan(e1 as any));
    expect(mockStage.batchDraw).not.toHaveBeenCalled();

    // Segundo evento: agora deve chamar batchDraw (movimento detectado)
    const e2 = mockEvent({ buttons: 1, ctrlKey: false, clientX: 30, clientY: 50 });
    act(() => result.current.handleStagePan(e2 as any));
    expect(mockStage.batchDraw).toHaveBeenCalled();
  });

  it("não faz pan se não houver stage", () => {
    const { result } = renderHook(() => useStageZoom());
    const e = mockEvent({ buttons: 1, ctrlKey: false });
    e.target.getStage.mockReturnValue(null);
    act(() => result.current.handleStagePan(e as any));
    expect(mockStage.batchDraw).not.toHaveBeenCalled();
  });

  it("reseta pan quando ctrl é pressionado", () => {
    const { result } = renderHook(() => useStageZoom());
    const e = mockEvent({ ctrlKey: true });
    act(() => result.current.handleStagePan(e as any));
    // Espera que lastPosition volte a null (não visível, mas sem erro)
    expect(mockStage.batchDraw).not.toHaveBeenCalled();
  });

  it("não pan se nenhum botão estiver pressionado", () => {
    const { result } = renderHook(() => useStageZoom());
    const e = mockEvent({ buttons: 0 });
    act(() => result.current.handleStagePan(e as any));
    expect(mockStage.batchDraw).not.toHaveBeenCalled();
  });

  it("reseta zoom e posição ao dar duplo clique", () => {
    const { result } = renderHook(() => useStageZoom());
    const e = { target: { getStage: jest.fn(() => mockStage) } } as any;
    act(() => result.current.handleDoubleClick(e));
    expect(mockStage.scale).toHaveBeenCalledWith({ x: 1, y: 1 });
    expect(mockStage.position).toHaveBeenCalledWith({ x: 0, y: 0 });
    expect(mockStage.batchDraw).toHaveBeenCalled();
  });

  it("ignora duplo clique se não houver stage", () => {
    const { result } = renderHook(() => useStageZoom());
    const e = { target: { getStage: jest.fn(() => null) } } as any;
    act(() => result.current.handleDoubleClick(e));
    expect(mockStage.scale).not.toHaveBeenCalled();
  });
});
