import React, { useState } from 'react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine, 
  Cell 
} from 'recharts';
import { Info, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

const Section8RiskAnalysis = ({ state, results }) => {
  const [showSensitivity, setShowSensitivity] = useState(false);
  const [showScenario, setShowScenario] = useState(false);
  const { averageVendorRate, annualConsumables, totalCapEx, annualDepreciation, annualLabour, annualElectricity } = results;
  const { annualProductionVolume, discountRate, residualValuePercentage } = state;

  // Helper to simulate NPV and other metrics
  const simulateMetrics = (vendorRate, inkCost, volume) => {
    const annualVendorCost = vendorRate * volume;
    const totalOpex = annualLabour + annualElectricity + state.annualAMC + inkCost;
    const netSavings = annualVendorCost - totalOpex;
    
    const residualValue = totalCapEx * (residualValuePercentage / 100);
    let npv = 0;
    for (let t = 1; t <= 5; t++) {
      const netCashFlow = netSavings + (t === 5 ? residualValue : 0);
      npv += netCashFlow / Math.pow(1 + (discountRate / 100), t);
    }
    npv -= totalCapEx;
    
    const payback = netSavings > 0 ? (totalCapEx / netSavings) * 12 : 999;
    const costPerSqft = (totalOpex + annualDepreciation) / volume;
    const savingPercent = vendorRate > 0 ? ((vendorRate - costPerSqft) / vendorRate) * 100 : 0;

    return { npv, payback, savingPercent };
  };

  const baseNPV = results.npv;

  // A. Sensitivity Analysis
  const sensitivityData = [
    {
      variable: 'Vendor Rate',
      base: averageVendorRate,
      down: simulateMetrics(averageVendorRate * 0.8, annualConsumables, annualProductionVolume).npv,
      up: simulateMetrics(averageVendorRate * 1.2, annualConsumables, annualProductionVolume).npv,
    },
    {
      variable: 'Consumable Cost',
      base: annualConsumables,
      down: simulateMetrics(averageVendorRate, annualConsumables * 0.8, annualProductionVolume).npv,
      up: simulateMetrics(averageVendorRate, annualConsumables * 1.2, annualProductionVolume).npv,
    },
    {
      variable: 'Annual Volume',
      base: annualProductionVolume,
      down: simulateMetrics(averageVendorRate, annualConsumables * 0.8, annualProductionVolume * 0.8).npv,
      up: simulateMetrics(averageVendorRate, annualConsumables * 1.2, annualProductionVolume * 1.2).npv,
    }
  ];

  // B. Tornado Chart Data (Calculate swing and sort by biggest impact)
  const tornadoData = sensitivityData.map(d => ({
    name: d.variable,
    negativeSwing: d.down - baseNPV,
    positiveSwing: d.up - baseNPV,
    range: Math.abs(d.up - d.down)
  })).sort((a, b) => b.range - a.range);

  // Re-format for the stacked bar chart to show the swing around the base NPV (0 line represents Base NPV)
  const formatTornadoData = tornadoData.map(d => ({
    name: d.name,
    Downside: d.negativeSwing,
    Upside: d.positiveSwing
  }));

  // C. Scenario Analysis
  // Base volume is considered 100% for this mathematical exercise, but the user asked for 60, 75, 90.
  // We'll treat the current 'annualProductionVolume' as 100% capacity and test lower utilizations.
  const scenarios = [
    { label: '60% Utilisation', util: 0.60 },
    { label: '75% Utilisation', util: 0.75 },
    { label: '90% Utilisation', util: 0.90 }
  ].map(s => {
    const v = annualProductionVolume * s.util;
    const ink = annualConsumables * s.util;
    const metrics = simulateMetrics(averageVendorRate, ink, v);
    return { ...s, ...metrics };
  });

  return (
    <div className="space-y-8 animate-fadeIn text-slate-800">
      
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded text-yellow-800 text-sm flex items-start">
        <Info className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
        <p><strong>Guidance:</strong> This sheet evaluates the project's risk profile against adverse and favourable conditions. All charts automatically recalculate based on changes in previous sheets.</p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-navy-900">Sheet 9: Risk Analysis</h2>
        <p className="text-slate-500 text-sm mt-1">Sensitivity testing, NPV impacts, and scenario planning.</p>
      </div>

      {/* A & B: Sensitivity and Tornado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* A. Sensitivity Table */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center cursor-pointer mb-4" onClick={() => setShowSensitivity(!showSensitivity)}>
            <h3 className="text-lg font-bold text-slate-700 flex items-center">
              (A) Sensitivity Table (±20%)
              <span className="text-slate-400 text-xs ml-2 font-normal">(Click to {showSensitivity ? 'collapse' : 'expand'})</span>
            </h3>
            <button className="text-slate-400 hover:text-navy-900 transition-colors">
              {showSensitivity ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
          
          {showSensitivity && (
            <div className="animate-fadeIn">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Variable</th>
                    <th className="px-4 py-3 text-right">NPV at -20%</th>
                    <th className="px-4 py-3 text-right">NPV at +20%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sensitivityData.map(row => (
                    <tr key={row.variable} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-700">{row.variable}</td>
                      <td className={`px-4 py-3 text-right font-bold ${row.down < 0 ? 'text-red-500' : 'text-slate-700'}`}>
                        ₹{Math.round(row.down).toLocaleString('en-IN')}
                      </td>
                      <td className={`px-4 py-3 text-right font-bold ${row.up < 0 ? 'text-red-500' : 'text-slate-700'}`}>
                        ₹{Math.round(row.up).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded text-sm text-slate-600">
                <strong>Base NPV:</strong> <span className="font-bold text-slate-800">₹{Math.round(baseNPV).toLocaleString('en-IN')}</span>
              </div>
            </div>
          )}
        </div>

        {/* B. Tornado Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex flex-col">
          <h3 className="text-lg font-bold text-slate-700 mb-4">(B) Tornado Chart: NPV Impact Range</h3>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                layout="vertical"
                data={formatTornadoData}
                margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                <XAxis type="number" tickFormatter={(val) => `₹${Math.round(val / 1000)}k`} stroke="#94a3b8" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} width={100} />
                <Tooltip 
                  formatter={(value) => [`₹${Math.round(value).toLocaleString('en-IN')}`, 'NPV Swing']}
                  labelStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                />
                <ReferenceLine x={0} stroke="#475569" />
                <Bar dataKey="Downside" fill="#f87171" radius={[4, 0, 0, 4]} />
                <Bar dataKey="Upside" fill="#4ade80" radius={[0, 4, 4, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400 text-center mt-2">Chart displays the swing in Rs. relative to the Base NPV.</p>
        </div>

      </div>

      {/* C. Scenario Analysis */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex justify-between items-center cursor-pointer mb-4" onClick={() => setShowScenario(!showScenario)}>
          <h3 className="text-lg font-bold text-slate-700 flex items-center">
            (C) Scenario Analysis (Capacity Utilisation)
            <span className="text-slate-400 text-xs ml-2 font-normal">(Click to {showScenario ? 'collapse' : 'expand'})</span>
          </h3>
          <button className="text-slate-400 hover:text-navy-900 transition-colors">
            {showScenario ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
        
        {showScenario && (
          <div className="overflow-x-auto animate-fadeIn">
            <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Scenario</th>
                <th className="px-4 py-3">Resulting NPV</th>
                <th className="px-4 py-3">Payback Period</th>
                <th className="px-4 py-3">Cost Saving %</th>
                <th className="px-4 py-3">Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {scenarios.map(sc => (
                <tr key={sc.label} className="hover:bg-slate-50">
                  <td className="px-4 py-4 font-medium text-slate-700 flex items-center">
                    {sc.npv < 0 && <AlertTriangle className="w-4 h-4 text-amber-500 mr-2" />}
                    {sc.label}
                  </td>
                  <td className={`px-4 py-4 font-bold ${sc.npv > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    ₹{Math.round(sc.npv).toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-4 font-medium text-slate-700">
                    {sc.payback < 60 ? `${(sc.payback / 12).toFixed(1)} Yrs` : '> 5 Yrs'}
                  </td>
                  <td className={`px-4 py-4 font-medium ${sc.savingPercent >= 30 ? 'text-green-600' : 'text-slate-600'}`}>
                    {sc.savingPercent.toFixed(1)}%
                  </td>
                  <td className="px-4 py-4">
                    {sc.npv > 0 ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-bold text-xs">Viable</span>
                    ) : (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded font-bold text-xs">Not Viable</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

    </div>
  );
};

export default Section8RiskAnalysis;
