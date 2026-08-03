import * as React from 'react';
import { cn } from '@/shared/lib/utils';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'dark' | 'primary';
  container?: boolean;
}

function Section({
  className,
  variant = 'default',
  container = true,
  children,
  ...props
}: SectionProps) {
  const variantStyles = {
    default: '',
    dark: 'bg-slate-900/30 border-y border-slate-800',
    primary: 'bg-primary/5 border-y border-primary/10',
  };

  return (
    <section
      className={cn('py-16 md:py-20', variantStyles[variant], className)}
      {...props}
    >
      {container ? (
        <div className="max-w-7xl mx-auto px-6">{children}</div>
      ) : (
        children
      )}
    </section>
  );
}

export { Section };
