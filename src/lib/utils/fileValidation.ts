// This is a mock implementation of file validation functions
// In a real application, these would use libraries like pdf.js to validate PDF files

export const validateCustomFormat = (
  width: string,
  height: string,
  setError: (error: string) => void,
): boolean => {
  // Convert comma to dot for decimal numbers
  const normalizedWidth = width.replace(",", ".");
  const normalizedHeight = height.replace(",", ".");

  const widthNum = parseFloat(normalizedWidth);
  const heightNum = parseFloat(normalizedHeight);

  // Check if values are valid numbers
  if (isNaN(widthNum) || isNaN(heightNum)) {
    setError("Bitte geben Sie gültige Zahlen ein.");
    return false;
  }

  // Check if values are within allowed range
  // Width: 10.8 - 21 cm
  // Height: 17 - 29.7 cm
  if (widthNum < 10.8 || widthNum > 21) {
    setError("Die Breite muss zwischen 10,8 und 21 cm liegen.");
    return false;
  }

  if (heightNum < 17 || heightNum > 29.7) {
    setError("Die Höhe muss zwischen 17 und 29,7 cm liegen.");
    return false;
  }

  // All checks passed
  setError("");
  return true;
};

export const validatePdfFormat = async (
  file: File,
): Promise<{ valid: boolean; pages: number }> => {
  // This is a mock implementation
  // In a real application, we would use pdf.js to validate the PDF format

  return new Promise((resolve) => {
    // Simulate processing delay
    setTimeout(() => {
      // Check if file is a PDF
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        resolve({ valid: false, pages: 0 });
        return;
      }

      // Simulate validation based on file size
      // In a real implementation, we would check the actual dimensions of the PDF
      const valid = file.size > 0 && file.size < 100 * 1024 * 1024; // Less than 100MB

      // Generate a random page count between 50 and 500
      const pages = Math.floor(Math.random() * 450) + 50;

      resolve({ valid, pages });
    }, 1500);
  });
};
