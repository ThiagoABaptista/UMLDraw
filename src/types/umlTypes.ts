import { umlSvgColors } from "./umlSvgColors";

/**
 * === Tipos base de elementos ===
 * Ambos compartilham campos comuns para posição, tamanho e edição.
 */
interface BaseUMLElement {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;

  /** Indica se o nome está sendo editado no canvas */
  isEditing?: boolean;

  /** Cor do elemento, baseada na paleta padronizada, com fallback em tempo de execução (#000000) */
  color?: keyof typeof umlSvgColors;
}
/**
 * === 🧍 Elementos do diagrama de caso de uso ===
 */
export interface UseCaseElement extends BaseUMLElement {
  type:
    | "actor"
    | "usecase"
    | "object"
    | "note"
    | "association"
    | "generalization"
    | "extend"
    | "include";
}

/**
 * === ⚙️ Elementos do diagrama de atividades ===
 */
export interface ActivityElement extends BaseUMLElement {
  type:
    | "start"
    | "end"
    | "activity"
    | "decision"
    | "merge"
    | "fork"
    | "join"
    | "control_flow"
    | "realization"
    | "swimlane"
    | "end_flow";
}

/**
 * === Relações UML ===
 */
export interface UMLRelationship {
  id: string;
  from: string;
  to: string;
  type: RelationshipType;
  label?: string;
  guard?: string;
}

/**
 * === Estruturas de diagrama e projeto ===
 */
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

/**
 * === Estados e tipos auxiliares ===
 */
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
