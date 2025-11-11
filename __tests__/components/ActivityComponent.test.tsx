/// <reference types="@testing-library/jest-dom" />
import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { ActivityComponent } from "../../src/components/ActivityComponent";
import { ActivityElement } from "../../src/types/umlTypes";

// Mock dos subcomponentes (atualizado)
jest.mock("../../src/components/EditableText", () => ({
  EditableText: ({ onEditEnd, text = "Texto" }: any) => (
    <input
      data-testid="editable-text"
      onChange={(e) => onEditEnd(e.target.value)}
      defaultValue={text}
    />
  ),
}));

jest.mock("../../src/components/ElementIcon", () => ({
  ElementIcon: ({ isSelected }: any) => (
    <div
      data-testid="element-icon"
      data-selected={isSelected}
    />
  ),
}));

describe("ActivityComponent", () => {
  const baseElement: ActivityElement = {
    id: "1",
    name: "Atividade Teste",
    x: 10,
    y: 20,
    width: 120,
    height: 60,
    type: "activity",
    isEditing: false,
    color: "#000000",
  };

  const defaultProps = {
    element: baseElement,
    onDragMove: jest.fn(),
    onDragEnd: jest.fn(),
    onClick: jest.fn(),
    onTextEdit: jest.fn(),
    isSelected: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza corretamente com texto", () => {
    render(<ActivityComponent {...defaultProps} />);
    
    expect(screen.getByTestId("editable-text")).toBeInTheDocument();
    expect(screen.getByTestId("element-icon")).toBeInTheDocument();
  });

  it("chama onClick ao clicar no elemento", () => {
    render(<ActivityComponent {...defaultProps} />);
    
    fireEvent.click(screen.getByTestId("konva-group"));
    expect(defaultProps.onClick).toHaveBeenCalledWith("1");
  });

  it("chama onTextEdit ao editar o texto", () => {
    render(<ActivityComponent {...defaultProps} />);
    
    fireEvent.change(screen.getByTestId("editable-text"), { 
      target: { value: "Novo Nome" } 
    });
    
    expect(defaultProps.onTextEdit).toHaveBeenCalledWith("1", "Novo Nome");
  });

  it("chama onDragMove e onDragEnd durante o drag", () => {
    render(<ActivityComponent {...defaultProps} />);
    
    // Simula eventos de drag
    fireEvent.dragStart(screen.getByTestId("konva-group"));
    fireEvent.dragEnd(screen.getByTestId("konva-group"));
    
    // Verifica se as funções foram chamadas com os parâmetros corretos
    expect(defaultProps.onDragMove).toHaveBeenCalled();
    expect(defaultProps.onDragEnd).toHaveBeenCalled();
  });

  it("usa isSelected corretamente no ElementIcon", () => {
    const { rerender } = render(<ActivityComponent {...defaultProps} />);
    
    expect(screen.getByTestId("element-icon")).toHaveAttribute("data-selected", "false");

    rerender(<ActivityComponent {...defaultProps} isSelected={true} />);
    expect(screen.getByTestId("element-icon")).toHaveAttribute("data-selected", "true");
  });

  it("não renderiza texto para tipos que não mostram texto", () => {
    const element = { ...baseElement, type: "fork" as const };
    const { queryByTestId } = render(<ActivityComponent {...defaultProps} element={element} />);
    
    expect(queryByTestId("editable-text")).not.toBeInTheDocument();
  });

  it("renderiza texto para tipos activity e decision", () => {
    const activityElement = { ...baseElement, type: "activity" as const };
    const decisionElement = { ...baseElement, type: "decision" as const };
    
    const { rerender } = render(<ActivityComponent {...defaultProps} element={activityElement} />);
    expect(screen.getByTestId("editable-text")).toBeInTheDocument();
    
    rerender(<ActivityComponent {...defaultProps} element={decisionElement} />);
    expect(screen.getByTestId("editable-text")).toBeInTheDocument();
  });
});