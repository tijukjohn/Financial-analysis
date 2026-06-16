import React from 'react';
import { Plus, Trash2, Info } from 'lucide-react';

const Section2Invoices = ({ state, updateState, results }) => {
  const { invoices = [] } = state;

  const handleAdd = () => {
    const newItem = {
      id: `inv-${Date.now()}`,
      campaignName: '',
      code: '',
      clientCode: '',
      date: '',
      subTotal: 0,
      gstAmount: 0,
      costToGDMR: 0
    };
    updateState('invoices', [...invoices, newItem]);
  };

  const handleRemove = (id) => {
    updateState('invoices', invoices.filter(i => i.id !== id));
  };

  const handleChange = (id, field, value) => {
    updateState('invoices', invoices.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded text-yellow-800 text-sm flex items-start">
        <Info className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
        <p><strong>Guidance:</strong> Enter individual invoice lines. Orange fields are manual inputs. Green fields are auto-calculated.</p>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">Sheet 3: Vendor Invoice Data</h2>
          <p className="text-slate-500 text-sm mt-1">Capture outsourcing costs and client margins.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center px-4 py-2 bg-accent-orange text-white rounded hover:bg-accent-orange-hover transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Invoice
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[1200px]">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Campaign Name</th>
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Client Code</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Client Sub Total</th>
              <th className="px-4 py-3 font-medium">Client GST</th>
              <th className="px-4 py-3 font-medium text-green-700">Total Billed</th>
              <th className="px-4 py-3 font-medium">GDMR Project Cost</th>
              <th className="px-4 py-3 font-medium text-green-700">Margin Rs.</th>
              <th className="px-4 py-3 font-medium text-green-700">Margin %</th>
              <th className="px-4 py-3 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.map((inv) => {
              const clientAmount = (inv.subTotal || 0) + (inv.gstAmount || 0);
              const costToGDMR = inv.costToGDMR || 0;
              const margin = (inv.subTotal || 0) - costToGDMR;
              const marginPercent = inv.subTotal > 0 ? (margin / inv.subTotal) * 100 : 0;

              return (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2">
                    <input type="text" value={inv.campaignName} onChange={(e) => handleChange(inv.id, 'campaignName', e.target.value)} className="w-full border-2 border-orange-200 rounded px-2 py-1 outline-none bg-orange-50 focus:border-accent-orange" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="text" value={inv.code} onChange={(e) => handleChange(inv.id, 'code', e.target.value)} className="w-32 border-2 border-orange-200 rounded px-2 py-1 outline-none bg-orange-50 focus:border-accent-orange" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="text" value={inv.clientCode} onChange={(e) => handleChange(inv.id, 'clientCode', e.target.value)} className="w-32 border-2 border-orange-200 rounded px-2 py-1 outline-none bg-orange-50 focus:border-accent-orange" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="date" value={inv.date} onChange={(e) => handleChange(inv.id, 'date', e.target.value)} className="w-full border-2 border-orange-200 rounded px-2 py-1 outline-none bg-orange-50 focus:border-accent-orange" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" value={inv.subTotal || ''} onChange={(e) => handleChange(inv.id, 'subTotal', parseFloat(e.target.value))} className="w-28 border-2 border-orange-200 rounded px-2 py-1 bg-orange-50 outline-none focus:border-accent-orange" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" value={inv.gstAmount || ''} onChange={(e) => handleChange(inv.id, 'gstAmount', parseFloat(e.target.value))} className="w-24 border-2 border-orange-200 rounded px-2 py-1 bg-orange-50 outline-none focus:border-accent-orange" />
                  </td>
                  <td className="px-4 py-3 font-bold text-green-700 bg-green-50 rounded">₹{clientAmount.toFixed(0)}</td>
                  <td className="px-4 py-2">
                    <input type="number" value={inv.costToGDMR || ''} onChange={(e) => handleChange(inv.id, 'costToGDMR', parseFloat(e.target.value))} className="w-28 border-2 border-orange-200 rounded px-2 py-1 bg-orange-50 outline-none focus:border-accent-orange" />
                  </td>
                  <td className={`px-4 py-3 font-bold rounded ${margin >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    ₹{margin.toFixed(0)}
                  </td>
                  <td className={`px-4 py-3 font-bold rounded ${marginPercent >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {marginPercent.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleRemove(inv.id)} className="text-slate-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {invoices.length === 0 && (
              <tr><td colSpan="11" className="py-8 text-center text-slate-400">No invoices added yet. Click "Add Invoice" to begin.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="bg-navy-900 text-white p-6 rounded-lg shadow-lg flex justify-between items-center mt-8">
        <div>
          <h3 className="text-sm font-medium text-slate-300">Total GDMR Project Cost (Vendor Expense)</h3>
        </div>
        <div className="text-3xl font-bold text-green-400">
          ₹{results.totalVendorCost.toLocaleString('en-IN')}
        </div>
      </div>
    </div>
  );
};

export default Section2Invoices;
