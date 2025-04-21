import fs from 'fs';
import pdf from 'pdf-parse';

/**
 * Converts a PDF file to Markdown format
 * @param filePath Path to the PDF file
 * @returns Markdown string
 */
export async function convertPdfToMarkdown(filePath: string): Promise<string> {
  try {
    // Read the PDF file
    const dataBuffer = fs.readFileSync(filePath);
    
    // Parse the PDF data
    const data = await pdf(dataBuffer);
    
    // Get the text content
    const rawText = data.text;
    
    // Simple formatting for headings, paragraphs, etc.
    // This is a basic implementation - more advanced formatting would require
    // more sophisticated parsing of the PDF structure
    let markdown = formatTextToMarkdown(rawText);
    
    return markdown;
  } catch (error) {
    console.error('Error converting PDF to Markdown:', error);
    throw new Error('Failed to convert PDF to Markdown');
  }
}

/**
 * Format raw text to Markdown
 * This is a simple implementation that tries to detect headers and paragraphs
 * For a production app, you'd want a more sophisticated solution
 */
function formatTextToMarkdown(text: string): string {
  // Split text into lines
  const lines = text.split(/\r?\n/);
  let markdown = '';
  let inCodeBlock = false;
  let inList = false;
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    
    // Skip empty lines
    if (!line) {
      // Add a break between paragraphs
      if (markdown && !markdown.endsWith('\n\n')) {
        markdown += '\n\n';
      }
      continue;
    }
    
    // Detect headings (short lines with bigger font or all caps)
    if (line.length < 100 && (line === line.toUpperCase() || /^[A-Z][\w\s]+$/.test(line))) {
      const headingLevel = line.length < 30 ? '#' : '##';
      markdown += `${headingLevel} ${line}\n\n`;
      continue;
    }
    
    // Detect list items
    if (line.match(/^\s*[\-\*•]\s+/) || line.match(/^\s*\d+\.\s+/)) {
      if (!inList) {
        inList = true;
        markdown += '\n';
      }
      markdown += `${line}\n`;
      continue;
    } else if (inList) {
      inList = false;
      markdown += '\n';
    }
    
    // Regular paragraph
    markdown += `${line} `;
  }
  
  return markdown.trim();
} 