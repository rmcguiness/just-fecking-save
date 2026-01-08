import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';
import type { ProcessedData, Transaction } from '@/types';
import {
	SERVICE_KEYWORDS,
	CATEGORY_KEYWORDS,
	MAX_FILE_SIZE,
} from '@/utils/constants';
import { validateFile } from '@/utils/validation';

function detectService(description: string): string | undefined {
	const lowerDesc = description.toLowerCase();
	for (const [service, keywords] of Object.entries(SERVICE_KEYWORDS)) {
		if (keywords.some((keyword) => lowerDesc.includes(keyword))) {
			return service;
		}
	}
	return undefined;
}

function detectCategory(description: string): string {
	const lowerDesc = description.toLowerCase();
	for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
		if (keywords.some((keyword) => lowerDesc.includes(keyword))) {
			return category;
		}
	}
	return 'Other';
}

function parseAmount(amount: string | number): number {
	if (typeof amount === 'number') return amount;
	const cleaned = amount.toString().replace(/[^0-9.-]/g, '');
	return parseFloat(cleaned) || 0;
}

function organizeData(
	transactions: Transaction[],
	accountType: 'checking' | 'credit'
): ProcessedData {
	const categories: Record<string, Transaction[]> = {};
	const services = new Set<string>();

	// Only process expenses (negative amounts), filter out positive amounts
	// const expenseTransactions = transactions.filter((t) => t.amount < 0);

	transactions.forEach((transaction) => {
		const category = transaction.category;

		if (!categories[category]) {
			categories[category] = [];
		}
		categories[category].push(transaction);

		if (transaction.service) {
			services.add(transaction.service);
		}
	});

	// Calculate totals - only count expenses for yearly total
	const monthlyExpenses = transactions.reduce(
		(sum, t) => sum + Math.abs(t.amount),
		0
	);

	return {
		total: monthlyExpenses,
		transactions,
		categories,
		services: Array.from(services),
		numberOfTransactions: transactions.length,
		accountType,
	};
}

function extractChaseTransactions(text: string): Transaction[] {
	const transactions: Transaction[] = [];
	const lines = text.split('\n');

	// Process lines starting from transaction section
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim();

		// Stop if we hit certain markers (end of transactions)
		if (line.includes('This Page Intentionally Left Blank')) {
			break;
		}

		// Skip header rows and empty lines
		if (
			!line ||
			(line.includes('DATE') && line.includes('DESCRIPTION')) ||
			line.includes('Beginning Balance') ||
			line.match(/^Page \d+ of \d+$/) ||
			line.match(/^\d+ \d+Pageof$/)
		) {
			continue;
		}

		// Only process lines that match the pattern: MM/DD (random stuff) ##.##
		// This pattern ensures we only capture actual transaction lines
		const transactionPattern =
			/^(\d{1,2}\/\d{1,2})(.+?)(-?\$?\d{1,3}(?:,\d{3})*\.\d{2})/;
		const match = line.match(transactionPattern);

		if (!match) {
			continue;
		}

		const date = match[1];
		const description = match[2].trim();
		const amountStr = match[3];

		// Skip if description is too short or looks like a header
		if (
			description.length < 3 ||
			description.match(/^(DESCRIPTION|AMOUNT|BALANCE)$/i)
		) {
			continue;
		}

		const amount = parseAmount(amountStr);

		// Skip if amount is 0 or too large (likely a balance, not a transaction)
		if (amount === 0 || amount > 100000) {
			continue;
		}

		// Clean up description - remove extra whitespace
		const cleanedDescription = description.replace(/\s+/g, ' ').trim();

		// Process both positive (income) and negative (expenses) transactions
		// Keep the sign of the amount
		const service = detectService(cleanedDescription);
		const category = detectCategory(cleanedDescription);

		transactions.push({
			date,
			description: cleanedDescription,
			amount: amount, // Keep original sign
			category,
			service,
		});
	}

	return transactions;
}

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get('file') as File;
		const accountType =
			(formData.get('accountType') as 'checking' | 'credit') || 'checking';

		if (!file) {
			return NextResponse.json({ error: 'No file provided' }, { status: 400 });
		}

		// Validate file before processing
		const validation = validateFile(file);
		if (!validation.valid) {
			return NextResponse.json(
				{ error: validation.error || 'Invalid file' },
				{ status: 400 }
			);
		}

		// Additional check: ensure file size is reasonable for processing
		if (file.size > MAX_FILE_SIZE) {
			return NextResponse.json(
				{ error: 'File size exceeds maximum allowed size' },
				{ status: 400 }
			);
		}

		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		// Limit PDF parsing to prevent DoS from malicious PDFs
		const data = await pdfParse(buffer, { max: 50 }); // Limit to 50 pages
		const text = data.text;

		// Try to extract Chase transactions first
		let transactions = extractChaseTransactions(text);

		// If no Chase transactions found, fall back to generic parsing
		if (transactions.length === 0) {
			const lines = text.split('\n');
			const amountRegex = /\$?(\d+\.\d{2})/g;
			const dateRegex = /\d{1,2}\/\d{1,2}\/\d{2,4}/g;

			lines.forEach((line: string) => {
				const amounts = line.match(amountRegex);
				const dates = line.match(dateRegex);

				if (amounts && amounts.length > 0) {
					const amount = parseAmount(amounts[0]);
					if (amount !== 0 && Math.abs(amount) < 100000) {
						const description = line
							.replace(amountRegex, '')
							.replace(dateRegex, '')
							.trim();
						if (description.length > 3) {
							const date = dates && dates[0] ? dates[0] : '';
							const service = detectService(description);
							const category = detectCategory(description);

							transactions.push({
								date,
								description,
								amount, // Keep original sign
								category,
								service,
							});
						}
					}
				}
			});
		}

		const processed = organizeData(transactions, accountType);
		return NextResponse.json(processed);
	} catch (error) {
		console.error('Error processing PDF:', error);
		return NextResponse.json(
			{ error: 'Failed to process PDF file' },
			{ status: 500 }
		);
	}
}
