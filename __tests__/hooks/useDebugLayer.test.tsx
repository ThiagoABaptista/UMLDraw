import React from 'react';
import { render, screen } from '@testing-library/react';
import { DebugLayer } from '../../src/hooks/useDebugLayer';
import { Layer, Circle } from 'react-konva';

jest.mock('react-konva', () => ({
  Layer: ({ children }: any) => <div data-testid="layer">{children}</div>,
  Circle: (props: any) => <div data-testid="circle" {...props}></div>,
}));

const mockDiagram = {
  elements: [
    { id: '1', x: 10, y: 20 },
    { id: '2', x: 30, y: 40 },
  ],
};

describe('DebugLayer', () => {
  it('não renderiza quando disabled', () => {
    const { container } = render(<DebugLayer diagram={mockDiagram as any} enabled={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renderiza círculos quando enabled', () => {
    render(<DebugLayer diagram={mockDiagram as any} enabled={true} />);
    const circles = screen.getAllByTestId('circle');
    expect(circles.length).toBe(3);
  });

  it('contém um Layer como wrapper', () => {
    render(<DebugLayer diagram={mockDiagram as any} enabled />);
    expect(screen.getByTestId('layer')).toBeInTheDocument();
  });
});
