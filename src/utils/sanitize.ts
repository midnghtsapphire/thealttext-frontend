/**
 * Input sanitization utilities to prevent XSS/injection attacks.
 */

// Sanitize text input
export const sanitizeText = (input: string): string => {
  if (!input) return ''
  
  return input
    .replace(/[<>"']/g, '') // Remove dangerous characters
    .replace(/\s+/g, ' ')   // Normalize whitespace
    .trim()
}

// Validate email format
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// Validate filename (no path traversal)
export const validateFilename = (filename: string): boolean => {
  // No path separators, no special chars
  return /^[a-zA-Z0-9_.-]+$/.test(filename)
}

// Validate image type
export const validateImageType = (type: string): boolean => {
  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  return allowed.includes(type)
}

// Sanitize for React (though React auto-escapes)
export const sanitizeForReact = (input: string): string => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// Escape HTML entities
export const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
