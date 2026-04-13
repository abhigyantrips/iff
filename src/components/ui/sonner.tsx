'use client';

import {
  CheckCircleIcon,
  InfoIcon,
  SpinnerIcon,
  WarningIcon,
  XCircleIcon,
} from '@phosphor-icons/react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      icons={{
        success: <CheckCircleIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <WarningIcon className="size-4" />,
        error: <XCircleIcon className="size-4" />,
        loading: <SpinnerIcon className="size-4 animate-spin" />,
      }}
      style={
        {
          '--normal-bg': 'var(--toast-default-bg)',
          '--normal-text': 'var(--toast-default-text)',
          '--normal-border': 'var(--toast-default-border)',
          '--border-radius': '0px',
          '--success-bg': 'var(--toast-success-bg)',
          '--success-text': 'var(--toast-success-text)',
          '--success-border': 'var(--toast-success-border)',
          '--error-bg': 'var(--toast-error-bg)',
          '--error-text': 'var(--toast-error-text)',
          '--error-border': 'var(--toast-error-border)',
          '--warning-bg': 'var(--toast-warning-bg)',
          '--warning-text': 'var(--toast-warning-text)',
          '--warning-border': 'var(--toast-warning-border)',
          '--info-bg': 'var(--toast-info-bg)',
          '--info-text': 'var(--toast-info-text)',
          '--info-border': 'var(--toast-info-border)',
        } as React.CSSProperties
      }
      position="top-center"
      toastOptions={{
        classNames: {
          toast: 'cn-toast',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
