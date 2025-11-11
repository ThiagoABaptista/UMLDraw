/// <reference types="@testing-library/jest-dom" />
import React from "react";
import { render, screen } from "@testing-library/react";
import { GridBackground } from "../../src/components/GridBackground";

jest.mock("react-konva", () => ({
  Line: ({ points }: any) => (
    <div
      data-testid="grid-line"
      data-points={Array.isArray(points) ? points.join(",") : ""}
    />
  ),
}));

describe("GridBackground", () => {
  const defaultProps = {
    width: 500,
    height: 300,
    gridSize: 25,
  };

  it("renderiza linhas de grade", () => {
    render(<GridBackground {...defaultProps} />);
    const lines = screen.getAllByTestId("grid-line");
    expect(lines.length).toBeGreaterThan(0);
  });

  it("aumenta o número de linhas quando o gridSize diminui", () => {
    const { rerender } = render(<GridBackground {...defaultProps} />);
    const initialLines = screen.getAllByTestId("grid-line").length;

    rerender(<GridBackground {...defaultProps} gridSize={10} />);
    const newLines = screen.getAllByTestId("grid-line").length;

    expect(newLines).toBeGreaterThan(initialLines);
  });

  it("renderiza corretamente para diferentes dimensões", () => {
    const testCases = [
      { width: 100, height: 100, gridSize: 10 },
      { width: 800, height: 600, gridSize: 50 },
      { width: 200, height: 150, gridSize: 20 },
    ];

    for (const { width, height, gridSize } of testCases) {
      render(<GridBackground width={width} height={height} gridSize={gridSize} />);
      const lines = screen.getAllByTestId("grid-line");
      expect(lines.length).toBeGreaterThan(0);
    }
  });

  it("usa gridSize padrão (25) quando não é fornecido", () => {
    render(<GridBackground width={500} height={300} />);
    const lines = screen.getAllByTestId("grid-line");
    expect(lines.length).toBeGreaterThan(0);
  });

  it("gera linhas verticais e horizontais distintas", () => {
    render(<GridBackground width={100} height={100} gridSize={25} />);
    const lines = screen.getAllByTestId("grid-line");

    const verticalLines = lines.filter((line) =>
      line.getAttribute("data-points")?.match(/^0,|,0,/)
    );
    const horizontalLines = lines.filter((line) =>
      line.getAttribute("data-points")?.match(/,0,100,0|,0,0,100/)
    );

    expect(verticalLines.length).toBeGreaterThan(0);
    expect(horizontalLines.length).toBeGreaterThan(0);
  });
});
