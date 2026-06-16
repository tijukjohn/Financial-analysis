import React from 'react';
import { Plus, Trash2, Info } from 'lucide-react';

const Section1MaterialRates = ({ state, updateState, results }) => {
  const { materialRates = [] } = state;

  const handleAdd = () => {
    const newItem = {
      id: `mr-${Date.now()}`,
      name: '',
      unit: 'sq.ft',
      quantity: 0,
      amount: 0,
      type: ''
    };
    updateState('materialRates', [...materialRates, newItem]);
  };

  const handleRemove = (id) => {
    updateState('materialRates', materialRates.filter(mr => mr.id !== id));
  };

  const handleChange = (id, field, value) => {
    updateState('materialRates', materialRates.map(mr => mr.id === id ? { ...mr, [field]: value } : mr));
  };

  const totalAmount = materialRates.reduce((sum, mr) => sum + (mr.amount || 0), 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded text-yellow-800 text-sm flex items-start">
        <Info className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
        <p><strong>Guidance:</strong> Enter individual material rates. Orange fields are manual inputs. Green fields are auto-calculated.</p>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">Sheet 1: Material Rate Calculator</h2>
          <p className="text-slate-500 text-sm mt-1">Calculate the weighted average vendor rate per sq.ft.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center px-4 py-2 bg-accent-orange text-white rounded hover:bg-accent-orange-hover transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Material
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[800px]">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Item Name</th>
              <th className="px-4 py-3 font-medium">Product Type</th>
              <th className="px-4 py-3 font-medium">Unit</th>
              <th className="px-4 py-3 font-medium">Quantity Sold sq.ft</th>
              <th className="px-4 py-3 font-medium">Amount Rs.</th>
              <th className="px-4 py-3 font-medium text-green-700">Rate per sq.ft</th>
              <th className="px-4 py-3 font-medium text-green-700">% Share</th>
              <th className="px-4 py-3 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {materialRates.map((mr) => {
              const rate = mr.quantity > 0 ? (mr.amount || 0) / mr.quantity : 0;
              const share = totalAmount > 0 ? ((mr.amount || 0) / totalAmount) * 100 : 0;

              return (
                <tr key={mr.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2">
                    <input type="text" value={mr.name} onChange={(e) => handleChange(mr.id, 'name', e.target.value)} className="w-full border-2 border-orange-200 rounded px-2 py-1 outline-none bg-orange-50 focus:border-accent-orange" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="text" value={mr.type} onChange={(e) => handleChange(mr.id, 'type', e.target.value)} className="w-full border-2 border-orange-200 rounded px-2 py-1 outline-none bg-orange-50 focus:border-accent-orange" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="text" value={mr.unit} onChange={(e) => handleChange(mr.id, 'unit', e.target.value)} className="w-24 border-2 border-orange-200 rounded px-2 py-1 outline-none bg-orange-50 focus:border-accent-orange" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" value={mr.quantity || ''} onChange={(e) => handleChange(mr.id, 'quantity', parseFloat(e.target.value))} className="w-full border-2 border-orange-200 rounded px-2 py-1 bg-orange-50 outline-none focus:border-accent-orange" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" value={mr.amount || ''} onChange={(e) => handleChange(mr.id, 'amount', parseFloat(e.target.value))} className="w-full border-2 border-orange-200 rounded px-2 py-1 bg-orange-50 outline-none focus:border-accent-orange" />
                  </td>
                  <td className="px-4 py-3 font-bold text-green-700 bg-green-50 rounded">₹{rate.toFixed(2)}</td>
                  <td className="px-4 py-3 font-bold text-green-700 bg-green-50 rounded">{share.toFixed(1)}%</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleRemove(mr.id)} className="text-slate-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {materialRates.length === 0 && (
              <tr><td colSpan="8" className="py-8 text-center text-slate-400">No materials added yet. Click "Add Material" to begin.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-8">
        <div className="bg-navy-900 text-white p-8 rounded-lg shadow-lg flex flex-col items-center">
          <h3 className="text-lg font-medium text-slate-300">Weighted Average Rate</h3>
          <p className="text-sm text-slate-400 mb-2">Total Amount ÷ Total Quantity</p>
          <div className="text-5xl font-black text-green-400 mt-auto drop-shadow-md">
            ₹{results.averageVendorRate.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section1MaterialRates;
