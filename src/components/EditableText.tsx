import React, { useState, useRef, useEffect } from 'react';
import { Text, Group } from 'react-konva';

interface EditableTextProps {
  x: number;
  y: number;
  width: number;
  text: string;
  fontSize?: number;
  fontStyle?: string;
  fill?: string;
  onEditStart?: () => void;
  onEditEnd: (newText: string) => void;
  isEditing?: boolean;
}

export const EditableText: React.FC<EditableTextProps> = ({
  x,
  y,
  width,
  text,
  fontSize = 14,
  fontStyle = 'normal',
  fill = '#374151',
  onEditStart,
  onEditEnd,
  isEditing = false
}) => {
  const [isEditingInternal, setIsEditing] = useState(isEditing);
  const [currentText, setCurrentText] = useState(text);
  const textRef = useRef<any>(null);
  const groupRef = useRef<any>(null);

  useEffect(() => {
    if (isEditingInternal && textRef.current && groupRef.current) {
      // Esconde o texto original temporariamente
      textRef.current.hide();
      
      // Obtém a posição absoluta do grupo
      const group = groupRef.current;
      const absPos = group.getAbsolutePosition();
      
      // Obtém o estágio e sua escala
      const stage = group.getStage();
      const scale = stage?.scaleX() || 1;
      const stageX = stage?.x() || 0;
      const stageY = stage?.y() || 0;
      
      // Obtém a posição do container do estágio na página
      const container = stage?.container();
      const containerRect = container?.getBoundingClientRect() || { left: 0, top: 0 };
      
      // Calcula a posição correta considerando todos os fatores
      const textareaX = containerRect.left + absPos.x + x * scale + stageX;
      const textareaY = containerRect.top + absPos.y + y * scale + stageY;
      
      // Cria o textarea
      const textarea = document.createElement('textarea');
      textarea.style.position = 'fixed';
      textarea.style.top = textareaY + 'px';
      textarea.style.left = textareaX + 'px';
      textarea.style.width = (width * scale) + 'px';
      textarea.style.height = 'auto';
      textarea.style.minHeight = (fontSize * scale * 1.5) + 'px';
      textarea.style.fontSize = (fontSize * scale) + 'px';
      textarea.style.fontFamily = 'Arial, sans-serif';
      textarea.style.fontStyle = fontStyle;
      textarea.style.border = '2px solid #3b82f6';
      textarea.style.borderRadius = '4px';
      textarea.style.padding = '4px';
      textarea.style.margin = '0px';
      textarea.style.background = 'white';
      textarea.style.color = fill;
      textarea.style.zIndex = '1000';
      textarea.style.boxSizing = 'border-box';
      textarea.style.resize = 'none';
      textarea.style.overflow = 'hidden';
      textarea.style.lineHeight = '1.4';
      textarea.value = currentText;
      
      document.body.appendChild(textarea);
      
      // Foca e seleciona todo o texto
      textarea.focus();
      textarea.select();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleBlur();
        } else if (e.key === 'Escape') {
          cancelEdit();
        }
        
        // Auto-ajusta a altura
        setTimeout(() => {
          textarea.style.height = 'auto';
          textarea.style.height = (textarea.scrollHeight) + 'px';
        }, 0);
      };

      const handleBlur = () => {
        if (document.body.contains(textarea)) {
          document.body.removeChild(textarea);
        }
        setIsEditing(false);
        if (textRef.current) {
          textRef.current.show();
        }
        onEditEnd(textarea.value);
      };

      const cancelEdit = () => {
        if (document.body.contains(textarea)) {
          document.body.removeChild(textarea);
        }
        setIsEditing(false);
        if (textRef.current) {
          textRef.current.show();
        }
        setCurrentText(text);
      };

      textarea.addEventListener('keydown', handleKeyDown);
      textarea.addEventListener('blur', handleBlur);

      // Auto-ajusta a altura inicial
      setTimeout(() => {
        textarea.style.height = 'auto';
        textarea.style.height = (textarea.scrollHeight) + 'px';
      }, 0);

      return () => {
        textarea.removeEventListener('keydown', handleKeyDown);
        textarea.removeEventListener('blur', handleBlur);
        if (document.body.contains(textarea)) {
          document.body.removeChild(textarea);
        }
        if (textRef.current) {
          textRef.current.show();
        }
      };
    }
  }, [isEditingInternal, currentText, width, fontSize, x, y, fill, fontStyle]);

  const handleDblClick = () => {
    setIsEditing(true);
    onEditStart?.();
  };

  return (
    <Group ref={groupRef}>
      <Text
        ref={textRef}
        x={x}
        y={y}
        text={currentText}
        fontSize={fontSize}
        fontStyle={fontStyle}
        fill={fill}
        width={width}
        onDblClick={handleDblClick}
        onTap={handleDblClick}
      />
    </Group>
  );
};