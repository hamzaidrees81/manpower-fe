export function validateRequiredFields(
    data: any, 
    requiredFields: string[], 
    toasterService: any
  ): boolean {
    for (const field of requiredFields) {
      if (!data[field] || data[field].toString().trim() === "") {
        toasterService.showError(`${field} is required.`);
        return false;
      }
    }
    return true;
  }
  