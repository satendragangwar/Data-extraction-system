import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Customer {
  id: string;
  name: string;
  phoneNumber: string;
  totalPurchaseAmount: number;
  email?: string;
  address?: string;
}

interface CustomersState {
  items: Customer[];
  loading: boolean;
  error: string | null;
}

const initialState: CustomersState = {
  items: [],
  loading: false,
  error: null,
};

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setCustomers: (state, action: PayloadAction<Customer[]>) => {
      state.items = action.payload;
    },
    addCustomer: (state, action: PayloadAction<Customer>) => {
      state.items.push(action.payload);
    },
    updateCustomer: (state, action: PayloadAction<Customer>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setCustomers, addCustomer, updateCustomer, setLoading, setError } = customersSlice.actions;
export default customersSlice.reducer;