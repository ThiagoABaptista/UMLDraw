import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts } from '../../src/hooks/useKeyboardShortcuts';

describe('useKeyboardShortcuts', () => {
  const fireKey = (key: string, options: any = {}) => {
    const event = new KeyboardEvent('keydown', { key, ...options });
    window.dispatchEvent(event);
  };

  let onDelete: jest.Mock;
  let onEscape: jest.Mock;
  let onSave: jest.Mock;
  let onNewDiagram: jest.Mock;

  beforeEach(() => {
    onDelete = jest.fn();
    onEscape = jest.fn();
    onSave = jest.fn();
    onNewDiagram = jest.fn();
  });

  it('executa onDelete ao pressionar Delete ou Backspace', () => {
    renderHook(() =>
      useKeyboardShortcuts({ onDelete, onEscape, onSave, onNewDiagram })
    );

    fireKey('Delete');
    fireKey('Backspace');

    expect(onDelete).toHaveBeenCalledTimes(2);
  });

  it('executa onEscape ao pressionar ESC', () => {
    renderHook(() =>
      useKeyboardShortcuts({ onDelete, onEscape, onSave, onNewDiagram })
    );

    fireKey('Escape');

    expect(onEscape).toHaveBeenCalledTimes(1);
  });

  it('executa onSave ao pressionar Ctrl+S', () => {
    renderHook(() =>
      useKeyboardShortcuts({ onDelete, onEscape, onSave, onNewDiagram })
    );

    fireKey('s', { ctrlKey: true });

    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it('executa onNewDiagram ao pressionar Ctrl+N', () => {
    renderHook(() =>
      useKeyboardShortcuts({ onDelete, onEscape, onSave, onNewDiagram })
    );

    fireKey('n', { ctrlKey: true });

    expect(onNewDiagram).toHaveBeenCalledTimes(1);
  });

  it('não dispara atalhos quando foco está em input, textarea ou conteúdo editável', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    renderHook(() =>
      useKeyboardShortcuts({ onDelete, onEscape, onSave, onNewDiagram })
    );

    const event = new KeyboardEvent('keydown', {
      key: 'Delete',
      bubbles: true,
    });
    Object.defineProperty(event, 'target', { writable: false, value: input });

    window.dispatchEvent(event);

    expect(onDelete).not.toHaveBeenCalled();

    document.body.removeChild(input);
  });
});
