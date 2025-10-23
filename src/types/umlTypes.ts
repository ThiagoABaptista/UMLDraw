import { umlSvgColors } from "./umlSvgColors";

export interface UseCaseElement {
  id: string;
  type: 'actor' | 'usecase' | 'object' | 'note' | 'association' | 'generalization' | 'extend' | 'include';
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isEditing?: boolean;
  color?: keyof typeof umlSvgColors;
}

export interface ActivityElement {
  id: string;
  type:
    | 'start'
    | 'end'
    | 'activity'
    | 'decision'
    | 'merge'
    | 'fork'
    | 'join'
    | 'control_flow'
    | 'realization'
    | 'swimlane'
    | 'end_flow';
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isEditing?: boolean;
  color?: keyof typeof umlSvgColors;
}

export interface UMLRelationship {
  id: string;
  from: string;
  to: string;
  type: RelationshipType;
  label?: string;
  guard?: string;
}

export interface DiagramMetadata {
  version: string;
  name: string;
  created: string;
  lastModified: string;
  type: 'usecase' | 'activity';
  comments?: string;
}

export interface UMLDiagram {
  metadata: DiagramMetadata;
  elements: (UseCaseElement | ActivityElement)[];
  relationships: UMLRelationship[];
}

export interface UMLProject {
  version: string;
  name: string;
  created: string;
  lastModified: string;
  diagrams: UMLDiagram[];
}

export interface DiagramFile extends UMLDiagram {
  viewport?: { scale: number; offset: { x: number; y: number } };
}

export type Tool =
  | "select"
  | "actor"
  | "usecase"
  | "relationship"
  | "activity"
  | "decision"
  | "start"
  | "end"
  | "fork"
  | "join"
  | "merge";

export type CreationState = 'idle' | 'placing';
export type ConnectionState = 'idle' | 'selecting-first' | 'selecting-second';

export type RelationshipType =
  | 'association'
  | 'include'
  | 'extend'
  | 'generalization'
  | 'dependency'
  | 'control_flow'
  | 'object_flow';
