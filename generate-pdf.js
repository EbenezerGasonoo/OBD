/**
 * PDF Generator for OBD-Waste Solutions Pitch Deck
 * Uses Puppeteer to generate PDF from HTML
 * 
 * Installation: npm install puppeteer
 * Run: node generate-pdf.js
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generatePDF() {
    console.log('Starting PDF generation...');
    
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Get absolute path to index.html
    const htmlPath = path.join(__dirname, 'index.html');
    const fileUrl = `file://${htmlPath.replace(/\\/g, '/')}`;
    
    console.log(`Loading: ${fileUrl}`);
    
    await page.goto(fileUrl, {
        waitUntil: 'networkidle0',
        timeout: 30000
    });
    
    // Wait for fonts and images to load
    await page.waitForTimeout(2000);
    
    // Generate PDF with custom page size
    const pdfPath = path.join(__dirname, 'OBD-Waste-Solutions-Pitch-Deck.pdf');
    
    console.log('Generating PDF...');
    
    await page.pdf({
        path: pdfPath,
        width: '1280px',
        height: '720px',
        printBackground: true,
        margin: {
            top: '0',
            right: '0',
            bottom: '0',
            left: '0'
        },
        preferCSSPageSize: true,
        displayHeaderFooter: false
    });
    
    await browser.close();
    
    console.log(`✅ PDF generated successfully: ${pdfPath}`);
    console.log(`File size: ${(fs.statSync(pdfPath).size / 1024 / 1024).toFixed(2)} MB`);
}

// Check if puppeteer is installed
try {
    require('puppeteer');
    generatePDF().catch(console.error);
} catch (e) {
    console.log('Puppeteer not found. Installing...');
    console.log('Please run: npm install puppeteer');
    console.log('Then run: node generate-pdf.js');
}

