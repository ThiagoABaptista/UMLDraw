import { renderHook, act } from "@testing-library/react";
import { useDiagramOperations } from "../../src/hooks/useDiagramOperations";
import { UMLDiagram, Tool } from "../../src/types/umlTypes";

type HookReturn = ReturnType<typeof useDiagramOperations>;

describe("useDiagramOperations", () => {
  const baseDiagram: UMLDiagram = {
    metadata: {
      version: "1.0",
      name: "Test Diagram",
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      type: "usecase",
    },
    elements: [
      { id: "1", name: "Ator", x: 0, y: 0, width: 100, height: 50, type: "actor" },
      { id: "2", name: "UseCase", x: 10, y: 10, width: 80, height: 40, type: "usecase" },
    ],
    relationships: [
      { id: "r1", from: "1", to: "2", type: "association", label: "" },
    ],
  };

  const updateDiagram = jest.fn((fn) => fn(baseDiagram));

  const defaultProps = {
    diagram: baseDiagram,
    selectedElement: null,
    tool: "select" as Tool,
    isEditing: false,
    creationState: "idle" as const,
    connectionState: "idle" as const,
    connectionStart: null,
    setDiagram: jest.fn(),
    setSelectedElement: jest.fn(),
    setTool: jest.fn(),
    setIsEditing: jest.fn(),
    setCreationState: jest.fn(),
    setConnectionState: jest.fn(),
    setConnectionStart: jest.fn(),
    updateDiagram,
    clearEditingState: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("cria novo elemento corretamente", () => {
    const { result } = renderHook<HookReturn, unknown>(() =>
      useDiagramOperations(defaultProps, "activity")
    );
    const el = result.current.createNewElement("activity", 200, 200);
    expect(el.type).toBe("activity");
    expect(el.name).toBe("Atividade");
  });

  it("edita nome do elemento e desativa modo edição", () => {
    const { result } = renderHook<HookReturn, unknown>(() =>
      useDiagramOperations(defaultProps, "usecase")
    );
    act(() => result.current.handleTextEdit("1", "Novo Nome"));
    expect(updateDiagram).toHaveBeenCalled();
    expect(defaultProps.setIsEditing).toHaveBeenCalledWith(false);
  });

  it("move elemento com handleElementDragEnd", () => {
    const { result } = renderHook<HookReturn, unknown>(() =>
      useDiagramOperations(defaultProps, "usecase")
    );
    act(() => result.current.handleElementDragEnd("1", 300, 400));
    expect(updateDiagram).toHaveBeenCalled();
  });

  it("clica em elemento enquanto criando conexão", () => {
    const props = { ...defaultProps, connectionState: "selecting-first" as const };
    const { result } = renderHook<HookReturn, unknown>(() =>
      useDiagramOperations(props, "usecase")
    );

    act(() => result.current.handleElementClick("1"));
    expect(props.setConnectionStart).toHaveBeenCalledWith("1");
    expect(props.setConnectionState).toHaveBeenCalledWith("selecting-second");

    const props2 = { ...defaultProps, connectionState: "selecting-second" as const, connectionStart: "1" };
    const { result: result2 } = renderHook<HookReturn, unknown>(() =>
      useDiagramOperations(props2, "usecase")
    );

    act(() => result2.current.handleElementClick("2"));
    expect(updateDiagram).toHaveBeenCalled();
    expect(props2.setConnectionState).toHaveBeenCalledWith("idle");
  });

  it("ignora clique quando está colocando elemento (placing)", () => {
    const props = { ...defaultProps, creationState: "placing" as const };
    const { result } = renderHook<HookReturn, unknown>(() =>
      useDiagramOperations(props, "activity")
    );
    act(() => result.current.handleElementClick("1"));
    expect(props.setSelectedElement).not.toHaveBeenCalled();
  });

  it("handleStageClick reseta seleção e estados", () => {
    const props = {
      ...defaultProps,
      creationState: "placing" as const,
      connectionState: "selecting-second" as const,
    };
    const { result } = renderHook<HookReturn, unknown>(() =>
      useDiagramOperations(props, "usecase")
    );
    act(() => result.current.handleStageClick());
    expect(props.setSelectedElement).toHaveBeenCalledWith(null);
    expect(props.setConnectionState).toHaveBeenCalledWith("idle");
  });

  it("handleToolChange entra em modo placing se ferramenta for elemento", () => {
    const { result } = renderHook<HookReturn, unknown>(() =>
      useDiagramOperations(defaultProps, "usecase")
    );
    act(() => result.current.handleToolChange("actor"));
    expect(defaultProps.setCreationState).toHaveBeenCalledWith("placing");
  });

  it("handleToolChange entra em modo de relação se ferramenta for relationship", () => {
    const { result } = renderHook<HookReturn, unknown>(() =>
      useDiagramOperations(defaultProps, "usecase")
    );
    act(() => result.current.handleToolChange("relationship"));
    expect(defaultProps.setConnectionState).toHaveBeenCalledWith("selecting-first");
  });

  it("cria novo relacionamento com rótulo correto", () => {
    const { result } = renderHook<HookReturn, unknown>(() =>
      useDiagramOperations(defaultProps, "usecase")
    );
    const rel = result.current.createNewRelationship("1", "2");
    expect(rel.type).toBe("association");
    expect(typeof rel.label).toBe("string");
  });

  it("deleta relacionamento existente sem confirmação", () => {
    const { result } = renderHook<HookReturn, unknown>(() =>
      useDiagramOperations(defaultProps, "usecase")
    );
    const relDel = result.current.prepareDeleteItem("r1");
    expect(relDel.needsConfirm).toBe(false);
    act(() => relDel.execute());
    expect(updateDiagram).toHaveBeenCalled();
  });

  it("retorna needsConfirm true ao deletar elemento com relacionamento", () => {
    const { result } = renderHook<HookReturn, unknown>(() =>
      useDiagramOperations(defaultProps, "usecase")
    );
    const del = result.current.prepareDeleteItem("1");
    expect(del.needsConfirm).toBe(true);
    expect(del.relatedCount).toBeGreaterThan(0);
  });

  it("retorna fallback quando id não existe", () => {
    const { result } = renderHook<HookReturn, unknown>(() =>
      useDiagramOperations(defaultProps, "usecase")
    );
    const del = result.current.prepareDeleteItem("inexistente");
    expect(typeof del.execute).toBe("function");
    act(() => del.execute());
    expect(updateDiagram).not.toHaveBeenCalled();
  });
});
