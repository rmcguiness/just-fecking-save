import {
	MAX_NAME_LENGTH,
	MAX_EMAIL_LENGTH,
	MAX_SUBJECT_LENGTH,
	MAX_MESSAGE_LENGTH,
	MAX_FILE_SIZE,
	ALLOWED_FILE_TYPES,
	ALLOWED_FILE_EXTENSIONS,
} from './constants';

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email) && email.length <= MAX_EMAIL_LENGTH;
}

/**
 * Validates contact form input
 */
export interface ContactFormValidation {
	name: string;
	email: string;
	subject: string;
	message: string;
}

export interface ValidationResult {
	valid: boolean;
	errors: Partial<Record<keyof ContactFormValidation, string>>;
}

export function validateContactForm(
	data: ContactFormValidation
): ValidationResult {
	const errors: Partial<Record<keyof ContactFormValidation, string>> = {};

	// Validate name
	if (!data.name || data.name.trim().length === 0) {
		errors.name = 'Name is required';
	} else if (data.name.length > MAX_NAME_LENGTH) {
		errors.name = `Name must be less than ${MAX_NAME_LENGTH} characters`;
	}

	// Validate email
	if (!data.email || data.email.trim().length === 0) {
		errors.email = 'Email is required';
	} else if (!isValidEmail(data.email)) {
		errors.email = 'Please enter a valid email address';
	}

	// Validate subject
	if (!data.subject || data.subject.trim().length === 0) {
		errors.subject = 'Subject is required';
	} else if (data.subject.length > MAX_SUBJECT_LENGTH) {
		errors.subject = `Subject must be less than ${MAX_SUBJECT_LENGTH} characters`;
	}

	// Validate message
	if (!data.message || data.message.trim().length === 0) {
		errors.message = 'Message is required';
	} else if (data.message.length > MAX_MESSAGE_LENGTH) {
		errors.message = `Message must be less than ${MAX_MESSAGE_LENGTH} characters`;
	}

	return {
		valid: Object.keys(errors).length === 0,
		errors,
	};
}

/**
 * Sanitizes HTML to prevent XSS attacks
 */
export function sanitizeHtml(html: string): string {
	return html
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#x27;')
		.replace(/\//g, '&#x2F;');
}

/**
 * Validates file type and size
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
	// Check file size
	if (file.size > MAX_FILE_SIZE) {
		return {
			valid: false,
			error: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
		};
	}

	// Check file type
	const isValidType =
		ALLOWED_FILE_TYPES.includes(file.type) ||
		ALLOWED_FILE_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext));

	if (!isValidType) {
		return {
			valid: false,
			error: 'Only CSV and PDF files are allowed',
		};
	}

	return { valid: true };
}

