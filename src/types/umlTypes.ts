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
  from: string;       // ID do elemento de origem
  to: string;         // ID do elemento de destino
  type: RelationshipType;
  label?: string;
}

export interface UMLDiagram {
  classes: UMLClass[];
  relationships: UMLRelationship[];
}

export type Tool = 'select' | 'class' | 'relationship';
export type CreationState = 'idle' | 'placing' | 'connecting';
export type RelationshipType = 'association' | 'inheritance' | 'composition' | 'aggregation' | 'dependency';
export type ConnectionState = 'idle' | 'selecting-first' | 'selecting-second';