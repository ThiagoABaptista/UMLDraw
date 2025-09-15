import React from 'react';
import { Group, Rect, Circle, Text } from 'react-konva';
import { Tool } from '../types/umlTypes';

interface ElementPreviewProps {
  x: number;
  y: number;
  visible: boolean;
  tool: Tool;
  diagramType: 'usecase' | 'activity';
}

export const ElementPreview: React.FC<ElementPreviewProps> = ({ 
  x, y, visible, tool, diagramType 
}) => {
  if (!visible) return null;

  const getPreviewConfig = () => {
    if (diagramType === 'usecase') {
      return {
        width: tool === 'actor' ? 60 : 120,
        height: tool === 'actor' ? 100 : 60,
        type: tool
      };
    } else {
      // Para diagrama de atividade, tratamos todas as ferramentas possíveis
      const widths: Record<string, number> = {
        activity: 120,
        decision: 80,
        start: 40,
        end: 40,
        fork: 20,
        join: 20,
        merge: 20
      };
      const heights: Record<string, number> = {
        activity: 60,
        decision: 60,
        start: 40,
        end: 40,
        fork: 80,
        join: 80,
        merge: 20
      };
      return {
        width: widths[tool] || 80,
        height: heights[tool] || 60,
        type: tool
      };
    }
  };

  const config = getPreviewConfig();

  const renderUseCasePreview = () => {
    if (tool === 'actor') {
      return (
        <Group>
          <Circle x={config.width / 2} y={20} radius={15} fill="#93c5fd" stroke="#3b82f6" strokeWidth={1} />
          <Rect x={config.width / 2 - 20} y={35} width={40} height={40} fill="#93c5fd" stroke="#3b82f6" strokeWidth={1} />
          <Rect x={config.width / 2 - 15} y={75} width={30} height={25} fill="#93c5fd" stroke="#3b82f6" strokeWidth={1} />
        </Group>
      );
    } else {
      return (
        <Rect
          width={config.width}
          height={config.height}
          fill="#bfdbfe"
          stroke="#3b82f6"
          strokeWidth={1}
          cornerRadius={config.height / 2}
          dash={[4, 4]}
        />
      );
    }
  };

  const renderActivityPreview = () => {
    // Use type assertion para garantir que o TypeScript entenda o contexto
    const activityTool = tool as 'activity' | 'decision' | 'start' | 'end' | 'fork' | 'join' | 'merge';
    
    if (activityTool === 'activity') {
      return (
        <Rect
          width={config.width}
          height={config.height}
          fill="#fde68a"
          stroke="#f59e0b"
          strokeWidth={1}
          cornerRadius={8}
          dash={[4, 4]}
        />
      );
    } else if (activityTool === 'decision') {
      return (
        <Rect
          width={config.width}
          height={config.height}
          fill="#fde68a"
          stroke="#f59e0b"
          strokeWidth={1}
          rotation={45}
          offsetX={config.width / 2}
          offsetY={config.height / 2}
          dash={[4, 4]}
        />
      );
    } else if (activityTool === 'start' || activityTool === 'end') {
      return (
        <Circle
          x={config.width / 2}
          y={config.height / 2}
          radius={config.width / 2}
          fill={activityTool === 'start' ? "#86efac" : "#fca5a5"}
          stroke={activityTool === 'start' ? "#10b981" : "#ef4444"}
          strokeWidth={1}
          dash={[4, 4]}
        />
      );
    } else {
      return (
        <Rect
          width={config.width}
          height={config.height}
          fill="#e5e7eb"
          stroke="#6b7280"
          strokeWidth={1}
          dash={[4, 4]}
        />
      );
    }
  };

  return (
    <Group
      x={x - config.width / 2}
      y={y - config.height / 2}
      opacity={0.6}
      name="preview-element"
      listening={false}
    >
      {diagramType === 'usecase' ? renderUseCasePreview() : renderActivityPreview()}
    </Group>
  );
};