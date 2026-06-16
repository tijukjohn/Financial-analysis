import React from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Cell 
} from 'recharts';
import { AlertCircle } from 'lucide-react';

const Section6Dashboard = ({ state, updateState, results }) => {
  const { cashFlows, scenarios, sensitivities } = results;

  // Chart 1: Cost Comparison (In-House vs Vendor)
  const costComparisonData = [
    {
      name: 'Cost per Sq.Ft',
      'In-House': parseFloat(results.inHouseCostPerSqft.toFixed(2)),
      'Vendor': parseFloat(results.averageVendorRate.toFixed(2))
    }
  ];

  // Chart 3: Scenario Analysis Colors
  const getScenarioColor = (utilization) => {
    if (utilization === 60) return '#ef4444'; // red
    if (utilization === 75) return '#f59e0b'; // amber
    if (utilization === 90) return '#22c55e'; // green
    return '#3b82f6';
  };

  // Chart 4: Sensitivity Tornado Chart Data preparation
  const tornadoData = sensitivities.map(s => ({
    name: s.name,
    negativeSwing: parseFloat(s.swing__20?.toFixed(2) || s['swing_-20']?.toFixed(2) || 0),
    positiveSwing: parseFloat(s.swing_20?.toFixed(2) || 0)
  }));

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-800 text-sm flex items-start">
        <AlertCircle className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
        <p><strong>Do not manually edit this sheet.</strong> All values are pulled from Sheets 2–6. The only exceptions are the Annual Production Volume and Residual Value in Section B.</p>
      </div>

      <h2 className="text-3xl font-bold text-navy-900 border-b-2 border-slate-200 pb-2">Sheet 7: Financial Model & Results</h2>

      {/* (B) Manual Inputs */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-navy-800 mb-4">(B) Key Financial Parameters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-orange-50 p-4 rounded border-2 border-orange-200 flex justify-between items-center">
            <div>
              <p className="font-semibold text-slate-800">Annual Production Volume (sq.ft)</p>
              <p className="text-xs text-slate-500">Total expected print volume per year</p>
            </div>
            <input 
              type="number" 
              value={state.annualProductionVolume} 
              onChange={(e) => updateState('annualProductionVolume', parseFloat(e.target.value))}
              className="w-32 bg-white border-2 border-orange-300 rounded px-3 py-2 text-lg font-bold text-accent-orange outline-none focus:border-accent-orange text-right"
            />
          </div>
          <div className="bg-orange-50 p-4 rounded border-2 border-orange-200 flex justify-between items-center">
            <div>
              <p className="font-semibold text-slate-800">Residual Value (%)</p>
              <p className="text-xs text-slate-500">Scrap value of machines after 5 years (Default 15%)</p>
            </div>
            <div className="flex items-center">
              <input 
                type="number" 
                value={state.residualValuePercentage} 
                onChange={(e) => updateState('residualValuePercentage', parseFloat(e.target.value))}
                className="w-24 bg-white border-2 border-orange-300 rounded px-3 py-2 text-lg font-bold text-accent-orange outline-none focus:border-accent-orange text-right mr-2"
              />
              <span className="font-bold text-slate-600">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* (C) Annual OpEx Summary & (D) H1 Cost Comparison side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-navy-800 mb-4">(C) Annual OpEx Summary</h3>
          <table className="w-full text-sm text-left">
            <tbody className="divide-y divide-slate-100">
              <tr className="bg-green-50"><td className="py-2 px-3">Consumables (Ink & Media)</td><td className="py-2 px-3 text-right font-medium">₹{results.annualConsumables.toLocaleString('en-IN')}</td></tr>
              <tr className="bg-green-50"><td className="py-2 px-3">Electricity</td><td className="py-2 px-3 text-right font-medium">₹{Math.round(results.annualElectricity).toLocaleString('en-IN')}</td></tr>
              <tr className="bg-green-50"><td className="py-2 px-3">Labour / Staff</td><td className="py-2 px-3 text-right font-medium">₹{Math.round(results.annualLabour).toLocaleString('en-IN')}</td></tr>
              <tr className="bg-green-50"><td className="py-2 px-3">AMC (Maintenance)</td><td className="py-2 px-3 text-right font-medium">₹{state.annualAMC.toLocaleString('en-IN')}</td></tr>
            </tbody>
            <tfoot className="border-t-2 border-slate-200">
              <tr className="bg-green-100 font-bold text-green-800">
                <td className="py-3 px-3 uppercase text-xs tracking-wider">Total Annual OpEx</td>
                <td className="py-3 px-3 text-right text-lg">₹{Math.round(results.totalAnnualOpEx).toLocaleString('en-IN')}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex flex-col">
          <h3 className="text-lg font-bold text-navy-800 mb-4">(D) H1: Cost Comparison</h3>
          <div className="flex-1 grid grid-cols-2 gap-4 mb-4">
            <div className="bg-green-50 p-4 rounded text-center border border-green-100">
              <p className="text-xs text-green-600 font-bold uppercase mb-1">In-House Cost/Sq.Ft</p>
              <p className="text-3xl font-black text-green-700">₹{results.inHouseCostPerSqft.toFixed(2)}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded text-center border border-orange-100">
              <p className="text-xs text-orange-600 font-bold uppercase mb-1">Vendor Cost/Sq.Ft</p>
              <p className="text-3xl font-black text-orange-700">₹{results.averageVendorRate.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex justify-between items-center bg-slate-50 p-4 rounded border">
            <div>
              <p className="text-sm text-slate-500">Savings</p>
              <p className="text-lg font-bold">₹{results.savingPerSqFt.toFixed(2)}/sq.ft ({results.savingPercent.toFixed(1)}%)</p>
            </div>
            <div className={`px-4 py-2 rounded font-bold ${results.h1Verdict ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              H1 Verdict: {results.h1Verdict ? '✅ Confirmed' : '❌ Not Confirmed'}
            </div>
          </div>
        </div>
      </div>

      {/* Chart 1 & Chart 2 side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[350px]">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-full flex flex-col">
          <h3 className="text-sm font-bold text-navy-800 mb-2">Chart 1: Cost Comparison per Sq.Ft</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={costComparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(val) => `₹${val}`} />
              <Legend />
              <Bar dataKey="In-House" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Vendor" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-full flex flex-col">
          <h3 className="text-sm font-bold text-navy-800 mb-2">Chart 2: 5-Year Cumulative DCF</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[{ year: 0, cumulativeDcf: -results.totalCapEx }, ...cashFlows]} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" tickFormatter={(v) => `Yr ${v}`} />
              <YAxis tickFormatter={(v) => `₹${v/1000}k`} />
              <Tooltip formatter={(val) => `₹${Math.round(val).toLocaleString('en-IN')}`} />
              <ReferenceLine y={0} stroke="red" strokeDasharray="3 3" />
              <Line type="monotone" dataKey="cumulativeDcf" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} name="Cumulative DCF" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>



      {/* (F) Capital Budgeting Results */}
      <div className="bg-navy-900 text-white rounded-lg shadow-xl p-8">
        <h3 className="text-xl font-bold mb-6 text-accent-orange border-b border-navy-700 pb-2">(F) Capital Budgeting Results</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <p className="text-slate-400 text-sm uppercase tracking-wide mb-1">Net Present Value (NPV)</p>
            <p className={`text-4xl font-black ${results.npv > 0 ? 'text-green-400' : 'text-red-400'}`}>
              ₹{Math.round(results.npv).toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-slate-500 mt-2">Value added in today's terms</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm uppercase tracking-wide mb-1">Internal Rate of Return</p>
            <p className={`text-4xl font-black ${results.irr > state.discountRate ? 'text-green-400' : 'text-red-400'}`}>
              {results.irr.toFixed(1)}%
            </p>
            <p className="text-xs text-slate-500 mt-2">Hurdle rate: {state.discountRate}%</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm uppercase tracking-wide mb-1">Payback Period</p>
            <p className={`text-4xl font-black ${results.paybackMonths < 60 ? 'text-green-400' : 'text-red-400'}`}>
              {results.paybackMonths > 60 ? '> 5 Yrs' : `${(results.paybackMonths/12).toFixed(1)} Yrs`}
            </p>
            <p className="text-xs text-slate-500 mt-2">{Math.round(results.paybackMonths)} months</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm uppercase tracking-wide mb-1">Profitability Index</p>
            <p className={`text-4xl font-black ${results.pi > 1 ? 'text-green-400' : 'text-red-400'}`}>
              {results.pi.toFixed(2)}
            </p>
            <p className="text-xs text-slate-500 mt-2">Ratio &gt; 1 indicates value creation</p>
          </div>
        </div>
        <div className="mt-8 p-4 rounded-lg bg-navy-800 border border-navy-700 flex justify-between items-center">
          <div>
            <h4 className="font-bold text-lg">H2 Verdict: Feasibility</h4>
            <p className="text-sm text-slate-400">Determined by positive NPV and IRR &gt; Discount Rate</p>
          </div>
          <div className={`px-6 py-3 rounded-full font-bold text-lg ${results.h2Verdict ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
            {results.h2Verdict ? '✅ Project is Viable' : '❌ Project is Not Viable'}
          </div>
        </div>
      </div>

      {/* The detailed Cash Flow Table and Risk Analysis have been moved to Sheets 8 and 9 respectively to reduce cognitive complexity on the Dashboard. */}
    </div>
  );
};

export default Section6Dashboard;
