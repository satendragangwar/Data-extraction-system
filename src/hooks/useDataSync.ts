import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { updateInvoice } from '../store/slices/invoicesSlice';
import { updateProduct } from '../store/slices/productsSlice';
import { updateCustomer } from '../store/slices/customersSlice';

export function useDataSync() {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products.items);
  const customers = useSelector((state: RootState) => state.customers.items);
  const invoices = useSelector((state: RootState) => state.invoices.items);

  // Sync product changes to invoices
  useEffect(() => {
    products.forEach(product => {
      invoices.forEach(invoice => {
        if (invoice.productName === product.name) {
          dispatch(updateInvoice({
            ...invoice,
            tax: product.tax,
            totalAmount: product.priceWithTax * invoice.quantity
          }));
        }
      });
    });
  }, [products, invoices]);

  // Sync customer changes to invoices
  useEffect(() => {
    customers.forEach(customer => {
      invoices.forEach(invoice => {
        if (invoice.customerName === customer.name) {
          dispatch(updateInvoice({
            ...invoice,
            customerName: customer.name
          }));
        }
      });
    });
  }, [customers, invoices]);

  // Update customer total purchase amounts
  useEffect(() => {
    customers.forEach(customer => {
      const totalAmount = invoices
        .filter(invoice => invoice.customerName === customer.name)
        .reduce((sum, invoice) => sum + invoice.totalAmount, 0);

      if (totalAmount !== customer.totalPurchaseAmount) {
        dispatch(updateCustomer({
          ...customer,
          totalPurchaseAmount: totalAmount
        }));
      }
    });
  }, [invoices]);
}