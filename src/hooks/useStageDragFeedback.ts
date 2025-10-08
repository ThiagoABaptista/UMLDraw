import { useCallback, useRef } from "react";
import { UMLDiagram } from "../types/umlTypes";

interface StageDragFeedbackProps {
  updateDiagram: (updater: (prev: UMLDiagram) => UMLDiagram) => void;
}

/**
 * Hook para melhorar o desempenho durante arrastes no diagrama.
 * Atualiza o estado com um leve debounce (100 ms) para evitar re-renders excessivos.
 */
export const useStageDragFeedback = ({ updateDiagram }: StageDragFeedbackProps) => {
  // Guarda o timeout ativo
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Guarda a última posição recebida
  const lastPosition = useRef<{ id: string; x: number; y: number } | null>(null);

  /**
   * Chamado durante o movimento do elemento (dragMove).
   * Aplica debounce para limitar a frequência de updates.
   */
  const handleDragMove = useCallback(
    (id: string, x: number, y: number) => {
      // Atualiza a última posição
      lastPosition.current = { id, x, y };

      // Limpa qualquer timer anterior
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // Cria novo timer (debounce leve)
      timeoutRef.current = setTimeout(() => {
        if (lastPosition.current) {
          const { id, x, y } = lastPosition.current;

          updateDiagram((prev) => ({
            ...prev,
            elements: prev.elements.map((el) =>
              el.id === id ? { ...el, x, y } : el
            ),
          }));
        }
      }, 100); // 100 ms = debounce leve
    },
    [updateDiagram]
  );

  return { handleDragMove };
};
