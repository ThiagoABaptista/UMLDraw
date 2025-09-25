// src/components/GaphorIcon.tsx
import React from "react";
import { Image, Group, Rect, Text } from "react-konva";
import { ActivityElement, UseCaseElement } from "../types/umlTypes";
import { useGaphorIcon } from "../hooks/useGaphorIcon";

interface GaphorIconProps {
  element: UseCaseElement | ActivityElement;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const GaphorIcon: React.FC<GaphorIconProps> = ({
  element,
  x,
  y,
  width,
  height
}) => {
  const getElementColor = (): string => {
    // ...sua lógica...
    return "#4F46E5";
  };

  const { image, loading, error } = useGaphorIcon({
    elementType: element.type,
    width,
    height,
    color: getElementColor(),
    scale: 2
  });

  if (loading || !image) return null;

  return (
    <Image
      x={x}
      y={y}
      width={width}
      height={height}
      image={image}
      listening={false}
    />
  );
};

const getCornerRadius = (elementType: string): number => {
  const elementsWithCornerRadius = ['activity', 'actor', 'system', 'usecase'];
  return elementsWithCornerRadius.includes(elementType) ? 5 : 0;
};