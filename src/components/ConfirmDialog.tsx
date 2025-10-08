import React from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title = 'Confirmação',
  message,
  confirmLabel = 'Sim',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel
}) => {
  if (!open) return null;

  return (
    <div style={overlayStyle}>
      <div style={dialogStyle}>
        <h3 style={{ margin: '0 0 8px 0' }}>{title}</h3>
        <p style={{ margin: '0 0 16px 0' }}>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onCancel} style={btnSecondaryStyle}>{cancelLabel}</button>
          <button onClick={onConfirm} style={btnPrimaryStyle}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
};

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.35)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2000
};

const dialogStyle: React.CSSProperties = {
  width: 420,
  background: '#fff',
  borderRadius: 8,
  padding: 20,
  boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
  color: '#111827'
};

const btnPrimaryStyle: React.CSSProperties = {
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  padding: '8px 12px',
  borderRadius: 6,
  cursor: 'pointer'
};

const btnSecondaryStyle: React.CSSProperties = {
  background: '#f3f4f6',
  color: '#111827',
  border: 'none',
  padding: '8px 12px',
  borderRadius: 6,
  cursor: 'pointer'
};
