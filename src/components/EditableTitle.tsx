// src/components/EditableTitle.tsx
import React, { useState } from "react";

interface EditableTitleProps {
  value: string;
  onChange: (newValue: string) => void;
}

export const EditableTitle: React.FC<EditableTitleProps> = ({ value, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleBlur = () => {
    setIsEditing(false);
    if (tempValue.trim()) onChange(tempValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleBlur();
    else if (e.key === "Escape") {
      setTempValue(value);
      setIsEditing(false);
    }
  };

  return (
    <div className={`editable-title ${isEditing ? "editing" : ""}`}>
      {isEditing ? (
        <input
          className="editable-title-input"
          value={tempValue}
          autoFocus
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <h2
          className="editable-title-text toolbar-project-name"
          onDoubleClick={() => setIsEditing(true)}
          title="Clique duas vezes para renomear o projeto"
        >
          {value}
        </h2>
      )}
    </div>
  );
};
