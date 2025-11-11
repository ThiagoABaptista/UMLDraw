import { useEffect } from "react";

interface UseKeyboardShortcutsProps {
  onDelete?: () => void;
  onEscape?: () => void;
  onSave?: () => void;
  onNewDiagram?: () => void;
}

/**
 * Hook para registrar atalhos globais no editor UML.
 * - Delete / Backspace → deleta elemento selecionado.
 * - Esc → limpa seleção atual.
 * - Ctrl+S → salvar projeto.
 * - Ctrl+N → criar novo diagrama.
 */
export const useKeyboardShortcuts = ({
  onDelete,
  onEscape,
  onSave,
  onNewDiagram,
}: UseKeyboardShortcutsProps) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;

      // Evita capturar eventos quando o foco está em inputs, textareas ou edições de texto
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // ESC limpa seleção
      if (e.key === "Escape" && onEscape) {
        e.preventDefault();
        onEscape();
      }

      // Delete / Backspace remove elemento
      if ((e.key === "Delete" || e.key === "Backspace") && onDelete) {
        e.preventDefault();
        onDelete();
      }

      // Ctrl+S → salvar projeto
      if (e.ctrlKey && e.key.toLowerCase() === "s" && onSave) {
        e.preventDefault();
        onSave();
      }

      // Ctrl+N → novo diagrama
      if (e.ctrlKey && e.key.toLowerCase() === "n" && onNewDiagram) {
        e.preventDefault();
        onNewDiagram();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onDelete, onEscape, onSave, onNewDiagram]);
};
