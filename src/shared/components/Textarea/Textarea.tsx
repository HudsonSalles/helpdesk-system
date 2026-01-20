// Textarea Component
import React, { forwardRef } from 'react';
import styles from '../Input/Input.module.scss';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { label, error, helperText, required, className = '', id, ...props },
    ref
  ) => {
    const textareaId =
      id || `textarea-${Math.random().toString(36).substring(7)}`;
    const hasError = Boolean(error);

    return (
      <div className={`${styles.field} ${hasError ? styles.error : ''}`}>
        {label && (
          <label
            htmlFor={textareaId}
            className={`${styles.label} ${required ? styles.required : ''}`}
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`${styles.textarea} ${className}`}
          aria-invalid={hasError}
          aria-describedby={
            hasError
              ? `${textareaId}-error`
              : helperText
                ? `${textareaId}-helper`
                : undefined
          }
          {...props}
        />
        {error && (
          <span
            id={`${textareaId}-error`}
            className={styles.errorMessage}
            role="alert"
          >
            {error}
          </span>
        )}
        {!error && helperText && (
          <span id={`${textareaId}-helper`} className={styles.helperText}>
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
