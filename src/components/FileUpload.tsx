import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Loader2Icon, Upload } from "lucide-react";
import { useDispatch } from "react-redux";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import {
  extractDataFromImage,
  extractDataFromPDF,
  extractDataFromExcel,
} from "../services/geminiService";
import { setInvoices, setLoading } from "../store/slices/invoicesSlice";
import { setProducts } from "../store/slices/productsSlice";
import { setCustomers } from "../store/slices/customersSlice";

export default function FileUpload() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  // Replace the processFile function with this updated version
  const processFile = async (file: File) => {
    console.log(`Processing file: ${file.name} (${file.type})`);

    try {
      let data;
      setIsLoading(true);
      if (file.type.includes("image")) {
        console.log("Processing as image...");
        data = await extractDataFromImage(file);
      } else if (file.type === "application/pdf") {
        console.log("Processing as PDF...");
        data = await extractDataFromPDF(file);
      } else if (
        file.type.includes("sheet") ||
        file.name.endsWith(".xlsx") ||
        file.name.endsWith(".xls")
      ) {
        console.log("Processing as Excel...");
        data = await extractDataFromExcel(file);
      }

      if (data) {
        console.log("Extracted data:", data);
        dispatch(setInvoices(data.invoices || []));
        dispatch(setProducts(data.products || []));
        dispatch(setCustomers(data.customers || []));
        toast.success("File processed successfully");
      } else {
        toast.error("No data returned from file processing");
      }
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error("Error processing file");
    } finally {
      setIsLoading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(processFile); // Call processFile for each uploaded file
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
        ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-400"
        }`}
    >
      {!isLoading ? (
        <>
          {" "}
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            {isDragActive
              ? "Drop the files here..."
              : "Drag & drop files here, or click to select files"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Supports PDF, Excel (.xlsx, .xls), and images
          </p>
        </>
      ) : <div>
           <Loader2Icon className="animate-spin flex items-center mx-auto"/>
        </div>}
    </div>
  );
}
