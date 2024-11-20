export interface ValidationError {
  field: string;
  message: string;
}

export function validateInvoiceData(data: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.serialNumber) {
    errors.push({ field: 'serialNumber', message: 'Serial number is required' });
  }
  if (!data.customerName) {
    errors.push({ field: 'customerName', message: 'Customer name is required' });
  }
  if (!data.productName) {
    errors.push({ field: 'productName', message: 'Product name is required' });
  }
  if (typeof data.quantity !== 'number' || data.quantity <= 0) {
    errors.push({ field: 'quantity', message: 'Valid quantity is required' });
  }
  if (typeof data.tax !== 'number' || data.tax < 0) {
    errors.push({ field: 'tax', message: 'Valid tax amount is required' });
  }
  if (typeof data.totalAmount !== 'number' || data.totalAmount <= 0) {
    errors.push({ field: 'totalAmount', message: 'Valid total amount is required' });
  }
  if (!data.date) {
    errors.push({ field: 'date', message: 'Date is required' });
  }

  return errors;
}

export function validateProductData(data: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.name) {
    errors.push({ field: 'name', message: 'Product name is required' });
  }
  if (typeof data.quantity !== 'number' || data.quantity < 0) {
    errors.push({ field: 'quantity', message: 'Valid quantity is required' });
  }
  if (typeof data.unitPrice !== 'number' || data.unitPrice <= 0) {
    errors.push({ field: 'unitPrice', message: 'Valid unit price is required' });
  }
  if (typeof data.tax !== 'number' || data.tax < 0) {
    errors.push({ field: 'tax', message: 'Valid tax percentage is required' });
  }

  return errors;
}

export function validateCustomerData(data: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.name) {
    errors.push({ field: 'name', message: 'Customer name is required' });
  }
  if (!data.phoneNumber) {
    errors.push({ field: 'phoneNumber', message: 'Phone number is required' });
  }
  if (typeof data.totalPurchaseAmount !== 'number' || data.totalPurchaseAmount < 0) {
    errors.push({ field: 'totalPurchaseAmount', message: 'Valid total purchase amount is required' });
  }
  if (data.email && !isValidEmail(data.email)) {
    errors.push({ field: 'email', message: 'Valid email address is required' });
  }

  return errors;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}