export interface Transaction {
	date: string;
	description: string;
	amount: number;
	category: string;
	service?: string;
}

export interface ProcessedData {
	total: number;
	transactions: Transaction[];
	categories: Record<string, Transaction[]>;
	services: string[];
	numberOfTransactions: number;
	accountType: 'checking' | 'credit';
}
