// ====================================================================
// Enterprise Password Security Policy
// ====================================================================
// Mandatory rules for new company onboarding and employee setup:
// 1. At least 8 characters
// 2. At least 1 capital letter (A-Z)
// 3. At least 1 number (0-9)
// 4. At least 1 symbol / special character (!@#$%^&*...)
// 5. Must differ from default initial password ('Admin@123' / 'admin123')

export const DEFAULT_INITIAL_PASSWORD = 'Admin@123';

export const checkPasswordCriteria = (password) => {
  const pass = password || '';
  return {
    minLength: pass.length >= 8,
    hasUpper: /[A-Z]/.test(pass),
    hasNumber: /[0-9]/.test(pass),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(pass),
    notDefault: pass.toLowerCase() !== 'admin@123' && pass.toLowerCase() !== 'admin123'
  };
};

export const validatePasswordPolicy = (password) => {
  const checks = checkPasswordCriteria(password);
  const isValid = checks.minLength && checks.hasUpper && checks.hasNumber && checks.hasSpecial && checks.notDefault;

  let errorMessage = '';
  if (!checks.minLength) {
    errorMessage = 'Password must be at least 8 characters long.';
  } else if (!checks.hasUpper) {
    errorMessage = 'Password must contain at least one capital letter (A-Z).';
  } else if (!checks.hasNumber) {
    errorMessage = 'Password must contain at least one number (0-9).';
  } else if (!checks.hasSpecial) {
    errorMessage = 'Password must contain at least one special symbol (@, #, $, %, etc.).';
  } else if (!checks.notDefault) {
    errorMessage = 'Please choose a new password different from the temporary default password (Admin@123).';
  }

  return { isValid, checks, errorMessage };
};
