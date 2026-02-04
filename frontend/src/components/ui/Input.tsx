import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, style, ...props }, ref) => {
        return (
            <div style={{ width: '100%' }}>
                {label && (
                    <label
                        style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: 500,
                            color: 'var(--color-text-primary)',
                            marginBottom: '6px'
                        }}
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    style={{
                        width: '100%',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        border: error ? '1px solid var(--color-error)' : '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-bg-secondary)',
                        color: 'var(--color-text-primary)',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'all 0.2s ease',
                        ...style
                    }}
                    {...props}
                />
                {error && (
                    <p style={{ marginTop: '6px', fontSize: '14px', color: 'var(--color-error)' }}>{error}</p>
                )}
                {helperText && !error && (
                    <p style={{ marginTop: '6px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

export function Select({ label, error, options, style, ...props }: SelectProps) {
    return (
        <div style={{ width: '100%' }}>
            {label && (
                <label
                    style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: 500,
                        color: 'var(--color-text-primary)',
                        marginBottom: '6px'
                    }}
                >
                    {label}
                </label>
            )}
            <select
                style={{
                    width: '100%',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: error ? '1px solid var(--color-error)' : '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-bg-secondary)',
                    color: 'var(--color-text-primary)',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                    ...style
                }}
                {...(props as any)}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p style={{ marginTop: '6px', fontSize: '14px', color: 'var(--color-error)' }}>{error}</p>
            )}
        </div>
    );
}

interface TextareaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    rows?: number;
}

export function Textarea({ label, error, rows = 4, style, ...props }: TextareaProps) {
    return (
        <div style={{ width: '100%' }}>
            {label && (
                <label
                    style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: 500,
                        color: 'var(--color-text-primary)',
                        marginBottom: '6px'
                    }}
                >
                    {label}
                </label>
            )}
            <textarea
                rows={rows}
                style={{
                    width: '100%',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: error ? '1px solid var(--color-error)' : '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-bg-secondary)',
                    color: 'var(--color-text-primary)',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    resize: 'none',
                    ...style
                }}
                {...(props as any)}
            />
            {error && (
                <p style={{ marginTop: '6px', fontSize: '14px', color: 'var(--color-error)' }}>{error}</p>
            )}
        </div>
    );
}
