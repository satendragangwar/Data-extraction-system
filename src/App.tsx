import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store/store';
import FileUpload from './components/FileUpload';
import InvoicesTab from './components/InvoicesTab';
import ProductsTab from './components/ProductsTab';
import CustomersTab from './components/CustomersTab';

function App() {
  const [activeTab, setActiveTab] = useState('invoices');

  const tabs = [
    { id: 'invoices', label: 'Invoices' },
    { id: 'products', label: 'Products' },
    { id: 'customers', label: 'Customers' },
  ];

  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Invoice Management System
              </h1>
              <FileUpload />
            </div>

            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-8 font-medium text-sm border-b-2 focus:outline-none transition-colors
                      ${activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'invoices' && <InvoicesTab />}
              {activeTab === 'products' && <ProductsTab />}
              {activeTab === 'customers' && <CustomersTab />}
            </div>
          </div>
        </div>
        <Toaster position="top-right" />
      </div>
    </Provider>
  );
}

export default App;