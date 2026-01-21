// Input Component
import React, { forwardRef, useId } from 'react';
import styles from './Input.module.scss';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, helperText, required, className = '', id, ...props },
    ref
  ) => {
    const reactId = useId();
    const inputId = id || `input-${reactId}`;
    const hasError = Boolean(error);

    return (
      <div className={`${styles.field} ${hasError ? styles.error : ''}`}>
        {label && (
          <label
            htmlFor={inputId}
            className={`${styles.label} ${required ? styles.required : ''}`}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`${styles.input} ${className}`}
          aria-invalid={hasError}
          aria-describedby={
            hasError
              ? `${inputId}-error`
              : helperText
                ? `${inputId}-helper`
                : undefined
          }
          {...props}
        />
        {error && (
          <span
            id={`${inputId}-error`}
            className={styles.errorMessage}
            role="alert"
          >
            {error}
          </span>
        )}
        {!error && helperText && (
          <span id={`${inputId}-helper`} className={styles.helperText}>
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
