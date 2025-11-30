import html2pdf from 'html2pdf.js';

/**
 * Generates a PDF from an HTML string and triggers a download.
 * @param htmlContent The HTML content to convert to PDF.
 * @param filename The name of the file to download (e.g., 'document.pdf').
 */
export const generatePdfFromHtml = (htmlContent: string, filename: string): void => {
  // Create a temporary container for the HTML
  const element = document.createElement('div');
  element.innerHTML = htmlContent;

  // Apply specific styles for the PDF to ensure it looks like a document
  // We can inject a style tag into the element
  const style = document.createElement('style');
  style.innerHTML = `
    body {
      font-family: 'Times New Roman', serif;
      font-size: 12pt;
      line-height: 1.5;
      color: #000;
    }
    .acta-container {
      padding: 20px;
    }
    h1, h2, h3 {
      text-align: center;
      margin-bottom: 20px;
    }
    p {
      margin-bottom: 10px;
      text-align: justify;
    }
    .signature-section {
      margin-top: 50px;
      display: flex;
      justify-content: space-between;
    }
    .signature-box {
      border-top: 1px solid #000;
      width: 200px;
      text-align: center;
      padding-top: 10px;
    }
  `;
  element.appendChild(style);

  // Options for html2pdf
  const opt = {
    margin: [20, 20, 20, 20] as [number, number, number, number], // top, left, bottom, right in mm
    filename: filename,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  // Generate the PDF
  html2pdf().from(element).set(opt).save().then(() => {
    // Cleanup is handled by html2pdf mostly, but we created the element in memory
    // so we don't need to remove it from the DOM as we never appended it to body
  }).catch((err: unknown) => {
    console.error('Error generating PDF:', err);
  });
};
