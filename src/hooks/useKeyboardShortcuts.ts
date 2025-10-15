import { useEffect } from "react";

interface UseKeyboardShortcutsProps {
  onDelete?: () => void;
  onEscape?: () => void;
}

/**
 * Hook para registrar atalhos globais no diagrama.
 * - Delete / Backspace → deleta elemento selecionado.
 * - Esc → limpa seleção atual.
 */
export const useKeyboardShortcuts = ({ onDelete, onEscape }: UseKeyboardShortcutsProps) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;

      // Ignora se o foco está em um campo de texto ou input editável
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === "Escape" && onEscape) {
        e.preventDefault();
        onEscape();
      }

      if ((e.key === "Delete" || e.key === "Backspace") && onDelete) {
        e.preventDefault();
        onDelete();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onDelete, onEscape]);
};
