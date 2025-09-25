// src/utils/iconMapping.ts
import { ActivityElement, UseCaseElement } from '../types/umlTypes';

import actorSvg from '../assets/icons/gaphor/uml/gaphor-actor-symbolic.svg';
import usecaseSvg from '../assets/icons/gaphor/uml/gaphor-use-case-symbolic.svg';
import systemSvg from '../assets/icons/gaphor/c4/gaphor-c4-software-system-symbolic.svg';

export type ElementType = UseCaseElement['type'] | ActivityElement['type'];


export const umlSvgContent: Record<string, string> = {
  'actor': actorSvg,
  'usecase': usecaseSvg,
  'system': systemSvg,
  // ...outros elementos...
};
// Importações diretas dos SVGs usando require com caminho completo
const loadSvg = (path: string): string => {
  try {
    // Tenta carregar o SVG usando require
    const svgContent = require(`@/assets/icons/gaphor/${path}`);
    return svgContent;
  } catch (error) {
    console.warn(`Failed to load SVG: ${path}`, error);
    return getFallbackSvg(path.split('/').pop()?.replace('.svg', '') || 'unknown');
  }
};

// Mapeamento dos caminhos dos SVGs
export const umlSvgPaths: Record<string, string> = {
  'actor': 'uml/gaphor-actor-symbolic.svg',
  'usecase': 'uml/gaphor-use-case-symbolic.svg',
  'system': 'c4/gaphor-c4-software-system-symbolic.svg',
  'activity': 'activities/gaphor-action-symbolic.svg',
  'decision': 'activities/gaphor-decision-node-symbolic.svg',
  'start': 'activities/gaphor-initial-node-symbolic.svg',
  'end': 'activities/gaphor-activity-final-node-symbolic.svg',
  'fork': 'activities/gaphor-fork-node-symbolic.svg',
  'join': 'activities/gaphor-join-node-symbolic.svg',
  'merge': 'states/gaphor-pseudostate-symbolic.svg',
};

// Cache para SVGs carregados
const svgCache = new Map<string, string>();

export const getSvgContent = (elementType: string): string => {
  const path = umlSvgPaths[elementType];
  if (!path) {
    console.warn(`No SVG path defined for element type: ${elementType}`);
    return getFallbackSvg(elementType);
  }

  // Verifica se já está no cache
  if (svgCache.has(path)) {
    return svgCache.get(path)!;
  }

  try {
    const svgContent = loadSvg(path);
    svgCache.set(path, svgContent);
    return svgContent;
  } catch (error) {
    console.error(`Error loading SVG for ${elementType}:`, error);
    const fallbackSvg = getFallbackSvg(elementType);
    svgCache.set(path, fallbackSvg);
    return fallbackSvg;
  }
};

// SVG fallback simples
const getFallbackSvg = (elementType: string): string => {
  const color = getElementColor(elementType);
  const size = 40;
  return `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="${color}11" stroke="${color}" stroke-width="2" rx="5"/>
      <text x="${size/2}" y="${size/2 + 5}" text-anchor="middle" font-family="Arial" font-size="12" fill="${color}">
        ${elementType.charAt(0).toUpperCase()}
      </text>
    </svg>
  `;
};

const getElementColor = (elementType: string): string => {
  const colors: Record<string, string> = {
    'actor': '#4f46e5',
    'usecase': '#10b981',
    'system': '#6b7280',
    'activity': '#3b82f6',
    'decision': '#f59e0b',
    'start': '#22c55e',
    'end': '#ef4444',
    'fork': '#f97316',
    'join': '#06b6d4',
    'merge': '#8b5cf6'
  };
  return colors[elementType] || '#374151';
};