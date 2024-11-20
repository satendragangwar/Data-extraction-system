import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { Package } from 'lucide-react';
import { updateProduct } from '../store/slices/productsSlice';
import type { Product } from '../store/slices/productsSlice';

export default function ProductsTab() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state: RootState) => state.products);

  const handleUpdate = (id: string, field: keyof Product, value: string | number) => {
    const product = items.find(p => p.id === id);
    if (product) {
      const updatedProduct = { 
        ...product, 
        [field]: value,
        priceWithTax: field === 'unitPrice' || field === 'tax' 
          ? (Number(value) * (1 + product.tax / 100))
          : product.priceWithTax
      };
      dispatch(updateProduct(updatedProduct));
    }
  };
  
  if (loading) return <div className="text-center py-4">Loading products...</div>;
  if (error) return <div className="text-red-500 py-4">{error}</div>;

  return (
    <div className="overflow-x-auto">
      {items.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-gray-600">No products yet. Upload some invoices to get started.</p>
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax (%)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price with Tax</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((product, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                {product.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                {product.unitPrice}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                {product.tax}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${product.priceWithTax.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                {product.discount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}