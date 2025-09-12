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
  metadata?: DiagramMetadata;
  classes: UMLClass[];
  relationships: UMLRelationship[];
}

export interface DiagramMetadata {
  version: string;
  name: string;
  created: string;
  lastModified: string;
  type: 'class' | 'usecase' | 'sequence';
}

export interface DiagramFile {
  metadata: DiagramMetadata;
  elements: UMLClass[];
  relationships: UMLRelationship[];
  viewport?: { scale: number; offset: { x: number; y: number } };
}

export type Tool = 'select' | 'class' | 'relationship';
export type CreationState = 'idle' | 'placing' | 'connecting';
export type ConnectionState = 'idle' | 'selecting-first' | 'selecting-second';
export type RelationshipType = 'association' | 'inheritance' | 'composition' | 'aggregation' | 'dependency';