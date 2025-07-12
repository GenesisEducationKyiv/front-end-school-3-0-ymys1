import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';

interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export function Button({ variant = 'default', children, ...props }: ButtonProps) {
  const getMuiVariant = (): MuiButtonProps['variant'] => {
    switch (variant) {
      case 'default':
        return 'contained';
      case 'destructive':
        return 'contained';
      case 'outline':
        return 'outlined';
      case 'secondary':
        return 'contained';
      case 'ghost':
        return 'text';
      case 'link':
        return 'text';
      default:
        return 'contained';
    }
  };

  const getMuiColor = (): MuiButtonProps['color'] => {
    switch (variant) {
      case 'destructive':
        return 'error';
      case 'secondary':
        return 'secondary';
      default:
        return 'primary';
    }
  };

  return (
    <MuiButton
      variant={getMuiVariant()}
      color={getMuiColor()}
      {...props}
    >
      {children}
    </MuiButton>
  );
} 