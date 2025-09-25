import React from 'react';
import { Group, Rect, Circle, Ellipse, RegularPolygon, Text } from 'react-konva';
import { Tool } from '../types/umlTypes';

interface ElementPreviewProps {
  tool: Tool;
  x?: number;
  y?: number;
  size?: number;
  visible?: boolean;
}

export const ElementPreview: React.FC<ElementPreviewProps> = ({ 
  tool, 
  x = 0,
  y = 0,
  size = 40,
  visible = true
}) => {
  
  if (!visible) {
    return null;
  }

  const renderPreviewShape = () => {
    const fillColor = getPreviewColor();
    const strokeColor = fillColor;

    switch (tool) {
      case 'actor':
        return (
          <Group>
            <Rect
              width={size}
              height={size}
              fill={fillColor}
              fillOpacity={0.1}
              stroke={strokeColor}
              strokeWidth={2}
              cornerRadius={5}
            />
            <Circle
              x={size / 2}
              y={size / 3}
              radius={size / 6}
              fill={fillColor}
              fillOpacity={0.3}
            />
            <Text
              text="Ator"
              x={10}
              y={size - 25}
              width={size - 20}
              align="center"
              fontSize={10}
              fill={fillColor}
            />
          </Group>
        );

      case 'usecase':
        return (
          <Group>
            <Ellipse
              x={size / 2}
              y={size / 2}
              radiusX={size / 2 - 5}
              radiusY={size / 2 - 5}
              fill={fillColor}
              fillOpacity={0.1}
              stroke={strokeColor}
              strokeWidth={2}
            />
            <Text
              text="Caso Uso"
              x={10}
              y={size / 2 - 8}
              width={size - 20}
              align="center"
              fontSize={9}
              fill={fillColor}
            />
          </Group>
        );

      case 'activity':
        return (
          <Group>
            <Rect
              width={size}
              height={size}
              fill={fillColor}
              fillOpacity={0.1}
              stroke={strokeColor}
              strokeWidth={2}
              cornerRadius={5}
            />
            <Text
              text="Atividade"
              x={10}
              y={size / 2 - 8}
              width={size - 20}
              align="center"
              fontSize={9}
              fill={fillColor}
            />
          </Group>
        );

      case 'decision':
        return (
          <Group>
            <RegularPolygon
              x={size / 2}
              y={size / 2}
              sides={4}
              radius={size / 2 - 5}
              fill={fillColor}
              fillOpacity={0.1}
              stroke={strokeColor}
              strokeWidth={2}
            />
            <Text
              text="Decisão"
              x={10}
              y={size / 2 - 8}
              width={size - 20}
              align="center"
              fontSize={9}
              fill={fillColor}
            />
          </Group>
        );

      case 'start':
        return (
          <Group>
            <Circle
              x={size / 2}
              y={size / 2}
              radius={size / 2 - 2}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={2}
            />
            <Text
              text="Início"
              x={10}
              y={size / 2 - 8}
              width={size - 20}
              align="center"
              fontSize={9}
              fill="white"
            />
          </Group>
        );

      case 'end':
        return (
          <Group>
            <Circle
              x={size / 2}
              y={size / 2}
              radius={size / 2 - 2}
              fill={fillColor}
              fillOpacity={0.1}
              stroke={strokeColor}
              strokeWidth={2}
            />
            <Circle
              x={size / 2}
              y={size / 2}
              radius={size / 2 - 6}
              fill={fillColor}
            />
            <Text
              text="Fim"
              x={10}
              y={size / 2 - 8}
              width={size - 20}
              align="center"
              fontSize={9}
              fill="white"
            />
          </Group>
        );

      case 'fork':
        return (
          <Group>
            <Rect
              width={size}
              height={8}
              y={(size - 8) / 2}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={2}
            />
            <Text
              text="Fork"
              x={10}
              y={size / 2 - 8}
              width={size - 20}
              align="center"
              fontSize={9}
              fill={fillColor}
            />
          </Group>
        );

      case 'join':
        return (
          <Group>
            <Rect
              width={size}
              height={8}
              y={(size - 8) / 2}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={2}
            />
            <Text
              text="Join"
              x={10}
              y={size / 2 - 8}
              width={size - 20}
              align="center"
              fontSize={9}
              fill={fillColor}
            />
          </Group>
        );

      case 'merge':
        return (
          <Group>
            <RegularPolygon
              x={size / 2}
              y={size / 2}
              sides={4}
              radius={size / 2 - 5}
              fill={fillColor}
              fillOpacity={0.1}
              stroke={strokeColor}
              strokeWidth={2}
            />
            <Text
              text="Merge"
              x={10}
              y={size / 2 - 8}
              width={size - 20}
              align="center"
              fontSize={9}
              fill={fillColor}
            />
          </Group>
        );

      default:
        return (
          <Group>
            <Rect
              width={size}
              height={size}
              fill="#f0f0f0"
              stroke="#ccc"
              strokeWidth={1}
              cornerRadius={5}
            />
            <Text
              text="Elemento"
              x={10}
              y={size / 2 - 8}
              width={size - 20}
              align="center"
              fontSize={9}
              fill="#666"
            />
          </Group>
        );
    }
  };

  const getPreviewColor = (): string => {
    switch (tool) {
      case 'actor': return '#4f46e5';
      case 'usecase': return '#10b981';
      case 'activity': return '#3b82f6';
      case 'decision': return '#f59e0b';
      case 'start': return '#22c55e';
      case 'end': return '#ef4444';
      case 'fork': return '#f97316';
      case 'join': return '#06b6d4';
      case 'merge': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  return (
    <Group x={x} y={y} listening={false}>
      {renderPreviewShape()}
    </Group>
  );
};