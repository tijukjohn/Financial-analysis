import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Trash2, Info } from 'lucide-react';

const Section2CapEx = ({ state, updateState, results }) => {
  const { machines } = state;

  const handleAdd = () => {
    const newMachine = {
      id: `m-${Date.now()}`,
      name: 'New Machine',
      desc: '',
      cost: 0,
      gstRate: 18
    };
    updateState('machines', [...machines, newMachine]);
  };

  const handleRemove = (id) => {
    updateState('machines', machines.filter(m => m.id !== id));
  };

  const handleChange = (id, field, value) => {
    updateState('machines', machines.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded text-yellow-800 text-sm flex items-start">
        <Info className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
        <p><strong>Guidance:</strong> Enter the pre-GST cost and applicable GST rate for each machine or item below. Capital expenditure covers equipment, installation, and infrastructure. Orange fields are manual inputs.</p>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">Sheet 3: Machine Costs (CapEx)</h2>
        </div>
        <button onClick={handleAdd} className="flex items-center px-4 py-2 bg-accent-orange text-white rounded hover:bg-accent-orange-hover transition-colors font-medium text-sm">
          <Plus className="w-4 h-4 mr-2" /> Add Item
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Item Name</th>
              <th className="px-4 py-3 font-medium">Description / What to Enter</th>
              <th className="px-4 py-3 font-medium w-32">Cost (₹)</th>
              <th className="px-4 py-3 font-medium w-24">GST Rate %</th>
              <th className="px-4 py-3 font-medium w-32 text-green-700">GST Amount</th>
              <th className="px-4 py-3 font-medium w-32 text-green-700">Total incl. GST</th>
              <th className="px-4 py-3 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {machines.map((m) => {
              const gstAmt = (m.cost || 0) * ((m.gstRate || 0) / 100);
              const total = (m.cost || 0) + gstAmt;
              return (
                <tr key={m.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2">
                    <input type="text" value={m.name} onChange={(e) => handleChange(m.id, 'name', e.target.value)} className="w-full border-2 border-orange-200 rounded px-2 py-1 outline-none bg-orange-50 focus:border-accent-orange" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="text" value={m.desc || ''} onChange={(e) => handleChange(m.id, 'desc', e.target.value)} className="w-full border-2 border-orange-200 rounded px-2 py-1 outline-none bg-orange-50 focus:border-accent-orange" placeholder="Guidance text" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" value={m.cost || ''} onChange={(e) => handleChange(m.id, 'cost', parseFloat(e.target.value))} className="w-full border-2 border-orange-200 rounded px-2 py-1 bg-orange-50 focus:border-accent-orange outline-none" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" value={m.gstRate || ''} onChange={(e) => handleChange(m.id, 'gstRate', parseFloat(e.target.value))} className="w-full border-2 border-orange-200 rounded px-2 py-1 bg-orange-50 focus:border-accent-orange outline-none" />
                  </td>
                  <td className="px-4 py-3 font-semibold text-green-700 bg-green-50 rounded">₹{gstAmt.toFixed(0)}</td>
                  <td className="px-4 py-3 font-semibold text-green-700 bg-green-100 rounded">₹{total.toFixed(0)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleRemove(m.id)} className="text-slate-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-green-100 border-t border-green-200 font-bold">
            <tr>
              <td colSpan="5" className="px-4 py-4 text-right text-green-900 uppercase tracking-wider text-sm">Total CapEx (incl. GST):</td>
              <td colSpan="2" className="px-4 py-4 text-xl text-green-700">₹{results.totalCapEx.toLocaleString('en-IN')}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-navy-800 mb-4">5-Year Straight-Line Depreciation Schedule</h3>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Annual Depreciation:</span>
              <span className="font-bold">₹{results.annualDepreciation.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Residual Value (Year 5):</span>
              <span className="font-bold">₹{Math.round(results.residualValue).toLocaleString('en-IN')}</span>
            </div>
          </div>
          
          <table className="w-full mt-4 text-xs text-left">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="py-2 px-2">Year</th>
                <th className="py-2 px-2">Opening Value</th>
                <th className="py-2 px-2">Annual Dep</th>
                <th className="py-2 px-2">Accum. Dep</th>
                <th className="py-2 px-2">Closing Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {results.depreciationSchedule.map((row) => (
                <tr key={row.year}>
                  <td className="py-2 px-2 font-medium">Y{row.year}</td>
                  <td className="py-2 px-2">₹{Math.round(row.openingValue).toLocaleString('en-IN')}</td>
                  <td className="py-2 px-2">₹{Math.round(row.depreciation).toLocaleString('en-IN')}</td>
                  <td className="py-2 px-2">₹{Math.round(row.accDepreciation).toLocaleString('en-IN')}</td>
                  <td className="py-2 px-2 font-bold text-navy-700">₹{Math.round(row.closingValue).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-[400px]">
          <h3 className="font-bold text-navy-800 mb-4">Depreciation Schedule Chart</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={results.depreciationSchedule}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="year" tickFormatter={(v) => `Year ${v}`} />
              <YAxis tickFormatter={(v) => `₹${v/1000}k`} />
              <Tooltip formatter={(value) => `₹${Math.round(value).toLocaleString('en-IN')}`} />
              <Bar dataKey="closingValue" fill="#0f172a" name="Closing Value" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Section2CapEx;
