import React from "react";
import { X, Plus } from "lucide-react";
import { UMLDiagram } from "../types/umlTypes";

interface DiagramTabsProps {
  diagrams: UMLDiagram[];
  activeIndex: number;
  onSwitch: (index: number) => void;
  onNew: () => void;
  onDelete: (index: number) => void;
}

export const DiagramTabs: React.FC<DiagramTabsProps> = ({
  diagrams,
  activeIndex,
  onSwitch,
  onNew,
  onDelete,
}) => {
  return (
    <div className="diagram-tabs-container">
      <div className="diagram-tabs-bar">
        {diagrams.map((d, i) => (
          <div
            key={d.metadata.name}
            className={`diagram-tab ${i === activeIndex ? "active" : ""}`}
            onClick={() => onSwitch(i)}
          >
            {d.metadata.name}
            <X
              size={14}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(i);
              }}
            />
          </div>
        ))}
      </div>
      <button className="diagram-tab-new" onClick={onNew} title="Novo Diagrama">
        <Plus size={16} />
      </button>
    </div>
  );
};
