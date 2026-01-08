declare module 'pdf-parse' {
	interface PDFData {
		numPages: number;
		text: string;
		info: any;
		metadata: any;
	}

	interface PDFParseOptions {
		max?: number;
	}

	function pdfParse(
		dataBuffer: Buffer,
		options?: PDFParseOptions
	): Promise<PDFData>;

	export = pdfParse;
}

