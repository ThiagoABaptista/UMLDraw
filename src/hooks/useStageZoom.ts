import { useCallback, useRef } from "react";
import { KonvaEventObject } from "konva/lib/Node";

/**
 * Hook de zoom/pan suave para o Stage.
 * - Zoom segue o cursor (igual ao comportamento do Gaphor e do Vue).
 * - Mantém limites de escala e suaviza o movimento.
 */
export const useStageZoom = () => {
  const scaleBy = 1.1;
  const minScale = 0.3;
  const maxScale = 3.0;

  const lastPosition = useRef<{ x: number; y: number } | null>(null);

  /** Zoom relativo ao ponteiro */
  const handleStageWheel = useCallback((e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    const stage = e.target.getStage();
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    // Direção natural (scroll up → zoom in)
    const direction = e.evt.deltaY < 0 ? 1 : -1;
    const newScale =
      direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    const clampedScale = Math.max(minScale, Math.min(maxScale, newScale));

    stage.scale({ x: clampedScale, y: clampedScale });

    const newPos = {
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    };

    stage.position(newPos);
    stage.batchDraw();
  }, []);

  /** Pan (arrastar canvas) */
  const handleStagePan = useCallback((e: KonvaEventObject<WheelEvent>) => {
    if (!e.evt.ctrlKey && e.evt.buttons === 1) {
      const stage = e.target.getStage();
      if (!stage) return;

      if (!lastPosition.current) {
        lastPosition.current = { x: e.evt.clientX, y: e.evt.clientY };
      } else {
        const dx = e.evt.clientX - lastPosition.current.x;
        const dy = e.evt.clientY - lastPosition.current.y;

        stage.x(stage.x() + dx);
        stage.y(stage.y() + dy);
        stage.batchDraw();

        lastPosition.current = { x: e.evt.clientX, y: e.evt.clientY };
      }
    } else {
      lastPosition.current = null;
    }
  }, []);

  /** Duplo clique → reset zoom e posição */
  const handleDoubleClick = useCallback((e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;

    stage.scale({ x: 1, y: 1 });
    stage.position({ x: 0, y: 0 });
    stage.batchDraw();
  }, []);

  return { handleStageWheel, handleStagePan, handleDoubleClick };
};
