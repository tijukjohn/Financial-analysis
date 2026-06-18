import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Trash2, Info, ChevronDown, ChevronUp } from 'lucide-react';

const Section2CapEx = ({ state, updateState, results }) => {
  const { machines, isGSTClaimable } = state;
  const [showDepreciation, setShowDepreciation] = useState(false);

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
      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded text-amber-800 text-sm flex items-start">
        <Info className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold mb-1">What to enter here:</p>
          <p>Enter the pre-GST cost and applicable GST rate for each machine or item below. Capital expenditure covers equipment, installation, and infrastructure. Orange fields are manual inputs.</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">Sheet 3: Enter the cost of each machine to calculate total capital investment.</h2>
        </div>
        <button onClick={handleAdd} className="flex items-center px-4 py-2 bg-accent-orange text-white rounded hover:bg-accent-orange-hover transition-colors font-medium text-sm">
          <Plus className="w-4 h-4 mr-2" /> Add Item
        </button>
      </div>

      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div>
          <h3 className="font-bold text-slate-800 flex items-center">
            GST Input Tax Credit Available?
            <div className="group relative ml-2">
              <Info className="w-4 h-4 text-slate-400 cursor-help" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-navy-900 text-white text-xs rounded shadow-lg z-10 text-center">
                Confirm with your accountant whether GDMR is registered under the regular GST scheme (ITC claimable) or composition scheme (ITC not available) before changing this.
              </div>
            </div>
          </h3>
          <p className="text-sm font-medium mt-1">
            {isGSTClaimable ? (
              <span className="text-green-600">Yes - ITC claimable</span>
            ) : (
              <span className="text-slate-500">No - GST is a real cost</span>
            )}
          </p>
        </div>
        <button
          onClick={() => updateState('isGSTClaimable', !isGSTClaimable)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isGSTClaimable ? 'bg-green-500' : 'bg-slate-300'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isGSTClaimable ? 'translate-x-6' : 'translate-x-1'}`} />
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
              <th className="px-4 py-3 font-medium w-32 text-green-700">
                {isGSTClaimable ? 'GST (recoverable via ITC - excluded from CapEx)' : 'GST Amount'}
              </th>
              <th className="px-4 py-3 font-medium w-32 text-green-700">
                {isGSTClaimable ? 'Net Cost (Excl. GST)' : 'Total incl. GST'}
              </th>
              <th className="px-4 py-3 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {machines.map((m) => {
              const gstAmt = (m.cost || 0) * ((m.gstRate || 0) / 100);
              const total = (m.cost || 0) + (isGSTClaimable ? 0 : gstAmt);
              return (
                <tr key={m.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2">
                    <input type="text" placeholder="e.g. Eco-Solvent Printer" value={m.name} onChange={(e) => handleChange(m.id, 'name', e.target.value)} className="w-full border-2 border-orange-200 rounded px-2 py-1 outline-none bg-orange-50 focus:border-accent-orange" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="text" value={m.desc || ''} onChange={(e) => handleChange(m.id, 'desc', e.target.value)} className="w-full border-2 border-orange-200 rounded px-2 py-1 outline-none bg-orange-50 focus:border-accent-orange" placeholder="Guidance text" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" placeholder="450000" value={m.cost || ''} onChange={(e) => handleChange(m.id, 'cost', parseFloat(e.target.value))} className="w-full border-2 border-orange-200 rounded px-2 py-1 bg-orange-50 focus:border-accent-orange outline-none" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" placeholder="18" value={m.gstRate || ''} onChange={(e) => handleChange(m.id, 'gstRate', parseFloat(e.target.value))} className="w-full border-2 border-orange-200 rounded px-2 py-1 bg-orange-50 focus:border-accent-orange outline-none" />
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
              <td colSpan="5" className="px-4 py-4 text-right text-green-900 uppercase tracking-wider text-sm">
                {isGSTClaimable ? 'Total CapEx (Excl. GST):' : 'Total CapEx (incl. GST):'}
              </td>
              <td colSpan="2" className="px-4 py-4 text-xl text-green-700">₹{results.totalCapEx.toLocaleString('en-IN')}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setShowDepreciation(!showDepreciation)}>
          <h3 className="font-bold text-navy-800 flex items-center">
            5-Year Straight-Line Depreciation Schedule
            <span className="text-slate-400 text-xs ml-2 font-normal">(Click to {showDepreciation ? 'collapse' : 'expand'})</span>
          </h3>
          <button className="text-slate-400 hover:text-navy-900 transition-colors">
            {showDepreciation ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
        
        {showDepreciation && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 animate-fadeIn">
            <div>
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

            <div className="h-[300px]">
              <h4 className="font-bold text-slate-700 mb-2 text-sm">Depreciation Value Chart</h4>
              <ResponsiveContainer width="100%" height="90%">
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
        )}
      </div>
    </div>
  );
};

export default Section2CapEx;
