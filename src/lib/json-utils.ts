export function cleanJsonResponse(response: string): string {
  // Remove markdown code blocks
  let cleaned = response.trim();
  
  // Remove ```json and ``` markers
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '');
  }
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '');
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.replace(/\s*```$/, '');
  }
  
  // Fix smart quotes and other Unicode quote characters
  cleaned = cleaned
    .replace(/[""]/g, '"')  // Smart double quotes
    .replace(/['']/g, "'")  // Smart single quotes
    .replace(/[«»]/g, '"')  // French quotes
    .replace(/[‚„]/g, '"')  // Other quote variants
    .replace(/[‹›]/g, "'")  // Single angle quotes
    .replace(/[""]/g, '"')  // Additional smart quotes
    .replace(/['']/g, "'"); // Additional smart quotes
  
  // Fix triple quotes and other malformed quote patterns
  cleaned = cleaned
    .replace(/"""/g, '"')   // Triple quotes
    .replace(/""/g, '"')    // Double quotes
    .replace(/'{3,}/g, "'") // Multiple single quotes
    .replace(/"{2,}/g, '"'); // Multiple double quotes
  
  // Remove any leading/trailing whitespace
  cleaned = cleaned.trim();
  
  return cleaned;
}

export function parseAIResponse(response: string): any {
  let cleaned = cleanJsonResponse(response);
  
  // Try parsing the cleaned response
  try {
    return JSON.parse(cleaned);
  } catch (error) {
    // If parsing fails, try additional fixes
    console.log('First parse attempt failed, trying additional cleaning...');
    
    // More aggressive cleaning for malformed JSON
    cleaned = cleaned
      // Fix missing commas before closing braces/brackets
      .replace(/([^,\s])\s*([}\]])/g, '$1$2')
      // Fix trailing commas
      .replace(/,(\s*[}\]])/g, '$1')
      // Fix spaces around colons
      .replace(/\s*:\s*/g, ':')
      // Fix spaces around commas
      .replace(/\s*,\s*/g, ',');
    
    try {
      return JSON.parse(cleaned);
    } catch (secondError) {
      // If still failing, log for debugging and re-throw
      console.error('Failed to parse even after aggressive cleaning');
      console.error('Cleaned response:', cleaned);
      throw secondError;
    }
  }
}