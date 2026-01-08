import Papa from 'papaparse';
import type { ProcessedData, Transaction } from '@/types';
import { SERVICE_KEYWORDS, CATEGORY_KEYWORDS } from './constants';
import { validateFile } from './validation';

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

function processCSV(
	file: File,
	accountType: 'checking' | 'credit'
): Promise<ProcessedData> {
	return new Promise((resolve, reject) => {
		Papa.parse(file, {
			header: true,
			skipEmptyLines: true,
			complete: (results) => {
				try {
					const transactions: Transaction[] = [];
					const rows = results.data as any[];

					rows.forEach((row) => {
						// Try to find amount, date, and description columns
						const amountKey =
							Object.keys(row).find(
								(key) =>
									key.toLowerCase().includes('amount') ||
									key.toLowerCase().includes('charge')
							) || Object.keys(row)[Object.keys(row).length - 1];

						const dateKey =
							Object.keys(row).find((key) =>
								key.toLowerCase().includes('date')
							) || Object.keys(row)[0];

						const descKey =
							Object.keys(row).find(
								(key) =>
									key.toLowerCase().includes('description') ||
									key.toLowerCase().includes('merchant') ||
									key.toLowerCase().includes('name')
							) || Object.keys(row)[1];

						const amount = parseAmount(row[amountKey] || 0);
						if (amount !== 0) {
							const description = (row[descKey] || '').toString();
							const date = (row[dateKey] || '').toString();
							const service = detectService(description);
							const category =
								amount > 0 ? 'Income' : detectCategory(description);

							transactions.push({
								date,
								description,
								amount, // Keep original sign
								category,
								service,
							});
						}
					});

					const processed = organizeData(transactions, accountType);
					resolve(processed);
				} catch (error) {
					reject(error);
				}
			},
			error: (error) => reject(error),
		});
	});
}

async function processPDF(
	file: File,
	accountType: 'checking' | 'credit'
): Promise<ProcessedData> {
	const formData = new FormData();
	formData.append('file', file);
	formData.append('accountType', accountType);

	const response = await fetch('/api/process-pdf', {
		method: 'POST',
		body: formData,
	});

	if (!response.ok) {
		throw new Error('Failed to process PDF file');
	}

	return response.json();
}

function organizeData(
	transactions: Transaction[],
	accountType: 'checking' | 'credit'
): ProcessedData {
	const categories: Record<string, Transaction[]> = {};
	const services = new Set<string>();

	transactions.forEach((transaction) => {
		// Separate positive transactions into Income category
		const finalCategory = transaction.category;

		if (!categories[finalCategory]) {
			categories[finalCategory] = [];
		}
		categories[finalCategory].push({
			...transaction,
			category: finalCategory,
		});

		// Collect services
		if (transaction.service) {
			services.add(transaction.service);
		}
	});

	// Calculate totals - only count expenses (negative amounts) for yearly total
	const monthlyExpenses = transactions
		.filter((t) => t.amount < 0)
		.reduce((sum, t) => sum + Math.abs(t.amount), 0);

	return {
		total: monthlyExpenses,
		transactions,
		categories,
		services: Array.from(services),
		numberOfTransactions: transactions.length,
		accountType,
	};
}

export async function processFile(
	file: File,
	accountType: 'checking' | 'credit'
): Promise<ProcessedData> {
	// Validate file before processing
	const validation = validateFile(file);
	if (!validation.valid) {
		throw new Error(validation.error || 'Invalid file');
	}

	if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
		return processCSV(file, accountType);
	} else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
		return processPDF(file, accountType);
	} else {
		throw new Error('Unsupported file type. Please upload a CSV or PDF file.');
	}
}
