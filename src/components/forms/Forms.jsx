// src/components/forms/Forms.jsx
import styles from "./Forms.module.css";

export function Form({ onSubmit, children, className = "" }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <form onSubmit={handleSubmit} className={`${styles.form} ${className}`}>
      {children}
    </form>
  );
}

export function FormField({
  label,
  children,
  required = false,
  htmlFor,
  className = "",
}) {
  return (
    <label htmlFor={htmlFor} className={`${styles.formField} ${className}`}>
      <span className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </span>
      {children}
    </label>
  );
}

export function FormActions({ children, className = "" }) {
  return <div className={`${styles.formActions} ${className}`}>{children}</div>;
}
