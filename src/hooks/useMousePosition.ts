import { useState, useCallback } from "react";
import { KonvaEventObject } from "konva/lib/Node";

export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;

    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const scale = stage.scaleX();
    const stageX = stage.x();
    const stageY = stage.y();

    // Converte posição do ponteiro (relativa à tela)
    // para coordenadas reais no canvas, compensando zoom/pan
    const canvasX = (pointer.x - stageX) / scale;
    const canvasY = (pointer.y - stageY) / scale;

    setMousePosition({ x: canvasX, y: canvasY });
  }, []);

  return { mousePosition, handleMouseMove };
};
