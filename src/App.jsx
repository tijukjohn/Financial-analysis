import { useState, useEffect } from 'react';
import { defaultState } from './store/initialState';
import { calculateTotals } from './utils/calculations';
import { 
  BarChart,
  FileText, 
  Printer, 
  Droplets, 
  Zap, 
  Users, 
  LineChart, 
  Printer as PrintIcon,
  AlertTriangle
} from 'lucide-react';

import Section1MaterialRates from './components/Section1MaterialRates';
import Section2Invoices from './components/Section2Invoices';
import Section2CapEx from './components/Section2CapEx';
import Section3InkMedia from './components/Section3InkMedia';
import Section4Electricity from './components/Section4Electricity';
import Section5Staff from './components/Section5Staff';
import Section7FinancialCalc from './components/Section7FinancialCalc';
import Section8RiskAnalysis from './components/Section8RiskAnalysis';

function App() {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem('gdmr_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Version migration check: look for materialRates to ensure they are on newest version
        if (!parsed.materialRates || parsed.vendors || !parsed.invoices || !Array.isArray(parsed.inkMedia)) {
          console.log('Old state version detected. Resetting to default state.');
          return defaultState;
        }
        return parsed;
      }
    } catch (e) {
      console.error("Failed to parse state", e);
    }
    return defaultState;
  });

  const [activeTab, setActiveTab] = useState(1);

  useEffect(() => {
    localStorage.setItem('gdmr_state', JSON.stringify(state));
  }, [state]);

  const updateState = (key, value) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const results = calculateTotals(state);

  const tabs = [
    { id: 1, name: 'Material Rates', icon: BarChart },
    { id: 2, name: 'Vendor Invoices', icon: FileText },
    { id: 3, name: 'Machine Costs', icon: Printer },
    { id: 4, name: 'Ink & Media', icon: Droplets },
    { id: 5, name: 'Electricity', icon: Zap },
    { id: 6, name: 'Staff Costs', icon: Users },
    { id: 7, name: 'Financial Calculations', icon: FileText },
    { id: 8, name: 'Risk Analysis', icon: AlertTriangle },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden text-slate-800">
      {/* Sidebar */}
      <div className="w-64 bg-navy-900 text-white flex flex-col shadow-xl z-10 shrink-0">
        <div className="p-6">
          <h1 className="text-xl font-bold text-accent-orange leading-tight">GDMR Foundation</h1>
          <p className="text-xs text-slate-400 mt-1">In-House Printing Unit Feasibility</p>
        </div>
        
        <nav className="flex-1 mt-4 overflow-y-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-6 py-4 text-left transition-colors ${
                  isActive 
                    ? 'bg-navy-800 border-r-4 border-accent-orange text-white' 
                    : 'text-slate-300 hover:bg-navy-800 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 shrink-0 ${isActive ? 'text-accent-orange' : 'text-slate-400'}`} />
                <span className="font-medium text-sm leading-tight">{tab.name}</span>
              </button>
            );
          })}
        </nav>
        
        <div className="p-6 border-t border-navy-700 shrink-0">
          <button 
            onClick={() => window.print()}
            className="w-full flex items-center justify-center py-2 px-4 bg-slate-700 hover:bg-slate-600 rounded text-sm transition-colors"
          >
            <PrintIcon className="w-4 h-4 mr-2 shrink-0" />
            Export / Print
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Summary Bar */}
        <div className="bg-white border-b shadow-sm px-6 py-4 flex justify-between items-center shrink-0 z-0">
          <div className="flex space-x-8">
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">Total CapEx</p>
              <p className="text-lg font-bold">₹{results.totalCapEx.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">Cost/Sq.Ft</p>
              <p className="text-lg font-bold">
                <span className="text-accent-orange">₹{results.inHouseCostPerSqft.toFixed(2)}</span>
                <span className="text-slate-400 text-sm font-normal mx-1">vs</span>
                <span className="text-slate-600">₹{results.averageVendorRate.toFixed(2)}</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">NPV</p>
              <p className={`text-lg font-bold ${results.npv > 0 ? 'text-green-600' : 'text-red-500'}`}>
                ₹{Math.round(results.npv).toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">IRR</p>
              <p className={`text-lg font-bold ${results.irr > state.discountRate ? 'text-green-600' : 'text-red-500'}`}>
                {isNaN(results.irr) ? 'N/A' : `${results.irr.toFixed(1)}%`}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">Payback</p>
              <p className={`text-lg font-bold ${results.paybackMonths < 60 ? 'text-green-600' : 'text-red-500'}`}>
                {results.paybackMonths > 60 ? '>5 Yrs' : `${(results.paybackMonths/12).toFixed(1)} Yrs`}
              </p>
            </div>
          </div>
          <div className="flex space-x-3 text-sm font-medium">
            <div className={`px-3 py-1 rounded-full ${results.h1Verdict ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              H1: {results.h1Verdict ? '✅ Confirmed' : '❌ Not Confirmed'}
            </div>
            <div className={`px-3 py-1 rounded-full ${results.h2Verdict ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              H2: {results.h2Verdict ? '✅ Viable' : '❌ Not Viable'}
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50 print:p-0 print:overflow-visible">
          <div className="max-w-7xl mx-auto pb-20">
            {activeTab === 1 && <Section1MaterialRates state={state} updateState={updateState} results={results} />}
            {activeTab === 2 && <Section2Invoices state={state} updateState={updateState} results={results} />}
            {activeTab === 3 && <Section2CapEx state={state} updateState={updateState} results={results} />}
            {activeTab === 4 && <Section3InkMedia state={state} updateState={updateState} results={results} />}
            {activeTab === 5 && <Section4Electricity state={state} updateState={updateState} results={results} />}
            {activeTab === 6 && <Section5Staff state={state} updateState={updateState} results={results} />}
            {activeTab === 7 && <Section7FinancialCalc state={state} updateState={updateState} results={results} />}
            {activeTab === 8 && <Section8RiskAnalysis state={state} updateState={updateState} results={results} />}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
