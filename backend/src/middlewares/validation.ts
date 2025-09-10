// backend/src/middlewares/validation.ts
import { body, param, query, validationResult, ValidationChain } from 'express-validator';
import type { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST } from '@/constants/http';
import { AppError } from '@/utils/appError';

// Generic validation error handler using AppError
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorDetails = errors.array().map(error => ({
            field: error.type === 'field' ? error.path : 'unknown',
            message: error.msg,
            value: (error as any).value || undefined,
            location: (error as any).location || undefined
        }));

        // Create detailed error message
        const errorMessage = `Validation failed: ${errorDetails.map(e => `${e.field}: ${e.message}`).join(', ')}`;

        // Throw AppError with validation details
        throw new AppError(errorMessage, BAD_REQUEST, 'VALIDATION_ERROR');
    }
    return next();
};


// Register validation
export const validateRegister = [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('fname').isString().notEmpty().withMessage('fname is required'),
    body('lname').isString().notEmpty().withMessage('lname is required'),
    handleValidationErrors
];

// Login validation
export const validateLogin = [
    body('email').isEmail().withMessage('Valid email required'),
    body('password')
        .isString()
        .withMessage('Password must be a string')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters'),
    handleValidationErrors
];

// Generic validation function for custom schemas
export const validate = (validations: ValidationChain[]) => {
    return [
        ...validations,
        handleValidationErrors
    ];
};

// Additional validation helpers
export const validateId = (fieldName: string = 'id') => [
    param(fieldName)
        .isInt({ min: 1 })
        .withMessage(`${fieldName} must be a positive integer`)
        .toInt(),
    handleValidationErrors
];

// Query parameter validation
export const validatePagination = () => [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer')
        .toInt(),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100')
        .toInt(),
    handleValidationErrors
];

// Search validation
export const validateSearch = () => [
    query('q')
        .optional()
        .isString()
        .withMessage('Search query must be a string')
        .isLength({ min: 1, max: 100 })
        .withMessage('Search query must be between 1 and 100 characters')
        .trim(),
    handleValidationErrors
];

export const validateCustomField = (fieldName: string, rules: ValidationChain[]) => [
    ...rules.map(rule => rule.withMessage(`${fieldName}: ${rule}`)),
    handleValidationErrors
];

export const sanitizeInput = [
    body('*').trim().escape(),
    query('*').trim().escape(),
    (req: Request, res: Response, next: NextFunction) => {
        next();
    }
];