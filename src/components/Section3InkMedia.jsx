import React from 'react';
import { Plus, Trash2, Info } from 'lucide-react';

const Section3InkMedia = ({ state, updateState, results }) => {
  const { inkMedia = [] } = state;

  const handleAdd = () => {
    const newItem = {
      id: `im-${Date.now()}`,
      name: 'New Consumable',
      desc: '',
      unit: 'sq.m',
      price: 0,
      coverage: null
    };
    updateState('inkMedia', [...inkMedia, newItem]);
  };

  const handleRemove = (id) => {
    updateState('inkMedia', inkMedia.filter(i => i.id !== id));
  };

  const handleChange = (id, field, value) => {
    updateState('inkMedia', inkMedia.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const sqMtoSqFt = 10.76;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded text-amber-800 text-sm flex items-start">
        <Info className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold mb-1">What to enter here:</p>
          <p>Enter the price per unit for each consumable. For inks, enter the coverage/yield per litre. Orange fields are manual inputs. Green fields are auto-calculated.</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">Sheet 4: Enter consumable prices to calculate the raw material cost per sq.ft in-house.</h2>
        </div>
        <button onClick={handleAdd} className="flex items-center px-4 py-2 bg-accent-orange text-white rounded hover:bg-accent-orange-hover transition-colors font-medium text-sm">
          <Plus className="w-4 h-4 mr-2" /> Add Consumable
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Consumable Item</th>
              <th className="px-4 py-3 font-medium">What to Enter</th>
              <th className="px-4 py-3 font-medium w-32">Price (₹)</th>
              <th className="px-4 py-3 font-medium w-32">Unit</th>
              <th className="px-4 py-3 font-medium w-40">Coverage/Yield</th>
              <th className="px-4 py-3 font-medium w-32 text-green-700">Cost / Sq.Ft</th>
              <th className="px-4 py-3 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inkMedia.map((item) => {
              let estCost = 0;
              if (item.unit === 'litre' && item.coverage) {
                estCost = item.price / (item.coverage * sqMtoSqFt);
              } else if (item.unit === 'sq.m') {
                estCost = (item.price / sqMtoSqFt) * (item.coverage || 1); 
              }

              return (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2">
                    <input type="text" placeholder="e.g. Eco-Solvent Ink" value={item.name} onChange={(e) => handleChange(item.id, 'name', e.target.value)} className="w-full border-2 border-orange-200 rounded px-2 py-1 outline-none bg-orange-50 focus:border-accent-orange" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="text" value={item.desc || ''} onChange={(e) => handleChange(item.id, 'desc', e.target.value)} className="w-full border-2 border-orange-200 rounded px-2 py-1 outline-none bg-orange-50 focus:border-accent-orange" placeholder="Guidance text" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" placeholder="800" value={item.price || ''} onChange={(e) => handleChange(item.id, 'price', parseFloat(e.target.value))} className="w-full border-2 border-orange-200 rounded px-2 py-1 bg-orange-50 focus:border-accent-orange outline-none" />
                  </td>
                  <td className="px-4 py-2">
                    <select value={item.unit} onChange={(e) => handleChange(item.id, 'unit', e.target.value)} className="w-full border-2 border-orange-200 rounded px-2 py-1 bg-white outline-none focus:border-accent-orange">
                      <option value="litre">Litre</option>
                      <option value="sq.m">Sq.m</option>
                      <option value="piece">Piece</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" step="0.1" value={item.coverage === null ? '' : item.coverage} onChange={(e) => handleChange(item.id, 'coverage', e.target.value ? parseFloat(e.target.value) : null)} placeholder="Rate/Yield" className="w-full border-2 border-orange-200 rounded px-2 py-1 bg-orange-50 focus:border-accent-orange outline-none" />
                  </td>
                  <td className="px-4 py-3 font-semibold text-green-700 bg-green-50 rounded">₹{estCost ? estCost.toFixed(2) : '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleRemove(item.id)} className="text-slate-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-green-100 border-t border-green-200 font-bold">
            <tr>
              <td colSpan="5" className="px-4 py-4 text-right text-green-900 uppercase tracking-wider text-sm">Weighted Blended Consumable Cost per Sq.Ft:</td>
              <td colSpan="2" className="px-4 py-4 text-xl text-green-700">₹{results.blendedConsumableCostPerSqFt.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className={`p-6 rounded-lg shadow-lg flex justify-between items-center mt-8 border-2 ${results.isUsingInkOverride ? 'bg-amber-50 border-amber-400' : 'bg-slate-50 border-slate-200'}`}>
        <div>
          <h3 className="text-lg font-bold text-slate-800">Monthly Ink & Media Cost Override (Rs.)</h3>
          <p className="text-slate-600 text-sm mt-1">Enter actual monthly spend if known. Leave blank to use calculated value.</p>
          <div className="mt-2">
            {results.isUsingInkOverride ? (
              <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">Using override</span>
            ) : (
              <span className="bg-slate-400 text-white text-xs font-bold px-2 py-1 rounded">Using calculated value</span>
            )}
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-xl text-slate-500 mr-2">₹</span>
          <input 
            type="number" 
            placeholder="e.g. 25000"
            value={state.monthlyInkMediaCost || ''} 
            onChange={(e) => updateState('monthlyInkMediaCost', parseFloat(e.target.value) || 0)}
            className="w-48 bg-white border-2 border-orange-300 rounded px-3 py-2 text-xl font-bold text-slate-800 outline-none focus:border-accent-orange text-right"
          />
        </div>
      </div>
    </div>
  );
};

export default Section3InkMedia;
