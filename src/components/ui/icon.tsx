import * as React from 'react';
import { cn } from '@/shared/lib/utils';

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'filled' | 'outlined';
}

const sizeMap = {
  sm: 'text-sm',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-3xl',
  '2xl': 'text-4xl',
};

// Fallback emoji mapping for common icons
const iconFallbacks: Record<string, string> = {
  person: '👤',
  person_add: '👥',
  group: '👥',
  verified: '✅',
  filter_list: '🔽',
  rocket_launch: '🚀',
  check_circle: '✅',
};

function Icon({
  name,
  size = 'md',
  variant = 'outlined',
  className,
  ...props
}: IconProps) {
  const [fontLoaded, setFontLoaded] = React.useState(true);

  React.useEffect(() => {
    // Check if Material Symbols font is loaded
    const checkFont = () => {
      if (document.fonts) {
        document.fonts.ready.then(() => {
          const loaded = document.fonts.check(
            '24px "Material Symbols Outlined"',
          );
          setFontLoaded(loaded);
        });
      }
    };

    checkFont();
  }, []);

  // If font failed to load, use emoji fallback
  if (!fontLoaded && iconFallbacks[name]) {
    return (
      <span className={cn(sizeMap[size], className)} {...props}>
        {iconFallbacks[name]}
      </span>
    );
  }

  return (
    <span
      className={cn(
        'material-symbols-outlined select-none',
        sizeMap[size],
        variant === 'filled' && 'fill-1',
        className,
      )}
      style={{
        fontVariationSettings:
          variant === 'filled'
            ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
            : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
      }}
      {...props}
    >
      {name}
    </span>
  );
}

export { Icon };
