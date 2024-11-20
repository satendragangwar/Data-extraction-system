import { GoogleGenerativeAI } from '@google/generative-ai';
import * as XLSX from 'xlsx';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const cleanJSONResponse = (text: string): any => {
  try {
    const jsonStartIndex = text.indexOf('{');
    const jsonEndIndex = text.lastIndexOf('}');
    if (jsonStartIndex === -1 || jsonEndIndex === -1) {
      throw new Error('No valid JSON object found in response');
    }
    const cleanText = text.slice(jsonStartIndex, jsonEndIndex + 1).trim();
    return JSON.parse(cleanText);
  } catch (err) {
    console.error('Error parsing response:', err);
    throw new Error('Invalid JSON response from the AI model');
  }
};

export async function extractDataFromImage(file: File) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const imageData = await fileToGenerativePart(file);
    const prompt = `
      Extract the following data in JSON format with the specified columns:
      1. invoices: {serialNumber, customerName, productName, quantity, tax,  totalAmount, date}
      2. products: {name, quantity, unitPrice, tax, priceWithTax, discount}
      3. customers: {name, phoneNumber, totalPurchaseAmount}
      Ensure only the required columns are included.`;
    
    const result = await model.generateContent([prompt, imageData]);
    const responseText = await result.response.text();

    return cleanJSONResponse(responseText);
  } catch (error) {
    console.error('Error extracting data from image:', error);
    throw error;
  }
}

export async function extractDataFromPDF(file: File) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const pdfData = await fileToGenerativePart(file); // Convert PDF to base64 for the API
    const prompt = `
      Extract the following data in JSON format with the specified columns from this PDF invoice:
     1. invoices: {serialNumber, customerName, productName, quantity, tax,  totalAmount, date}
      2. products: {name, quantity, unitPrice, tax, priceWithTax, discount}
      3. customers: {name, phoneNumber, totalPurchaseAmount}
      Ensure only the required columns are included.`;

    const result = await model.generateContent([prompt, pdfData]);
    const responseText = await result.response.text();

    return cleanJSONResponse(responseText);
  } catch (error) {
    console.error('Error extracting data from PDF:', error);
    throw error;
  }
}


export async function extractDataFromExcel(file: File) {
  try {
    const reader = new FileReader();
    const excelData = await new Promise((resolve) => {
      reader.onload = (e) => {
        const workbook = XLSX.read(e.target?.result, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        resolve(XLSX.utils.sheet_to_json(worksheet));
      };
      reader.readAsArrayBuffer(file);
    });

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
      Given this Excel data:
      ${JSON.stringify(excelData)}
      Extract the following in JSON format:
       1. invoices: {serialNumber, customerName, productName, quantity, tax,  totalAmount, date}
      2. products: {name, quantity, unitPrice, tax, priceWithTax, discount}
      3. customers: {name, phoneNumber, totalPurchaseAmount}
      Ensure only the required columns are included.`;

    const result = await model.generateContent([prompt]);
    const responseText = await result.response.text();

    return cleanJSONResponse(responseText);
  } catch (error) {
    console.error('Error extracting data from Excel:', error);
    throw error;
  }
}

async function fileToGenerativePart(file: File) {
  const base64String = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result?.toString().split(',')[1];
      resolve(base64 ?? '');
    };
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      data: base64String,
      mimeType: file.type,
    },
  };
}
