import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { Users } from 'lucide-react';
import { updateCustomer } from '../store/slices/customersSlice';
import type { Customer } from '../store/slices/customersSlice';

export default function CustomersTab() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state: RootState) => state.customers);

  const handleUpdate = (id: string, field: keyof Customer, value: string | number) => {
    const customer = items.find(c => c.id === id);
    if (customer) {
      dispatch(updateCustomer({ ...customer, [field]: value }));
    }
  };

  if (loading) return <div className="text-center py-4">Loading customers...</div>;
  if (error) return <div className="text-red-500 py-4">{error}</div>;

  return (
    <div className="overflow-x-auto">
      {items.length === 0 ? (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-gray-600">No customers yet. Upload some invoices to get started.</p>
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Purchase Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((customer, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                {customer.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                {customer.phoneNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${customer.totalPurchaseAmount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                {customer.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                {customer.address}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}