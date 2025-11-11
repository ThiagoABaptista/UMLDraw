import { renderHook, act } from '@testing-library/react';
import { useDiagramOperations } from "../../src/hooks/useDiagramOperations";
import { createMockDiagram } from '../../__mocks__/umlMocks';
import { UMLDiagram } from "../../src/types/umlTypes";

describe("useDiagramOperations", () => {
  // Cria diagrama base válido
  const baseDiagram: UMLDiagram = createMockDiagram("activity");
  baseDiagram.elements.push({
    id: "1",
    name: "Ator",
    x: 0,
    y: 0,
    width: 100,
    height: 50,
    type: "actor"
  });

  // Mock da função updateDiagram
  const updateDiagram = jest.fn((fn: (d: UMLDiagram) => UMLDiagram) => fn(baseDiagram));

  // Props completas, conforme interface DiagramOperationsProps
const defaultProps = {
    diagram: baseDiagram,
    selectedElement: null,
    tool: "select" as const,
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


  it("cria novo elemento corretamente", () => {
    const { result } = renderHook(() =>
      useDiagramOperations(defaultProps, "activity")
    );

    const newElement = result.current.createNewElement("activity", 200, 200);
    expect(newElement.type).toBe("activity");
    expect(newElement.name).toBe("Atividade");
    expect(typeof newElement.id).toBe("string");
  });

  it("edita texto do elemento corretamente", () => {
    const { result } = renderHook(() =>
      useDiagramOperations(defaultProps, "usecase")
    );

    act(() => {
      result.current.handleTextEdit("1", "Novo Nome");
    });

    expect(updateDiagram).toHaveBeenCalled();
  });

  it("deleta elemento e atualiza diagrama", () => {
    const { result } = renderHook(() =>
      useDiagramOperations(defaultProps, "usecase")
    );

    const del = result.current.prepareDeleteItem("1");
    expect(del).toHaveProperty("execute");

    act(() => del.execute());
    expect(updateDiagram).toHaveBeenCalled();
  });
});
