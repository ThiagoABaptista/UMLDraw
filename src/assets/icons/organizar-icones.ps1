# organizar-icones.ps1
Set-Location src/assets/icons

Write-Host "Organizando ícones do Gaphor..." -ForegroundColor Green

# Função para mover arquivos com verificação
function Move-Icon {
    param($arquivos, $pasta)
    
    foreach ($arquivo in $arquivos) {
        if (Test-Path $arquivo) {
            Move-Item $arquivo $pasta -Force
            Write-Host "Movido: $arquivo -> $pasta" -ForegroundColor Yellow
        } else {
            Write-Warning "Arquivo não encontrado: $arquivo"
        }
    }
}

# Mover para cada pasta
Move-Icon @("gaphor-send-signal-action-symbolic.svg") "gaphor/actions"
Move-Icon @("gaphor-accept-event-action-symbolic.svg", "gaphor-action-symbolic.svg", "gaphor-activity-final-node-symbolic.svg", "gaphor-activity-partition-symbolic.svg", "gaphor-activity-symbolic.svg", "gaphor-decision-node-symbolic.svg", "gaphor-flow-final-node-symbolic.svg", "gaphor-fork-node-symbolic.svg", "gaphor-initial-node-symbolic.svg", "gaphor-join-node-symbolic.svg", "gaphor-object-node-symbolic.svg") "gaphor/activities"
Move-Icon @("gaphor-c4-component-symbolic.svg", "gaphor-c4-container-symbolic.svg", "gaphor-c4-database-symbolic.svg", "gaphor-c4-person-symbolic.svg", "gaphor-c4-software-system-symbolic.svg") "gaphor/c4"
Move-Icon @("gaphor-actuator-symbolic.svg", "gaphor-artifact-symbolic.svg", "gaphor-block-symbolic.svg", "gaphor-box-symbolic.svg", "gaphor-connector-symbolic.svg", "gaphor-controller-symbolic.svg", "gaphor-data-type-symbolic.svg", "gaphor-device-symbolic.svg", "gaphor-enumeration-symbolic.svg", "gaphor-metaclass-symbolic.svg", "gaphor-node-symbolic.svg", "gaphor-primitive-symbolic.svg", "gaphor-profile-symbolic.svg", "gaphor-property-symbolic.svg", "gaphor-proxyport-symbolic.svg", "gaphor-requirement-symbolic.svg", "gaphor-stereotype-symbolic.svg", "gaphor-value-type-symbolic.svg") "gaphor/components"
Move-Icon @("gaphor-diagram-symbolic.svg", "gaphor-new-diagram-symbolic.svg", "gaphor-pointer-symbolic.svg", "gaphor-view-editor-symbolic.svg") "gaphor/diagrams"
Move-Icon @("gaphor-basic-event-symbolic.svg", "gaphor-conditional-event-symbolic.svg", "gaphor-dormant-event-symbolic.svg", "gaphor-house-event-symbolic.svg", "gaphor-intermediate-event-symbolic.svg", "gaphor-top-event-symbolic.svg", "gaphor-undeveloped-event-symbolic.svg", "gaphor-zero-event-symbolic.svg") "gaphor/events"
Move-Icon @("gaphor-control-flow-symbolic.svg", "gaphor-information-flow-symbolic.svg") "gaphor/flows"
Move-Icon @("gaphor-and-symbolic.svg", "gaphor-inhibit-symbolic.svg", "gaphor-majority_vote-symbolic.svg", "gaphor-not-symbolic.svg", "gaphor-or-symbolic.svg", "gaphor-seq-symbolic.svg", "gaphor-xor-symbolic.svg") "gaphor/logic"
Move-Icon @("gaphor-composite-association-symbolic.svg", "gaphor-containment-symbolic.svg", "gaphor-derive-symbolic.svg", "gaphor-extend-symbolic.svg", "gaphor-include-symbolic.svg", "gaphor-interface-realization-symbolic.svg", "gaphor-realization-symbolic.svg", "gaphor-refine-symbolic.svg", "gaphor-relevant-to-symbolic.svg", "gaphor-satisfy-symbolic.svg", "gaphor-shared-association-symbolic.svg", "gaphor-trace-symbolic.svg", "gaphor-usage-symbolic.svg", "gaphor-verify-symbolic.svg") "gaphor/relationships"
Move-Icon @("gaphor-abstract-operational-situation-symbolic.svg", "gaphor-control-action-symbolic.svg", "gaphor-control-structure-symbolic.svg", "gaphor-controlled-process-symbolic.svg", "gaphor-hazard-symbolic.svg", "gaphor-loss-symbolic.svg", "gaphor-operational-situation-symbolic.svg", "gaphor-situation-symbolic.svg", "gaphor-unsafe-control-action-symbolic.svg") "gaphor/safety"
Move-Icon @("gaphor-behavior-execution-specification-symbolic.svg", "gaphor-execution-specification-symbolic.svg", "gaphor-interaction-symbolic.svg", "gaphor-lifeline-symbolic.svg", "gaphor-message-symbolic.svg", "gaphor-reflexive-message-symbolic.svg") "gaphor/sequences"
Move-Icon @("gaphor-comment-line-symbolic.svg", "gaphor-comment-symbolic.svg", "gaphor-ellipse-symbolic.svg", "gaphor-line-symbolic.svg", "gaphor-region-symbolic.svg") "gaphor/shapes"
Move-Icon @("gaphor-final-state-symbolic.svg", "gaphor-initial-pseudostate-symbolic.svg", "gaphor-pseudostate-symbolic.svg", "gaphor-state-machine-symbolic.svg", "gaphor-state-symbolic.svg", "gaphor-transition-symbolic.svg") "gaphor/states"
Move-Icon @("gaphor-transfer-in-symbolic.svg", "gaphor-transfer-out-symbolic.svg") "gaphor/transfers"
Move-Icon @("gaphor-actor-symbolic.svg", "gaphor-association-symbolic.svg", "gaphor-class-symbolic.svg", "gaphor-component-symbolic.svg", "gaphor-constraint-symbolic.svg", "gaphor-dependency-symbolic.svg", "gaphor-generalization-symbolic.svg", "gaphor-import-symbolic.svg", "gaphor-interface-symbolic.svg", "gaphor-package-symbolic.svg", "gaphor-use-case-symbolic.svg") "gaphor/uml"

# Verificar se sobrou algum arquivo
$sobrando = Get-ChildItem -File | Where-Object { $_.Name -like "gaphor-*" }
if ($sobrando.Count -eq 0) {
    Write-Host "✅ Todos os arquivos foram organizados com sucesso!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Arquivos não movidos:" -ForegroundColor Red
    $sobrando | ForEach-Object { Write-Host "   - $($_.Name)" -ForegroundColor Red }
}

Write-Host "Organização concluída!" -ForegroundColor Green