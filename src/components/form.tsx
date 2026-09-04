import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * One shared form language for the whole site: floating label, soft focus ring,
 * animated label lift. Used by auth, contact, reviews and booking forms.
 */

const CONTROL =
  "w-full bg-transparent px-4 pb-2 pt-6 text-[14px] text-foreground outline-none placeholder:text-muted-foreground/70";

export function FieldFrame({
  label,
  floated,
  error,
  hint,
  className,
  children,
}: {
  label: string;
  floated: boolean;
  error?: string | undefined;
  hint?: string | undefined;
  className?: string | undefined;
  children: ReactNode;
}) {
  return (
    <div className={cn("block", className)}>
      <div
        className={cn(
          "relative rounded-2xl border bg-background transition-all duration-300 ease-soft focus-within:bg-card focus-within:shadow-[0_0_0_4px_var(--ring)]",
          error
            ? "border-destructive"
            : "border-input hover:border-primary/50 focus-within:border-primary",
        )}
      >
        <span
          className={cn(
            "pointer-events-none absolute left-4 z-10 origin-left transition-all duration-300 ease-soft",
            floated
              ? "top-[7px] font-mono text-[10px] uppercase tracking-[0.14em] text-primary"
              : "top-[17px] text-[13px] text-muted-foreground",
          )}
        >
          {label}
        </span>
        {children}
      </div>
      {error ? (
        <span className="mt-1.5 block text-[12px] text-destructive">{error}</span>
      ) : hint ? (
        <span className="mt-1.5 block text-[12px] text-muted-foreground">{hint}</span>
      ) : null}
    </div>
  );
}

type BaseProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | undefined;
  hint?: string | undefined;
  className?: string | undefined;
  placeholder?: string;
};

export function TextField({
  label,
  value,
  onChange,
  error,
  hint,
  className,
  placeholder,
  type = "text",
  autoComplete,
  min,
  max,
}: BaseProps & {
  type?: string;
  autoComplete?: string;
  min?: number;
  max?: number;
}) {
  const [focused, setFocused] = useState(false);
  const alwaysFloat = type === "date" || type === "time";
  return (
    <FieldFrame
      label={label}
      floated={focused || value !== "" || alwaysFloat}
      error={error}
      hint={hint}
      className={className}
    >
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={focused ? (placeholder ?? "") : ""}
        {...(autoComplete ? { autoComplete } : {})}
        {...(min !== undefined ? { min } : {})}
        {...(max !== undefined ? { max } : {})}
        className={CONTROL}
      />
    </FieldFrame>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  error,
  hint,
  className,
  placeholder,
  rows = 4,
}: BaseProps & { rows?: number }) {
  const [focused, setFocused] = useState(false);
  return (
    <FieldFrame
      label={label}
      floated={focused || value !== ""}
      error={error}
      hint={hint}
      className={className}
    >
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={focused ? (placeholder ?? "") : ""}
        className={cn(CONTROL, "resize-none")}
      />
    </FieldFrame>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  error,
  hint,
  className,
  placeholder = "Choose an option",
}: BaseProps & { options: { value: string; label: string }[] }) {
  return (
    <FieldFrame label={label} floated error={error} hint={hint} className={className}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(CONTROL, "appearance-none cursor-pointer")}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
        ▾
      </span>
    </FieldFrame>
  );
}

export function SubmitButton({
  busy,
  children,
  className,
  type = "submit",
  onClick,
  disabled,
}: {
  busy?: boolean;
  children: ReactNode;
  className?: string | undefined;
  type?: "submit" | "button";
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      {...(onClick ? { onClick } : {})}
      disabled={busy || disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-all duration-300 ease-soft hover:brightness-105 active:scale-[0.98] disabled:opacity-60",
        className,
      )}
    >
      {busy ? "Please wait…" : children}
    </button>
  );
}
