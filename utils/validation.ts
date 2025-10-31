export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export const validateEmail = (email: string): string | null => {
  if (!email) {
    return "Email é obrigatório"
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return "Digite um email válido"
  }
  return null
}

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return "Senha é obrigatória"
  }
  if (password.length < 6) {
    return "A senha deve ter pelo menos 6 caracteres"
  }
  return null
}

export const validateName = (name: string): string | null => {
  if (!name) {
    return "Nome é obrigatório"
  }
  if (name.length < 2) {
    return "O nome deve ter pelo menos 2 caracteres"
  }
  return null
}

export const validateBeerName = (beerName: string): string | null => {
  if (!beerName) {
    return "Nome da cerveja é obrigatório"
  }
  if (beerName.length < 2) {
    return "O nome da cerveja deve ter pelo menos 2 caracteres"
  }
  return null
}

export const validatePlace = (place: string): string | null => {
  if (!place) {
    return "Local é obrigatório"
  }
  if (place.length < 2) {
    return "O local deve ter pelo menos 2 caracteres"
  }
  return null
}

export const validateRating = (rating: number): string | null => {
  if (rating < 1 || rating > 5) {
    return "A avaliação deve estar entre 1 e 5"
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
    errors.image = "Por favor, selecione uma imagem"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
