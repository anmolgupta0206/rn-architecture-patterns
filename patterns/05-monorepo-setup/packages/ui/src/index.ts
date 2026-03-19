/**
 * @myapp/ui — Shared UI component stubs.
 *
 * In a real monorepo this would export cross-platform components.
 * For React Native: export RN primitives
 * For Web: export React DOM equivalents
 *
 * These are stubs — implement the actual components for your design system.
 */

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
}

export interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
}

export interface AvatarProps {
  uri?: string;
  displayName: string;
  size?: number;
}

// Export component implementations from platform-specific files.
// In your own monorepo, implement these for your platform:
//
// React Native:  export { Button } from './Button.native'
// Web (React):   export { Button } from './Button.web'
//
// For now these are type-only exports — implement the components
// in your platform-specific packages.
