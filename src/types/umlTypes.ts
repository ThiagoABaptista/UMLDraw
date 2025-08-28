export interface UMLClass {
  id: string;
  name: string;
  attributes: string[];
  methods: string[];
  x: number;
  y: number;
  width: number;
  height: number;
  isEditing?: boolean;
}

export interface UMLRelationship {
  id: string;
  from: string;
  to: string;
  type: 'association' | 'inheritance' | 'composition' | 'aggregation';
  label?: string;
}

export interface UMLDiagram {
  classes: UMLClass[];
  relationships: UMLRelationship[];
}

export type Tool = 'select' | 'class' | 'association' | 'inheritance' | 'composition' | 'aggregation';