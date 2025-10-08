import { useEffect } from 'react';

interface UseKeyboardShortcutsProps {
  onDelete: () => void;
}

export const useKeyboardShortcuts = ({ onDelete }: UseKeyboardShortcutsProps) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // previne comportamento padrão (por ex. navegar no histórico)
        e.preventDefault();
        onDelete();
      }
    };
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [onDelete]);
};
