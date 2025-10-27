import { ActivityElement, UseCaseElement } from '../types/umlTypes';

// Importações diretas dos SVGs
import actorSvg from '../assets/icons/gaphor/uml/gaphor-actor-symbolic.svg';
import usecaseSvg from '../assets/icons/gaphor/uml/gaphor-use-case-symbolic.svg';
import activitySvg from '../assets/icons/gaphor/activities/gaphor-action-symbolic.svg';
import decisionSvg from '../assets/icons/gaphor/activities/gaphor-decision-node-symbolic.svg';
import startSvg from '../assets/icons/gaphor/activities/gaphor-initial-node-symbolic.svg';
import endSvg from '../assets/icons/gaphor/activities/gaphor-activity-final-node-symbolic.svg';
import forkSvg from '../assets/icons/gaphor/activities/gaphor-fork-node-symbolic.svg';
import joinSvg from '../assets/icons/gaphor/activities/gaphor-join-node-symbolic.svg';
import mergeSvg from '../assets/icons/gaphor/states/gaphor-pseudostate-symbolic.svg';

export type ElementType = UseCaseElement['type'] | ActivityElement['type'];

export const umlSvgContent: Record<string, string> = {
  // Casos de Uso
  'actor': actorSvg,
  'usecase': usecaseSvg,
  
  // Atividades
  'activity': activitySvg,
  'decision': decisionSvg,
  'start': startSvg,
  'end': endSvg,
  'fork': forkSvg,
  'join': joinSvg,
  'merge': mergeSvg,
};

// função simples de fallback
export const getFallbackSvg = (elementType: string): string => {
  const color = '#374151';
  return `
    <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" fill="${color}20" stroke="${color}" stroke-width="2" rx="5"/>
      <text x="20" y="25" text-anchor="middle" font-family="Arial" font-size="12" fill="${color}">
        ${elementType.charAt(0).toUpperCase()}
      </text>
    </svg>
  `;
};