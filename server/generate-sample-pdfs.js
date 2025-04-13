const fs = require('fs');
const path = require('path');

/**
 * Simple PDF generation script for creating sample resume files
 * 
 * This script creates minimal valid PDF files suitable for testing
 * Note: These are not real PDFs with content, just valid empty PDF structures
 * that can be served and will render as empty PDFs in a browser
 */

// Basic PDF content (minimal valid PDF format)
// This creates a PDF that will open in any PDF reader but is empty
const createMinimalPDF = (id) => {
    // This is a minimal valid PDF structure
    const content = `%PDF-1.0
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj
xref
0 4
0000000000 65535 f
0000000010 00000 n
0000000053 00000 n
0000000102 00000 n
trailer<</Size 4/Root 1 0 R>>
startxref
178
%%EOF
`;
    return content;
};

// Function to generate sample PDFs
function generateSamplePDFs() {
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
        console.log(`Created uploads directory at ${uploadsDir}`);
    }

    // Create sample resume PDFs
    for (let i = 1; i <= 33; i++) {
        const filename = `sample-resume-${i}.pdf`;
        const filePath = path.join(uploadsDir, filename);
        
        try {
            // Generate PDF content regardless if file exists or not
            const pdfContent = createMinimalPDF(i);
            
            // Write file with content
            fs.writeFileSync(filePath, pdfContent);
            console.log(`Created/updated sample PDF: ${filename} (${pdfContent.length} bytes)`);
        } catch (err) {
            console.error(`Error creating ${filename}:`, err);
        }
    }

    console.log('Sample PDF generation complete. Created in:', uploadsDir);
    return true;
}

// Run the generator if this is the main module
if (require.main === module) {
    generateSamplePDFs();
}

// Export the function for use in other modules
module.exports = generateSamplePDFs;