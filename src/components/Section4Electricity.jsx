import React from 'react';
import { Info } from 'lucide-react';

const Section4Electricity = ({ state, updateState, results }) => {
  const { electricity } = state;

  const handleChange = (id, field, value) => {
    updateState('electricity', electricity.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded text-yellow-800 text-sm flex items-start">
        <Info className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
        <p><strong>Guidance:</strong> Since the unit is pre-operational, electricity cost is estimated using machine power ratings and assumed running hours — consistent with Yudistira (2024) methodology.</p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-navy-900">Sheet 5: Electricity Cost (Estimated)</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-slate-700">KSEB Commercial Tariff</h3>
            <p className="text-sm text-slate-500">₹ per kWh</p>
          </div>
          <input 
            type="number" step="0.1"
            value={state.ksebTariff} 
            onChange={(e) => updateState('ksebTariff', parseFloat(e.target.value))}
            className="w-24 border-2 border-orange-200 rounded px-3 py-2 text-lg font-bold text-navy-900 outline-none focus:border-accent-orange bg-orange-50 text-right"
          />
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-slate-700">Working Days</h3>
            <p className="text-sm text-slate-500">Days per month (Default 26)</p>
          </div>
          <input 
            type="number" 
            value={state.workingDays} 
            onChange={(e) => updateState('workingDays', parseInt(e.target.value))}
            className="w-24 border-2 border-orange-200 rounded px-3 py-2 text-lg font-bold text-navy-900 outline-none focus:border-accent-orange bg-orange-50 text-right"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
            <tr>
              <th className="px-6 py-3 font-medium">Machine / Area</th>
              <th className="px-6 py-3 font-medium w-32">Power Rating (kW)</th>
              <th className="px-6 py-3 font-medium w-32">Daily Running Hours</th>
              <th className="px-6 py-3 font-medium w-32 text-green-700">Monthly kWh</th>
              <th className="px-6 py-3 font-medium w-32 text-green-700">Monthly Cost (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {electricity.map((item) => {
              const dailyKwh = (item.power || 0) * (item.hours || 0);
              const monthlyKwh = dailyKwh * state.workingDays;
              const cost = monthlyKwh * state.ksebTariff;
              return (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-6 py-3 font-medium text-slate-700">{item.name}</td>
                  <td className="px-6 py-2">
                    <input type="number" step="0.1" value={item.power || ''} onChange={(e) => handleChange(item.id, 'power', parseFloat(e.target.value))} className="w-full border-2 border-orange-200 rounded px-2 py-1 bg-orange-50 outline-none focus:border-accent-orange" />
                  </td>
                  <td className="px-6 py-2">
                    <input type="number" step="0.5" value={item.hours || ''} onChange={(e) => handleChange(item.id, 'hours', parseFloat(e.target.value))} className="w-full border-2 border-orange-200 rounded px-2 py-1 bg-orange-50 outline-none focus:border-accent-orange" />
                  </td>
                  <td className="px-6 py-3 font-semibold text-green-700 bg-green-50 rounded">{monthlyKwh.toFixed(1)}</td>
                  <td className="px-6 py-3 font-semibold text-green-700 bg-green-100 rounded">₹{cost.toFixed(0)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-green-100 border-t border-green-200 font-bold">
            <tr>
              <td colSpan="4" className="px-6 py-4 text-right text-green-900 uppercase tracking-wider text-sm">Total Monthly Electricity:</td>
              <td className="px-6 py-4 text-xl text-green-700">₹{Math.round(results.monthlyElectricity).toLocaleString('en-IN')}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default Section4Electricity;
