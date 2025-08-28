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

  useEffect(() => {
    if (isEditingInternal && textRef.current) {
      textRef.current.hide();
      const textPosition = textRef.current.absolutePosition();
      
      const textarea = document.createElement('textarea');
      textarea.style.position = 'absolute';
      textarea.style.top = textPosition.y + 'px';
      textarea.style.left = textPosition.x + 'px';
      textarea.style.width = width + 'px';
      textarea.style.height = '30px';
      textarea.style.fontSize = fontSize + 'px';
      textarea.style.border = '2px solid #3b82f6';
      textarea.style.padding = '4px';
      textarea.style.margin = '0px';
      textarea.style.background = 'white';
      textarea.style.zIndex = '1000';
      textarea.value = currentText;
      
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          handleBlur();
        } else if (e.key === 'Escape') {
          cancelEdit();
        }
      };

      const handleBlur = () => {
        document.body.removeChild(textarea);
        setIsEditing(false);
        onEditEnd(currentText);
      };

      const cancelEdit = () => {
        document.body.removeChild(textarea);
        setIsEditing(false);
        setCurrentText(text);
      };

      textarea.addEventListener('keydown', handleKeyDown);
      textarea.addEventListener('blur', handleBlur);

      return () => {
        textarea.removeEventListener('keydown', handleKeyDown);
        textarea.removeEventListener('blur', handleBlur);
        if (document.body.contains(textarea)) {
          document.body.removeChild(textarea);
        }
      };
    }
  }, [isEditingInternal, currentText, width, fontSize]);

  const handleDblClick = () => {
    setIsEditing(true);
    onEditStart?.();
  };

  if (isEditingInternal) {
    return (
      <Group>
        <Text
          ref={textRef}
          x={x}
          y={y}
          text={currentText}
          fontSize={fontSize}
          fontStyle={fontStyle}
          fill={fill}
          width={width}
        />
      </Group>
    );
  }

  return (
    <Text
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
  );
};