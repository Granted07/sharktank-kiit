const INR_FORMATTER = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

// Formats numeric amounts into localized INR currency strings.
export function formatCurrency(amount: number): string {
  return INR_FORMATTER.format(amount);
}
