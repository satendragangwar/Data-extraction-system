import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { FileText } from 'lucide-react';

export default function InvoicesTab() {
  const { items, loading, error } = useSelector((state: RootState) => state.invoices);

  if (loading) return <div className="text-center py-4">Loading invoices...</div>;
  if (error) return <div className="text-red-500 py-4">{error}</div>;

  return (
    <div className="overflow-x-auto">
      {items.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-gray-600">No invoices yet. Upload some files to get started.</p>
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((invoice, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.serialNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.customerName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.productName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${(invoice.tax || 0).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${(invoice.totalAmount || 0).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(invoice.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
