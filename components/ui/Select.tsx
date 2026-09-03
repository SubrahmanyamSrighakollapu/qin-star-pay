import React, { SelectHTMLAttributes, forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';
import { SelectOption } from '@/types/common';
import { FormField } from './FormField';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      placeholder = 'Select option...',
      error,
      helperText,
      disabled,
      required,
      className,
      containerClassName,
      id: customId,
      value,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = customId || generatedId;

    const selectElement = (
      <div className="relative flex items-center w-full">
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          required={required}
          value={value ?? ''}
          className={cn(
            'w-full h-[40px] pl-3.5 pr-9 bg-white text-sm text-[var(--text-primary)] border border-[var(--border)] rounded-[var(--radius-md)] appearance-none transition-colors focus:outline-hidden focus:border-[var(--border-focus)] focus:ring-1 focus:ring-[var(--border-focus)] disabled:bg-[var(--bg-secondary)] disabled:text-[var(--text-disabled)] disabled:cursor-not-allowed cursor-pointer',
            value === '' || value === undefined ? 'text-[var(--text-disabled)]' : '',
            error ? 'border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger)]' : '',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="absolute right-3 pointer-events-none text-[var(--text-muted)]">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    );

    if (label || error || helperText) {
      return (
        <FormField
          label={label}
          htmlFor={selectId}
          required={required}
          error={error}
          helperText={helperText}
          className={containerClassName}
        >
          {selectElement}
        </FormField>
      );
    }

    return selectElement;
  }
);

Select.displayName = 'Select';
