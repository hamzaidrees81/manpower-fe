export function validateAndHandleNumericFields(
  data: any,
  fields: string[],
  toasterService: any,
  event: any
): boolean {
  let invalidFields: string[] = [];

  fields.forEach(field => {
    if (!/^\d+$/.test(data[field])) {
      invalidFields.push(formatFieldName(field)); // Convert to readable format
    }
  });

  if (invalidFields.length > 0) {
    toasterService.showError(`Invalid input in: ${invalidFields.join(", ")}. Must be a number.`);

    event.confirm.reject();
    return false; // Validation failed
  }

  return true; // Validation passed
}

// ✅ Convert "maxAssetCount" → "Max Asset Count"
function formatFieldName(fieldName: string): string {
  return fieldName
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
    .trim();
}

export function validateRequiredFields(
  data: any,
  requiredFields: string[],
  toasterService: any
): boolean {
  for (const field of requiredFields) {
    if (!data[field] || data[field].toString().trim() === "") {
      toasterService.showError(`${formatFieldName(field)} is required.`);
      return false;
    }
  }
  return true;
}
