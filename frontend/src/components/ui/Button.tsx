import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'success';
    size?: 'sm' | 'md' | 'lg';
    children: ReactNode;
    isLoading?: boolean;
}

export function Button({
    variant = 'primary',
    size = 'md',
    children,
    isLoading = false,
    disabled,
    style,
    ...props
}: ButtonProps) {

    const sizeStyles = {
        sm: { padding: '8px 16px', fontSize: '14px' },
        md: { padding: '10px 20px', fontSize: '14px' },
        lg: { padding: '14px 28px', fontSize: '16px' },
    };

    const getVariantStyles = () => {
        switch (variant) {
            case 'primary':
                return {
                    backgroundColor: 'var(--color-primary)',
                    color: '#ffffff',
                    border: 'none'
                };
            case 'secondary':
                return {
                    backgroundColor: 'var(--color-bg-tertiary)',
                    color: 'var(--color-text-primary)',
                    border: 'none'
                };
            case 'danger':
                return {
                    backgroundColor: 'var(--color-error)',
                    color: '#ffffff',
                    border: 'none'
                };
            case 'success':
                return {
                    backgroundColor: 'var(--color-success)',
                    color: '#ffffff',
                    border: 'none'
                };
            case 'ghost':
                return {
                    backgroundColor: 'transparent',
                    color: 'var(--color-text-secondary)',
                    border: 'none'
                };
            case 'outline':
                return {
                    backgroundColor: 'transparent',
                    color: 'var(--color-primary)',
                    border: '1px solid var(--color-primary)'
                };
            default:
                return {};
        }
    };

    return (
        <button
            disabled={disabled || isLoading}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                borderRadius: '8px',
                fontWeight: 500,
                cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
                opacity: disabled || isLoading ? 0.5 : 1,
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                ...sizeStyles[size],
                ...getVariantStyles(),
                ...style
            }}
            {...props}
        >
            {isLoading && (
                <div
                    style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid currentColor',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}
                />
            )}
            {children}
        </button>
    );
}
