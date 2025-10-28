export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export const validateEmail = (email: string): string | null => {
  if (!email) {
    return "Email is required"
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address"
  }
  return null
}

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return "Password is required"
  }
  if (password.length < 6) {
    return "Password must be at least 6 characters"
  }
  return null
}

export const validateName = (name: string): string | null => {
  if (!name) {
    return "Name is required"
  }
  if (name.length < 2) {
    return "Name must be at least 2 characters"
  }
  return null
}

export const validateBeerName = (beerName: string): string | null => {
  if (!beerName) {
    return "Beer name is required"
  }
  if (beerName.length < 2) {
    return "Beer name must be at least 2 characters"
  }
  return null
}

export const validatePlace = (place: string): string | null => {
  if (!place) {
    return "Place is required"
  }
  if (place.length < 2) {
    return "Place must be at least 2 characters"
  }
  return null
}

export const validateRating = (rating: number): string | null => {
  if (rating < 1 || rating > 5) {
    return "Rating must be between 1 and 5"
  }
  return null
}

export const validateLoginForm = (email: string, password: string): ValidationResult => {
  const errors: Record<string, string> = {}

  const emailError = validateEmail(email)
  if (emailError) errors.email = emailError

  const passwordError = validatePassword(password)
  if (passwordError) errors.password = passwordError

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export const validateRegisterForm = (name: string, email: string, password: string): ValidationResult => {
  const errors: Record<string, string> = {}

  const nameError = validateName(name)
  if (nameError) errors.name = nameError

  const emailError = validateEmail(email)
  if (emailError) errors.email = emailError

  const passwordError = validatePassword(password)
  if (passwordError) errors.password = passwordError

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export const validateBeerPostForm = (
  beerName: string,
  place: string,
  rating: number,
  imageUri?: string,
): ValidationResult => {
  const errors: Record<string, string> = {}

  const beerNameError = validateBeerName(beerName)
  if (beerNameError) errors.beerName = beerNameError

  const placeError = validatePlace(place)
  if (placeError) errors.place = placeError

  const ratingError = validateRating(rating)
  if (ratingError) errors.rating = ratingError

  if (!imageUri) {
    errors.image = "Please select an image"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
