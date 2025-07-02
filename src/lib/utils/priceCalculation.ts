// Book formats with dimensions
export const bookFormats = {
  A4: { width: 210, height: 297, name: "A4 (210 × 297 mm)" },
  A5: { width: 148, height: 210, name: "A5 (148 × 210 mm)" },
  B5: { width: 176, height: 250, name: "B5 (176 × 250 mm)" },
  Royal: { width: 156, height: 234, name: "Royal (156 × 234 mm)" },
  "US-Letter": { width: 216, height: 279, name: "US Letter (216 × 279 mm)" },
  "US-Trade": { width: 152, height: 229, name: "US Trade (152 × 229 mm)" },
  Quadratisch: { width: 210, height: 210, name: "Quadratisch (210 × 210 mm)" },
  Individuell: { width: 0, height: 0, name: "Individuelles Format" },
};

// Paper types with prices per page
export const paperTypes = [
  { value: "textdruck-weiss", label: "Textdruck weiß", pricePerPage: 0.02 },
  {
    value: "textdruck-cremeweiss",
    label: "Textdruck cremeweiß",
    pricePerPage: 0.025,
  },
  {
    value: "bilderdruck-weiss",
    label: "Bilderdruck weiß",
    pricePerPage: 0.035,
  },
];

// Cover finishes with prices
export const coverFinishes = [
  { value: "matt", label: "Matt", price: 0.5 },
  { value: "glaenzend", label: "Glänzend", price: 0.7 },
];

// Spine types with prices
export const spineTypes = [
  { value: "rund", label: "Rund", price: 0.3 },
  { value: "gerade", label: "Gerade", price: 0 },
];

// Calculate minimum price based on book specifications
export const calculateMinimumPrice = (
  totalPages: number,
  selectedPaperType: string,
  selectedCoverFinish: string,
  selectedSpineType: string,
  selectedFormat: string,
  setPriceImpact?: (impact: any) => void,
): number => {
  // Base price calculation
  const basePrice = 5.0; // Base production cost

  // Paper type impact
  const paperType = paperTypes.find((type) => type.value === selectedPaperType);
  const paperTypePrice = (paperType?.pricePerPage || 0.02) * totalPages;

  // Cover finish impact
  const coverFinish = coverFinishes.find(
    (finish) => finish.value === selectedCoverFinish,
  );
  const coverFinishPrice = coverFinish?.price || 0.5;

  // Spine type impact
  const spineType = spineTypes.find((type) => type.value === selectedSpineType);
  const spineTypePrice = spineType?.price || 0;

  // Format impact (custom format costs extra)
  const formatPrice = selectedFormat === "Individuell" ? 1.5 : 0;

  // Color pages impact (not implemented in this mock)
  const colorPagesPrice = 0;

  // Calculate total minimum price
  const minimumPrice =
    basePrice +
    paperTypePrice +
    coverFinishPrice +
    spineTypePrice +
    formatPrice +
    colorPagesPrice;

  // Update price impact breakdown if callback is provided
  if (setPriceImpact) {
    setPriceImpact({
      paperType: paperTypePrice,
      coverFinish: coverFinishPrice,
      spineType: spineTypePrice,
      colorPages: colorPagesPrice,
      format: formatPrice,
    });
  }

  return minimumPrice;
};

// Calculate author commission based on selling price and minimum price
export const calculateCommission = (
  sellingPrice: number,
  minimumPrice: number,
): number => {
  // Base commission calculation
  if (sellingPrice <= minimumPrice) {
    return 0; // No commission if selling price is at or below minimum
  }

  // Calculate margin
  const margin = sellingPrice - minimumPrice;

  // Commission is higher with higher margins
  if (margin <= 5) {
    return 20; // 20% for small margins
  } else if (margin <= 10) {
    return 25; // 25% for medium margins
  } else if (margin <= 20) {
    return 30; // 30% for large margins
  } else {
    return 35; // 35% for very large margins
  }
};

// Calculate online shop commission (higher than standard)
export const calculateOnlineShopCommission = (
  sellingPrice: number,
  minimumPrice: number,
): number => {
  // Online shop commission is 5% higher than standard
  return calculateCommission(sellingPrice, minimumPrice) + 5;
};

// Calculate bookstore commission (lower than standard)
export const calculateBookstoreCommission = (
  sellingPrice: number,
  minimumPrice: number,
): number => {
  // Bookstore commission is 10% lower than standard
  return Math.max(0, calculateCommission(sellingPrice, minimumPrice) - 10);
};
