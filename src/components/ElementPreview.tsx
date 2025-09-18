import React from 'react';
import { Group, Rect, Circle, Path } from 'react-konva';
import { Tool } from '../types/umlTypes';

interface ElementPreviewProps {
  x: number;
  y: number;
  visible: boolean;
  tool: Tool;
  diagramType: 'usecase' | 'activity';
}

// Lucide paths
const USER_PATH = "M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4.33 0-8 2.17-8 5v3h16v-3c0-2.83-3.67-5-8-5z";

export const ElementPreview: React.FC<ElementPreviewProps> = ({ 
  x, y, visible, tool, diagramType 
}) => {
  if (!visible) return null;

  const getPreviewConfig = () => {
    if (diagramType === 'usecase') {
      return {
        width: tool === 'actor' ? 60 : 120,
        height: tool === 'actor' ? 60 : 60,
        type: tool
      };
    } else {
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
        <Path
          data={USER_PATH}
          x={config.width / 2 - 12}
          y={config.height / 2 - 12}
          scale={{ x: 1.2, y: 1.2 }}
          fill="#2563eb"
          stroke="#1d4ed8"
          strokeWidth={1.5}
        />
      );
    } else {
      return (
        <Rect
          width={config.width}
          height={config.height}
          fill="#bfdbfe"
          stroke="#3b82f6"
          strokeWidth={1.5}
          cornerRadius={config.height / 2}
          shadowColor="#3b82f6"
          shadowBlur={6}
          shadowOpacity={0.2}
        />
      );
    }
  };

  const renderActivityPreview = () => {
    const activityTool = tool as 'activity' | 'decision' | 'start' | 'end' | 'fork' | 'join' | 'merge';
    
    if (activityTool === 'activity') {
      return (
        <Rect
          width={config.width}
          height={config.height}
          fill="#e0f2fe"
          stroke="#0284c7"
          strokeWidth={1.5}
          cornerRadius={6}
        />
      );
    } else if (activityTool === 'decision') {
      return (
        <Rect
          width={config.width}
          height={config.height}
          fill="#fef9c3"
          stroke="#d97706"
          strokeWidth={1.5}
          rotation={45}
          offsetX={config.width / 2}
          offsetY={config.height / 2}
        />
      );
    } else if (activityTool === 'start') {
      return (
        <Circle
          x={config.width / 2}
          y={config.height / 2}
          radius={config.width / 2}
          fill="#22c55e"
          stroke="#16a34a"
          strokeWidth={1.5}
        />
      );
    } else if (activityTool === 'end') {
      return (
        <Circle
          x={config.width / 2}
          y={config.height / 2}
          radius={config.width / 2}
          fill="#dc2626"
          stroke="#991b1b"
          strokeWidth={1.5}
        />
      );
    } else {
      return (
        <Rect
          width={config.width}
          height={config.height}
          fill="#111827"
          stroke="#374151"
          strokeWidth={1.5}
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
