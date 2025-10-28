import {
  validateEmail,
  validatePassword,
  validateName,
  validateBeerName,
  validatePlace,
  validateRating,
  validateLoginForm,
  validateRegisterForm,
  validateBeerPostForm,
} from '@/utils/validation';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('returns error for empty email', () => {
      expect(validateEmail('')).toBe('Email is required');
    });

    it('returns error for invalid email format', () => {
      expect(validateEmail('invalid')).toBe(
        'Please enter a valid email address'
      );
      expect(validateEmail('test@')).toBe('Please enter a valid email address');
      expect(validateEmail('@test.com')).toBe(
        'Please enter a valid email address'
      );
    });

    it('returns null for valid email', () => {
      expect(validateEmail('test@example.com')).toBeNull();
      expect(validateEmail('user.name+tag@example.co.uk')).toBeNull();
    });
  });

  describe('validatePassword', () => {
    it('returns error for empty password', () => {
      expect(validatePassword('')).toBe('Password is required');
    });

    it('returns error for short password', () => {
      expect(validatePassword('12345')).toBe(
        'Password must be at least 6 characters'
      );
    });

    it('returns null for valid password', () => {
      expect(validatePassword('123456')).toBeNull();
      expect(validatePassword('securePassword123')).toBeNull();
    });
  });

  describe('validateName', () => {
    it('returns error for empty name', () => {
      expect(validateName('')).toBe('Name is required');
    });

    it('returns error for short name', () => {
      expect(validateName('A')).toBe('Name must be at least 2 characters');
    });

    it('returns null for valid name', () => {
      expect(validateName('John')).toBeNull();
      expect(validateName('John Doe')).toBeNull();
    });
  });

  describe('validateBeerName', () => {
    it('returns error for empty beer name', () => {
      expect(validateBeerName('')).toBe('Beer name is required');
    });

    it('returns error for short beer name', () => {
      expect(validateBeerName('A')).toBe(
        'Beer name must be at least 2 characters'
      );
    });

    it('returns null for valid beer name', () => {
      expect(validateBeerName('IPA')).toBeNull();
      expect(validateBeerName('Hazy IPA')).toBeNull();
    });
  });

  describe('validatePlace', () => {
    it('returns error for empty place', () => {
      expect(validatePlace('')).toBe('Place is required');
    });

    it('returns error for short place', () => {
      expect(validatePlace('A')).toBe('Place must be at least 2 characters');
    });

    it('returns null for valid place', () => {
      expect(validatePlace('Bar')).toBeNull();
      expect(validatePlace('Local Brewery')).toBeNull();
    });
  });

  describe('validateRating', () => {
    it('returns error for rating below 1', () => {
      expect(validateRating(0)).toBe('Rating must be between 1 and 5');
      expect(validateRating(-1)).toBe('Rating must be between 1 and 5');
    });

    it('returns error for rating above 5', () => {
      expect(validateRating(6)).toBe('Rating must be between 1 and 5');
    });

    it('returns null for valid rating', () => {
      expect(validateRating(1)).toBeNull();
      expect(validateRating(3)).toBeNull();
      expect(validateRating(5)).toBeNull();
    });
  });

  describe('validateLoginForm', () => {
    it('returns errors for invalid inputs', () => {
      const result = validateLoginForm('', '');
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBeDefined();
      expect(result.errors.password).toBeDefined();
    });

    it('returns valid for correct inputs', () => {
      const result = validateLoginForm('test@example.com', 'password123');
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });
  });

  describe('validateRegisterForm', () => {
    it('returns errors for invalid inputs', () => {
      const result = validateRegisterForm('', '', '');
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBeDefined();
      expect(result.errors.email).toBeDefined();
      expect(result.errors.password).toBeDefined();
    });

    it('returns valid for correct inputs', () => {
      const result = validateRegisterForm(
        'John Doe',
        'test@example.com',
        'password123'
      );
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });
  });

  describe('validateBeerPostForm', () => {
    it('returns errors for invalid inputs', () => {
      const result = validateBeerPostForm('', '', 0);
      expect(result.isValid).toBe(false);
      expect(result.errors.beerName).toBeDefined();
      expect(result.errors.place).toBeDefined();
      expect(result.errors.rating).toBeDefined();
      expect(result.errors.image).toBeDefined();
    });

    it('returns valid for correct inputs', () => {
      const result = validateBeerPostForm('IPA', 'Local Bar', 4, 'image-uri');
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });
  });
});
