const fs = require('fs');
const path = require('path');
// @ts-ignore - pdf-parse doesn't have type definitions
const pdfParse = require('pdf-parse');

const pdfPath = path.join(__dirname, '../public/D8B3B44E-753D-4B1E-98DB-2738D408570C-list.pdf');
const outputPath = path.join(__dirname, '../public/D8B3B44E-753D-4B1E-98DB-2738D408570C-list.txt');

async function extractText() {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdfParse(dataBuffer);
    
    // Write the extracted text to a file
    fs.writeFileSync(outputPath, data.text, 'utf8');
    
    console.log(`PDF text extracted successfully!`);
    console.log(`Output saved to: ${outputPath}`);
    console.log(`Total characters: ${data.text.length}`);
    console.log(`Total pages: ${data.numpages}`);
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    process.exit(1);
  }
}

extractText();

