import React from 'react';
import { Plus, Trash2, Info } from 'lucide-react';

const Section5Staff = ({ state, updateState, results }) => {
  const { staff, annualAMC } = state;

  const handleAdd = () => {
    const newStaff = {
      id: `s-${Date.now()}`,
      role: 'New Role',
      salary: 0,
      count: 1
    };
    updateState('staff', [...staff, newStaff]);
  };

  const handleRemove = (id) => {
    updateState('staff', staff.filter(s => s.id !== id));
  };

  const handleChange = (id, field, value) => {
    updateState('staff', staff.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded text-amber-800 text-sm flex items-start">
        <Info className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold mb-1">What to enter here:</p>
          <p>Enter the direct labour costs and the annual maintenance contract (AMC) fee. Orange fields are manual inputs. Green fields are auto-calculated.</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">Sheet 6: Enter staff salaries to calculate total monthly labour cost.</h2>
        </div>
        <button onClick={handleAdd} className="flex items-center px-4 py-2 bg-accent-orange text-white rounded hover:bg-accent-orange-hover transition-colors font-medium text-sm">
          <Plus className="w-4 h-4 mr-2" /> Add Staff Role
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-6">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
            <tr>
              <th className="px-6 py-3 font-medium">Role</th>
              <th className="px-6 py-3 font-medium w-32">Gross Salary Rs./month</th>
              <th className="px-6 py-3 font-medium w-24">No. of Staff</th>
              <th className="px-6 py-3 font-medium w-32 text-green-700">Total Gross Rs.</th>
              <th className="px-6 py-3 font-medium w-32 text-green-700">EPF+ESI 13% Rs.</th>
              <th className="px-6 py-3 font-medium w-32 text-green-700">Total Cost to Company Rs.</th>
              <th className="px-6 py-3 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {staff.map((s) => {
              const gross = (s.salary || 0) * (s.count || 0);
              const epf = gross * 0.13;
              const ctc = gross + epf;
              
              return (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-6 py-2">
                    <input type="text" placeholder="e.g. Production Supervisor" value={s.role} onChange={(e) => handleChange(s.id, 'role', e.target.value)} className="w-full border-2 border-orange-200 rounded px-2 py-1 outline-none bg-orange-50 focus:border-accent-orange" />
                  </td>
                  <td className="px-6 py-2">
                    <input type="number" placeholder="22000" value={s.salary || ''} onChange={(e) => handleChange(s.id, 'salary', parseFloat(e.target.value))} className="w-full border-2 border-orange-200 rounded px-2 py-1 bg-orange-50 focus:border-accent-orange outline-none" />
                  </td>
                  <td className="px-6 py-2">
                    <input type="number" placeholder="1" value={s.count || ''} onChange={(e) => handleChange(s.id, 'count', parseInt(e.target.value))} className="w-full border-2 border-orange-200 rounded px-2 py-1 bg-orange-50 focus:border-accent-orange outline-none" />
                  </td>
                  <td className="px-6 py-3 text-slate-500 bg-green-50 rounded">₹{gross.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-3 text-slate-500 bg-green-50 rounded">₹{epf.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-3 font-semibold text-green-700 bg-green-100 rounded">₹{ctc.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-3 text-right">
                    <button onClick={() => handleRemove(s.id)} className="text-slate-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-green-100 border-t border-green-200 font-bold">
            <tr>
              <td colSpan="5" className="px-6 py-4 text-right text-green-900 uppercase tracking-wider text-sm">Total Monthly Labour:</td>
              <td colSpan="2" className="px-6 py-4 text-xl text-green-700">₹{Math.round(results.totalMonthlyLabour).toLocaleString('en-IN')}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="bg-navy-900 text-white p-6 rounded-lg shadow-lg flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-accent-orange">Annual Maintenance Contract (AMC)</h3>
          <p className="text-slate-300 text-sm">Estimated AMC cost for Year 2 onwards, included in OpEx.</p>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex flex-col items-end">
             <span className="text-xs text-slate-400">Total Annual AMC Rs.</span>
             <div className="flex items-center">
               <span className="text-xl text-slate-300 mr-2">₹</span>
               <input 
                 type="number" 
                 value={annualAMC || ''} 
                 onChange={(e) => updateState('annualAMC', parseFloat(e.target.value))}
                 className="w-32 bg-slate-800 border-2 border-accent-orange rounded px-3 py-2 text-xl font-bold text-accent-orange outline-none focus:bg-slate-700 text-right"
               />
             </div>
          </div>
          <div className="border-l border-slate-700 pl-6 flex flex-col items-end">
             <span className="text-xs text-slate-400">Monthly AMC Rs.</span>
             <div className="text-2xl font-bold text-green-400">₹{Math.round(results.monthlyAMC).toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section5Staff;
