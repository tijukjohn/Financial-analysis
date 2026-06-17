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
      type: '',
      directRate: ''
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
      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded text-amber-800 text-sm flex items-start">
        <Info className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold mb-1">What to enter here:</p>
          <p>Enter the print materials you sell and the total volume sold to clients. You can either enter the total revenue received (Amount) OR the direct vendor rate per sq.ft.</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">Sheet 1: Enter the materials GDMR prints and the volume sold to calculate vendor benchmark rate.</h2>
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
              <th className="px-4 py-3 font-medium">Vendor Rate per Sq.Ft (Direct)</th>
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
                    <input type="text" placeholder="e.g. Frontlit Flex" value={mr.name} onChange={(e) => handleChange(mr.id, 'name', e.target.value)} className="w-full border-2 border-orange-200 rounded px-2 py-1 outline-none bg-orange-50 focus:border-accent-orange" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="text" placeholder="e.g. Flex" value={mr.type} onChange={(e) => handleChange(mr.id, 'type', e.target.value)} className="w-full border-2 border-orange-200 rounded px-2 py-1 outline-none bg-orange-50 focus:border-accent-orange" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="text" value={mr.unit} onChange={(e) => handleChange(mr.id, 'unit', e.target.value)} className="w-24 border-2 border-orange-200 rounded px-2 py-1 outline-none bg-orange-50 focus:border-accent-orange" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" placeholder="5000" value={mr.quantity || ''} onChange={(e) => handleChange(mr.id, 'quantity', parseFloat(e.target.value))} className="w-full border-2 border-orange-200 rounded px-2 py-1 bg-orange-50 outline-none focus:border-accent-orange" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" placeholder="75000" value={mr.amount || ''} onChange={(e) => handleChange(mr.id, 'amount', parseFloat(e.target.value))} className="w-full border-2 border-orange-200 rounded px-2 py-1 bg-orange-50 outline-none focus:border-accent-orange" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" placeholder="Optional" value={mr.directRate || ''} onChange={(e) => handleChange(mr.id, 'directRate', parseFloat(e.target.value))} className="w-full border-2 border-orange-200 rounded px-2 py-1 bg-orange-50 outline-none focus:border-accent-orange" />
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className={`p-6 rounded-lg border-2 ${results.vendorRateMethod.includes('Method A') ? 'bg-navy-900 border-navy-900 text-white shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold">Method A (Calculated)</h3>
              <p className="text-sm opacity-80 mt-1">Total Amount ÷ Total Quantity</p>
            </div>
            {results.vendorRateMethod.includes('Method A') && (
              <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">ACTIVE</span>
            )}
          </div>
          <div className={`text-4xl font-black ${results.vendorRateMethod.includes('Method A') ? 'text-green-400' : 'text-slate-400'}`}>
            ₹{results.averageVendorRate.toFixed(2)}
          </div>
        </div>

        <div className={`p-6 rounded-lg border-2 ${results.vendorRateMethod.includes('Method B') ? 'bg-navy-900 border-navy-900 text-white shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold">Method B (Direct)</h3>
              <p className="text-sm opacity-80 mt-1">Weighted average of direct rates</p>
            </div>
            {results.vendorRateMethod.includes('Method B') && (
              <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">ACTIVE</span>
            )}
          </div>
          <div className={`text-4xl font-black ${results.vendorRateMethod.includes('Method B') ? 'text-green-400' : 'text-slate-400'}`}>
            ₹{results.averageVendorRate.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section1MaterialRates;
