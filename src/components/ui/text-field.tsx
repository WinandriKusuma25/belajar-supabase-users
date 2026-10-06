"use client";

import * as React from "react";
import { X } from "@phosphor-icons/react";
import { cn } from "cn";

export interface TextFieldProps
  extends Omit<React.ComponentProps<"input">, "size"> {
  label: string;
  helperText?: string;
  error?: string;
  clearable?: boolean;
  onClear?: () => void;
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      helperText,
      error,
      clearable,
      onClear,
      className,
      disabled,
      value,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const hasValue = value !== undefined && value !== "";
    const showClear = clearable && hasValue && !disabled;

    return (
      <div className="flex flex-col gap-1.5">
        <div
          className={cn(
            "group relative rounded-lg border bg-transparent transition-colors",
            "border-input focus-within:border-primary hover:border-foreground/40",
            error && "border-destructive hover:border-destructive",
            disabled && "border-input/50 hover:border-input/50 bg-muted/30"
          )}
        >
          <label
            htmlFor={inputId}
            className={cn(
              "absolute -top-2 left-2.5 bg-background px-1 text-xs text-muted-foreground",
              "group-focus-within:text-primary",
              error && "text-destructive",
              disabled && "text-muted-foreground/50"
            )}
          >
            {label}
          </label>

          <input
            ref={ref}
            id={inputId}
            value={value}
            disabled={disabled}
            className={cn(
              "h-11 w-full rounded-lg bg-transparent px-3 pr-9 text-sm outline-none",
              "placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            {...props}
          />

          {showClear && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={`Clear ${label}`}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {error ? (
          <p className="text-xs text-destructive">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
TextField.displayName = "TextField";

export { TextField };
