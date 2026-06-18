import React from 'react';
import { Info, CheckCircle, XCircle } from 'lucide-react';

const Section7FinancialCalc = ({ state, results }) => {
  const { discountRate, annualProductionVolume, residualValuePercentage } = state;
  const {
    totalCapEx,
    annualDepreciation,
    totalAnnualOpEx,
    inHouseCostPerSqft,
    averageVendorRate,
    annualLabour,
    annualElectricity,
    annualConsumables,
    savingPerSqFt,
    savingPercent,
    h1Verdict,
    cashFlows,
    npv,
    irr,
    paybackMonths,
    pi,
    h2Verdict,
    materialWiseBreakdown,
    sharedConsumableCostPerSqFt
  } = results;

  const annualVendorCost = averageVendorRate * annualProductionVolume;
  const netAnnualSavings = annualVendorCost - totalAnnualOpEx;

  const opexBreakdown = [
    { name: 'Staff Costs', value: annualLabour },
    { name: 'Electricity', value: annualElectricity },
    { name: 'Ink & Media', value: annualConsumables },
    { name: 'Annual AMC', value: state.annualAMC || 0 },
  ];

  return (
    <div className="space-y-8 animate-fadeIn text-slate-800">
      
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded text-yellow-800 text-sm flex items-start">
        <Info className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
        <p><strong>Guidance:</strong> This sheet transparently outlines the mathematical engine behind the feasibility study. No inputs are required here.</p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-navy-900">Sheet 8: Financial Calculations</h2>
        <p className="text-slate-500 text-sm mt-1">Detailed breakdown of operational expenses, cost per sq.ft, and capital budgeting.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-700 mb-4">(A) Annual OpEx Summary</h3>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-slate-100">
              {opexBreakdown.map(item => (
                <tr key={item.name}>
                  <td className="py-2 text-slate-600">{item.name}</td>
                  <td className="py-2 text-right font-medium text-slate-800">₹{item.value.toLocaleString('en-IN')}</td>
                </tr>
              ))}
              <tr className="bg-slate-50">
                <td className="py-3 font-bold text-slate-800 px-2">Total Annual OpEx</td>
                <td className="py-3 text-right font-bold text-red-600 px-2">₹{totalAnnualOpEx.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-700 mb-4">(B) In-House Cost per sq.ft</h3>
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded text-sm text-center border border-slate-100">
              <span className="text-slate-500">( Annual OpEx + Annual Depreciation ) ÷ Annual Production Volume</span>
            </div>
            <div className="flex items-center justify-center space-x-4 text-sm font-medium text-slate-600">
              <span>( ₹{totalAnnualOpEx.toLocaleString('en-IN')}</span>
              <span>+</span>
              <span>₹{annualDepreciation.toLocaleString('en-IN')} )</span>
              <span>÷</span>
              <span>{annualProductionVolume.toLocaleString('en-IN')} sq.ft</span>
            </div>
            <div className="text-center pt-2 border-t border-slate-100">
              <span className="text-4xl font-black text-accent-orange">₹{inHouseCostPerSqft.toFixed(2)}</span>
              <span className="text-slate-500 ml-2">/ sq.ft</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-700 mb-4">(C) Hypothesis 1: Cost Savings Test</h3>
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Average Vendor Rate</th>
              <th className="px-4 py-3">Average In-House Rate</th>
              <th className="px-4 py-3">Saving (Rs.)</th>
              <th className="px-4 py-3">Saving (%)</th>
              <th className="px-4 py-3">Verdict (≥ 30% saving)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 font-medium text-slate-700">₹{averageVendorRate.toFixed(2)}</td>
              <td className="px-4 py-3 font-medium text-slate-700">₹{inHouseCostPerSqft.toFixed(2)}</td>
              <td className="px-4 py-3 font-bold text-green-600">₹{(savingPerSqFt || 0).toFixed(2)}</td>
              <td className="px-4 py-3 font-bold text-green-600">{(savingPercent || 0).toFixed(1)}%</td>
              <td className="px-4 py-3">
                {h1Verdict ? (
                  <div className="flex items-center text-green-600 font-bold bg-green-50 px-2 py-1 rounded inline-flex">
                    <CheckCircle className="w-4 h-4 mr-2" /> Confirmed
                  </div>
                ) : (
                  <div className="flex items-center text-red-600 font-bold bg-red-50 px-2 py-1 rounded inline-flex">
                    <XCircle className="w-4 h-4 mr-2" /> Not Confirmed
                  </div>
                )}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="mt-4 text-sm text-slate-500">
          <p>See the table below for a detailed breakdown of savings by material type.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-700 mb-4">Material-Wise Cost Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left min-w-[800px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Material</th>
                <th className="px-4 py-3 text-right">Vendor Rate</th>
                <th className="px-4 py-3 text-right">Consumable Cost</th>
                <th className="px-4 py-3 text-right">Allocated Fixed OpEx</th>
                <th className="px-4 py-3 text-right font-bold">Total In-House</th>
                <th className="px-4 py-3 text-right font-bold text-green-600">Saving / Sq.Ft</th>
                <th className="px-4 py-3 text-right font-bold text-green-600">Saving %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(materialWiseBreakdown || []).map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-4 py-2 font-medium">{row.name}</td>
                  <td className="px-4 py-2 text-right">₹{row.vendorRate.toFixed(2)}</td>
                  <td className="px-4 py-2 text-right">₹{row.consumableCost.toFixed(2)}</td>
                  <td className="px-4 py-2 text-right">₹{row.allocatedFixedOpEx.toFixed(2)}</td>
                  <td className="px-4 py-2 text-right font-bold">₹{row.inHouseCost.toFixed(2)}</td>
                  <td className="px-4 py-2 text-right font-bold text-green-600">₹{row.savingRs.toFixed(2)}</td>
                  <td className="px-4 py-2 text-right font-bold text-green-600">{row.savingPercent.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-xs text-slate-500">
          <p>* Shared consumables (₹{(sharedConsumableCostPerSqFt || 0).toFixed(2)}/sq.ft) that were not matched to a specific material are distributed evenly across all materials.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-700 mb-4">(D) Net Annual Benefit</h3>
        <div className="flex items-center justify-between bg-slate-50 p-4 rounded border border-slate-100">
          <div className="text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Annual Vendor Cost</p>
            <p className="text-xl font-medium text-slate-700">₹{annualVendorCost.toLocaleString('en-IN')}</p>
          </div>
          <div className="text-2xl font-black text-slate-300">-</div>
          <div className="text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Annual OpEx</p>
            <p className="text-xl font-medium text-slate-700">₹{totalAnnualOpEx.toLocaleString('en-IN')}</p>
          </div>
          <div className="text-2xl font-black text-slate-300">=</div>
          <div className="text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Net Annual Benefit</p>
            <p className="text-2xl font-black text-green-600">₹{netAnnualSavings.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 overflow-x-auto">
        <h3 className="text-lg font-bold text-slate-700 mb-4">(E) 5-Year Discounted Cash Flow (DCF) Table</h3>
        <table className="w-full text-sm text-right min-w-[800px]">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
            <tr>
              <th className="px-4 py-3 text-left">Cash Flow Element</th>
              <th className="px-4 py-3">Year 0</th>
              {[1,2,3,4,5].map(y => <th key={y} className="px-4 py-3">Year {y}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-4 py-2 text-left font-medium text-slate-600">Initial Investment (CapEx)</td>
              <td className="px-4 py-2 text-red-500">₹{-totalCapEx.toLocaleString('en-IN')}</td>
              {[1,2,3,4,5].map(y => <td key={y} className="px-4 py-2 text-red-500">-</td>)}
            </tr>
            <tr>
              <td className="px-4 py-2 text-left font-medium text-slate-600">Net Annual Benefit</td>
              <td className="px-4 py-2 text-green-600">-</td>
              {cashFlows.map(r => <td key={r.year} className="px-4 py-2 text-green-600">₹{r.netBenefit.toLocaleString('en-IN')}</td>)}
            </tr>
            <tr>
              <td className="px-4 py-2 text-left font-medium text-slate-600">Residual Value</td>
              <td className="px-4 py-2 text-green-600">-</td>
              {cashFlows.map(r => <td key={r.year} className="px-4 py-2 text-green-600">{r.residualValue === 0 ? '-' : `₹${r.residualValue.toLocaleString('en-IN')}`}</td>)}
            </tr>
            <tr className="bg-slate-50 font-bold border-y border-slate-200">
              <td className="px-4 py-2 text-left text-slate-800">Net Cash Flow</td>
              <td className="px-4 py-2 text-slate-800">₹{-totalCapEx.toLocaleString('en-IN')}</td>
              {cashFlows.map(r => <td key={r.year} className="px-4 py-2 text-slate-800">₹{r.netCashFlow.toLocaleString('en-IN')}</td>)}
            </tr>
            <tr className="bg-slate-50 font-bold border-b border-slate-200">
              <td className="px-4 py-2 text-left text-slate-800">Cumulative Net Cash Flow</td>
              <td className="px-4 py-2 text-slate-800">₹{-totalCapEx.toLocaleString('en-IN')}</td>
              {cashFlows.map(r => <td key={r.year} className={`px-4 py-2 ${r.cumulativeNetCashFlow - totalCapEx >= 0 ? 'text-green-600' : 'text-slate-800'}`}>₹{(r.cumulativeNetCashFlow - totalCapEx).toLocaleString('en-IN')}</td>)}
            </tr>
            <tr>
              <td className="px-4 py-2 text-left font-medium text-slate-600">PV Factor @ {discountRate}%</td>
              <td className="px-4 py-2 text-slate-500">1.0000</td>
              {cashFlows.map(r => <td key={r.year} className="px-4 py-2 text-slate-500">{r.pvFactor.toFixed(4)}</td>)}
            </tr>
            <tr className="font-bold text-accent-orange">
              <td className="px-4 py-2 text-left">Discounted Cash Flow</td>
              <td className="px-4 py-2">₹{-totalCapEx.toLocaleString('en-IN')}</td>
              {cashFlows.map(r => <td key={r.year} className="px-4 py-2">₹{Math.round(r.dcf).toLocaleString('en-IN')}</td>)}
            </tr>
            <tr className="bg-navy-900 text-white font-black">
              <td className="px-4 py-3 text-left">Cumulative DCF (NPV)</td>
              <td className="px-4 py-3 text-red-400">₹{-totalCapEx.toLocaleString('en-IN')}</td>
              {cashFlows.map(r => <td key={r.year} className={`px-4 py-3 ${r.cumulativeDcf >= 0 ? 'text-green-400' : 'text-red-400'}`}>₹{Math.round(r.cumulativeDcf).toLocaleString('en-IN')}</td>)}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-700 mb-4">(F) Capital Budgeting Results</h3>
        
        <div className="mb-6 p-4 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
          <div>
            <span className="font-bold text-slate-800">Hypothesis 2: Project Viability</span>
            <p className="text-sm text-slate-500 mt-1">Verdict condition: NPV &gt; 0 AND Payback Period ≤ 60 months.</p>
          </div>
          <div className={`px-4 py-2 rounded font-bold text-lg ${h2Verdict ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {h2Verdict ? '✅ Supported' : '❌ Not Supported'}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-slate-50 border border-slate-100 p-4 rounded flex flex-col items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">NPV</span>
            <span className={`text-2xl font-black ${npv > 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{Math.round(npv).toLocaleString('en-IN')}
            </span>
            <div className={`mt-2 text-xs font-bold px-2 py-1 rounded ${npv > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {npv > 0 ? '✅ Accept' : '❌ Reject'}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-4 rounded flex flex-col items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Payback Period</span>
            <span className={`text-2xl font-black ${paybackMonths <= 60 ? 'text-green-600' : 'text-red-600'}`}>
              {paybackMonths > 60 ? 'Beyond 5 Yrs' : `${(paybackMonths / 12).toFixed(1)} Yrs`}
            </span>
            <div className={`mt-2 text-xs font-bold px-2 py-1 rounded ${paybackMonths <= 60 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {paybackMonths <= 60 ? '✅ ≤ 60 Months' : '❌ > 60 Months'}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-4 rounded flex flex-col items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">IRR</span>
            <span className={`text-2xl font-black ${irr > discountRate ? 'text-green-600' : 'text-slate-600'}`}>
              {isNaN(irr) || irr === Infinity ? 'N/A' : `${irr.toFixed(1)}%`}
            </span>
            <div className={`mt-2 text-xs font-bold px-2 py-1 rounded ${irr > discountRate ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-700'}`}>
              {irr > discountRate ? '✅ > Hurdle' : 'Supporting Metric'}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-4 rounded flex flex-col items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Profitability Index</span>
            <span className={`text-2xl font-black ${pi > 1 ? 'text-green-600' : 'text-red-600'}`}>
              {pi.toFixed(2)}
            </span>
            <div className={`mt-2 text-xs font-bold px-2 py-1 rounded ${pi > 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {pi > 1 ? '✅ Accept' : '❌ Reject'}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Section7FinancialCalc;
