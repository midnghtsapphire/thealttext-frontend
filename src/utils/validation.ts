/**
 * Form validation utilities.
 */

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

export const validateRegistration = (data: {
  email: string
  password: string
  name: string
}): ValidationResult => {
  const errors: string[] = []

  // Email
  if (!data.email) {
    errors.push('Email is required')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email format')
  }

  // Password
  if (!data.password) {
    errors.push('Password is required')
  } else {
    if (data.password.length < 8) {
      errors.push('Password must be at least 8 characters')
    }
    if (!/[A-Z]/.test(data.password)) {
      errors.push('Password must contain an uppercase letter')
    }
    if (!/[a-z]/.test(data.password)) {
      errors.push('Password must contain a lowercase letter')
    }
    if (!/\d/.test(data.password)) {
      errors.push('Password must contain a number')
    }
  }

  // Name
  if (!data.name || data.name.length < 2) {
    errors.push('Name must be at least 2 characters')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

export const validateFileUpload = (file: File): ValidationResult => {
  const errors: string[] = []
  const maxSize = 10 * 1024 * 1024 // 10MB

  if (file.size > maxSize) {
    errors.push('File size must be less than 10MB')
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    errors.push('File type must be JPEG, PNG, GIF, or WebP')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
