/**
 * Form validation utilities for the app
 */

export interface ValidationRule {
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  required?: boolean;
  validate?: (value: unknown) => boolean | string;
  message?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Common validation patterns
 */
export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
  url: /^https?:\/\/.+/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, // 8+ chars, upper, lower, digit
  username: /^[a-zA-Z0-9_-]{3,20}$/,
  creditCard: /^[0-9]{13,19}$/,
  postalCode: /^[0-9]{5}(?:-[0-9]{4})?$/,
};

/**
 * Validate a single value against rules
 */
export function validate(value: unknown, rules: ValidationRule): ValidationResult {
  const errors: string[] = [];

  // Required check
  if (rules.required) {
    if (value === null || value === undefined || value === '') {
      errors.push(rules.message || 'This field is required');
      return { valid: false, errors };
    }
  } else if (!value) {
    // Skip other validations if not required and empty
    return { valid: true, errors: [] };
  }

  const stringValue = String(value);

  // Pattern check
  if (rules.pattern && !rules.pattern.test(stringValue)) {
    errors.push(rules.message || 'Invalid format');
  }

  // Length checks
  if (rules.minLength && stringValue.length < rules.minLength) {
    errors.push(rules.message || `Must be at least ${rules.minLength} characters`);
  }

  if (rules.maxLength && stringValue.length > rules.maxLength) {
    errors.push(rules.message || `Must be at most ${rules.maxLength} characters`);
  }

  // Numeric range checks
  if (typeof value === 'number') {
    if (rules.min !== undefined && value < rules.min) {
      errors.push(rules.message || `Must be at least ${rules.min}`);
    }

    if (rules.max !== undefined && value > rules.max) {
      errors.push(rules.message || `Must be at most ${rules.max}`);
    }
  }

  // Custom validation
  if (rules.validate) {
    const result = rules.validate(value);
    if (result !== true) {
      errors.push(typeof result === 'string' ? result : rules.message || 'Validation failed');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate multiple fields
 */
export function validateForm(
  data: Record<string, unknown>,
  schema: Record<string, ValidationRule>
): Record<string, ValidationResult> {
  const results: Record<string, ValidationResult> = {};

  for (const [field, rules] of Object.entries(schema)) {
    results[field] = validate(data[field], rules);
  }

  return results;
}

/**
 * Check if all fields are valid
 */
export function isFormValid(results: Record<string, ValidationResult>): boolean {
  return Object.values(results).every((result) => result.valid);
}

/**
 * Get first error for each field
 */
export function getFormErrors(results: Record<string, ValidationResult>): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const [field, result] of Object.entries(results)) {
    if (!result.valid && result.errors.length > 0) {
      errors[field] = result.errors[0];
    }
  }

  return errors;
}

/**
 * Common validators
 */
export const validators = {
  email: (value: unknown): boolean => {
    return patterns.email.test(String(value));
  },

  phone: (value: unknown): boolean => {
    return patterns.phone.test(String(value));
  },

  url: (value: unknown): boolean => {
    return patterns.url.test(String(value));
  },

  strongPassword: (value: unknown): boolean | string => {
    const str = String(value);
    if (str.length < 8) return 'Password must be at least 8 characters';
    if (!/[a-z]/.test(str)) return 'Password must contain lowercase letters';
    if (!/[A-Z]/.test(str)) return 'Password must contain uppercase letters';
    if (!/\d/.test(str)) return 'Password must contain numbers';
    return true;
  },

  username: (value: unknown): boolean => {
    return patterns.username.test(String(value));
  },

  creditCard: (value: unknown): boolean => {
    return patterns.creditCard.test(String(value).replace(/\s/g, ''));
  },

  fileSize: (maxSizeInMB: number) => {
    return (file: unknown): boolean => {
      if (!(file instanceof File)) return false;
      return file.size <= maxSizeInMB * 1024 * 1024;
    };
  },

  fileType: (allowedTypes: string[]) => {
    return (file: unknown): boolean => {
      if (!(file instanceof File)) return false;
      return allowedTypes.includes(file.type);
    };
  },

  match: (firstValue: unknown, secondValue: unknown): boolean => {
    return firstValue === secondValue;
  },
};
