import React from 'react';
import { Info, CheckCircle, XCircle } from 'lucide-react';

// Basic IRR approximation function for the display (Dashboard uses a similar one)
function calculateIRR(cashFlows, guess = 0.1) {
  const maxTries = 100;
  let rate = guess;
  for (let i = 0; i < maxTries; i++) {
    let npv = 0;
    let dNpv = 0;
    for (let t = 0; t < cashFlows.length; t++) {
      npv += cashFlows[t] / Math.pow(1 + rate, t);
      dNpv -= (t * cashFlows[t]) / Math.pow(1 + rate, t + 1);
    }
    const newRate = rate - npv / dNpv;
    if (Math.abs(newRate - rate) < 0.0001) return newRate;
    rate = newRate;
  }
  return rate;
}

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
  } = results;

  // Reconstruct netAnnualSavings
  const annualVendorCost = averageVendorRate * annualProductionVolume;
  const netAnnualSavings = annualVendorCost - totalAnnualOpEx;

  // A. Annual OpEx summary
  const opexBreakdown = [
    { name: 'Staff Costs', value: annualLabour },
    { name: 'Electricity', value: annualElectricity },
    { name: 'Ink & Media', value: annualConsumables },
    { name: 'Annual AMC', value: state.annualAMC },
  ];

  // B. In-House Cost per sq.ft
  const totalCostForVolume = totalAnnualOpEx + annualDepreciation;

  // C. H1 Test Table
  const savingRs = averageVendorRate - inHouseCostPerSqft;
  const savingPercent = averageVendorRate > 0 ? (savingRs / averageVendorRate) * 100 : 0;
  const h1Verdict = savingPercent >= 30;

  // D. Net Annual Benefit
  // (annualVendorCost is already calculated above for netAnnualSavings)

  // E. 5-Year DCF Table
  const years = [0, 1, 2, 3, 4, 5];
  const residualValue = totalCapEx * (residualValuePercentage / 100);
  
  const dcfRows = years.map(year => {
    const benefit = year === 0 ? 0 : netAnnualSavings;
    const investment = year === 0 ? -totalCapEx : 0;
    const residual = year === 5 ? residualValue : 0;
    const netCashFlow = benefit + investment + residual;
    const pvFactor = 1 / Math.pow(1 + (discountRate / 100), year);
    const discountedCF = netCashFlow * pvFactor;
    return { year, benefit, investment, residual, netCashFlow, pvFactor, discountedCF };
  });

  let cumulative = 0;
  dcfRows.forEach(row => {
    cumulative += row.discountedCF;
    row.cumulativeDCF = cumulative;
  });

  // F. Capital Budgeting Results
  const cashFlows = dcfRows.map(r => r.netCashFlow);
  const npv = dcfRows.reduce((sum, r) => sum + r.discountedCF, 0);
  const irr = calculateIRR(cashFlows) * 100;
  const paybackMonths = netAnnualSavings > 0 ? (totalCapEx / netAnnualSavings) * 12 : 999;
  const pi = totalCapEx > 0 ? (npv + totalCapEx) / totalCapEx : 0;

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
        {/* A. Annual OpEx */}
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

        {/* B. In-house Cost per sq.ft */}
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

      {/* C. H1 Test Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-700 mb-4">(C) Hypothesis 1: Cost Savings Test</h3>
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Vendor Rate (per sq.ft)</th>
              <th className="px-4 py-3">In-House Rate (per sq.ft)</th>
              <th className="px-4 py-3">Saving (Rs.)</th>
              <th className="px-4 py-3">Saving (%)</th>
              <th className="px-4 py-3">Verdict (≥ 30% saving)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 font-medium text-slate-700">₹{averageVendorRate.toFixed(2)}</td>
              <td className="px-4 py-3 font-medium text-slate-700">₹{inHouseCostPerSqft.toFixed(2)}</td>
              <td className="px-4 py-3 font-bold text-green-600">₹{savingRs.toFixed(2)}</td>
              <td className="px-4 py-3 font-bold text-green-600">{savingPercent.toFixed(1)}%</td>
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
      </div>

      {/* D. Net Annual Benefit */}
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

      {/* E. 5-Year DCF Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 overflow-x-auto">
        <h3 className="text-lg font-bold text-slate-700 mb-4">(E) 5-Year Discounted Cash Flow (DCF) Table</h3>
        <table className="w-full text-sm text-right min-w-[800px]">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
            <tr>
              <th className="px-4 py-3 text-left">Cash Flow Element</th>
              {years.map(y => <th key={y} className="px-4 py-3">Year {y}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-4 py-2 text-left font-medium text-slate-600">Initial Investment (CapEx)</td>
              {dcfRows.map(r => <td key={r.year} className="px-4 py-2 text-red-500">{r.investment === 0 ? '-' : `₹${r.investment.toLocaleString('en-IN')}`}</td>)}
            </tr>
            <tr>
              <td className="px-4 py-2 text-left font-medium text-slate-600">Net Annual Benefit</td>
              {dcfRows.map(r => <td key={r.year} className="px-4 py-2 text-green-600">{r.benefit === 0 ? '-' : `₹${r.benefit.toLocaleString('en-IN')}`}</td>)}
            </tr>
            <tr>
              <td className="px-4 py-2 text-left font-medium text-slate-600">Residual Value</td>
              {dcfRows.map(r => <td key={r.year} className="px-4 py-2 text-green-600">{r.residual === 0 ? '-' : `₹${r.residual.toLocaleString('en-IN')}`}</td>)}
            </tr>
            <tr className="bg-slate-50 font-bold border-y border-slate-200">
              <td className="px-4 py-2 text-left text-slate-800">Net Cash Flow</td>
              {dcfRows.map(r => <td key={r.year} className="px-4 py-2 text-slate-800">₹{r.netCashFlow.toLocaleString('en-IN')}</td>)}
            </tr>
            <tr>
              <td className="px-4 py-2 text-left font-medium text-slate-600">PV Factor @ {discountRate}%</td>
              {dcfRows.map(r => <td key={r.year} className="px-4 py-2 text-slate-500">{r.pvFactor.toFixed(4)}</td>)}
            </tr>
            <tr className="font-bold text-accent-orange">
              <td className="px-4 py-2 text-left">Discounted Cash Flow</td>
              {dcfRows.map(r => <td key={r.year} className="px-4 py-2">₹{Math.round(r.discountedCF).toLocaleString('en-IN')}</td>)}
            </tr>
            <tr className="bg-navy-900 text-white font-black">
              <td className="px-4 py-3 text-left">Cumulative DCF</td>
              {dcfRows.map(r => <td key={r.year} className={`px-4 py-3 ${r.cumulativeDCF >= 0 ? 'text-green-400' : 'text-red-400'}`}>₹{Math.round(r.cumulativeDCF).toLocaleString('en-IN')}</td>)}
            </tr>
          </tbody>
        </table>
      </div>

      {/* F. Capital Budgeting Results */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-700 mb-4">(F) Capital Budgeting Results</h3>
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
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">IRR</span>
            <span className={`text-2xl font-black ${irr > discountRate ? 'text-green-600' : 'text-red-600'}`}>
              {irr.toFixed(1)}%
            </span>
            <div className={`mt-2 text-xs font-bold px-2 py-1 rounded ${irr > discountRate ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {irr > discountRate ? '✅ > Hurdle' : '❌ < Hurdle'}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-4 rounded flex flex-col items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Payback Period</span>
            <span className={`text-2xl font-black ${paybackMonths < 60 ? 'text-green-600' : 'text-red-600'}`}>
              {(paybackMonths / 12).toFixed(1)} Yrs
            </span>
            <div className={`mt-2 text-xs font-bold px-2 py-1 rounded ${paybackMonths < 60 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {paybackMonths < 60 ? '✅ Acceptable' : '❌ Too Long'}
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
