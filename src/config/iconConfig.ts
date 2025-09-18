export const iconConfig = {
  basePath: 'assets/icons/gaphor',
  
  // Mapeamento de tipos para caminhos de ícones
  elementIcons: {
    // Diagrama de Caso de Uso
    actor: 'uml/actor-symbolic.svg',
    usecase: 'uml/use-case-symbolic.svg',
    system: 'components/box-symbolic.svg',
    
    // Diagrama de Atividades
    activity: 'activities/activity-symbolic.svg',
    decision: 'activities/decision-node-symbolic.svg',
    start: 'activities/initial-node-symbolic.svg',
    end: 'activities/activity-final-node-symbolic.svg',
    fork: 'activities/fork-node-symbolic.svg',
    join: 'activities/join-node-symbolic.svg',
    merge: 'logic/or-symbolic.svg',
    
    // Relacionamentos
    association: 'uml/association-symbolic.svg',
    inheritance: 'uml/generalization-symbolic.svg',
    composition: 'relationships/composite-association-symbolic.svg',
    aggregation: 'relationships/shared-association-symbolic.svg',
    dependency: 'uml/dependency-symbolic.svg',
    include: 'relationships/include-symbolic.svg',
    extend: 'relationships/extension-symbolic.svg',
    flow: 'flows/control-flow-symbolic.svg'
  },

  // Ícones da toolbar
  toolbarIcons: {
    select: 'diagrams/pointer-symbolic.svg',
    actor: 'uml/actor-symbolic.svg',
    usecase: 'uml/use-case-symbolic.svg',
    activity: 'activities/activity-symbolic.svg',
    decision: 'activities/decision-node-symbolic.svg',
    relationship: 'uml/association-symbolic.svg',
    save: 'actions/send-signal-action-symbolic.svg',
    load: 'diagrams/new-diagram-symbolic.svg',
    export: 'diagrams/view-editor-symbolic.svg'
  }
};

// Função helper para obter caminho completo do ícone
export const getIconPath = (category: keyof typeof iconConfig.elementIcons, iconName?: string): string => {
  if (iconName && iconConfig.elementIcons[iconName as keyof typeof iconConfig.elementIcons]) {
    return `${iconConfig.basePath}/${iconConfig.elementIcons[iconName as keyof typeof iconConfig.elementIcons]}`;
  }
  return `${iconConfig.basePath}/components/box-symbolic.svg`; // Ícone padrão
};

// Função para ícones da toolbar
export const getToolbarIconPath = (toolName: keyof typeof iconConfig.toolbarIcons): string => {
  return `${iconConfig.basePath}/${iconConfig.toolbarIcons[toolName]}`;
};