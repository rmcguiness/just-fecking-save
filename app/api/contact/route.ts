import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { validateContactForm, sanitizeHtml } from '@/utils/validation';

const resend = new Resend(process.env.RESEND_API_KEY);
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'mcgconsulting123@gmail.com';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { name, email, subject, message } = body;

		// Validate input
		const validation = validateContactForm({ name, email, subject, message });
		if (!validation.valid) {
			return NextResponse.json(
				{ error: 'Validation failed', errors: validation.errors },
				{ status: 400 }
			);
		}

		// Sanitize all user input to prevent XSS
		const sanitizedName = sanitizeHtml(name.trim());
		const sanitizedEmail = sanitizeHtml(email.trim());
		const sanitizedSubject = sanitizeHtml(subject.trim());
		const sanitizedMessage = sanitizeHtml(message.trim());

		// Send email using Resend
		const { data, error } = await resend.emails.send({
			from: 'Just Cancel <onboarding@resend.dev>',
			to: [CONTACT_EMAIL],
			subject: `Contact Form: ${sanitizedSubject}`,
			html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${sanitizedName}</p>
        <p><strong>Email:</strong> ${sanitizedEmail}</p>
        <p><strong>Subject:</strong> ${sanitizedSubject}</p>
        <p><strong>Message:</strong></p>
        <p>${sanitizedMessage.replace(/\n/g, '<br>')}</p>
      `,
			reply_to: email.trim(), // Use original email for reply-to (Resend will validate)
		});

		if (error) {
			console.error('Resend error:', error);
			return NextResponse.json(
				{ error: 'Failed to send email' },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ message: 'Email sent successfully', id: data?.id },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error processing contact form:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
