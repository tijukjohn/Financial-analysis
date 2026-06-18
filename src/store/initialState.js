export const defaultState = {
  // Global / Financial Settings
  ksebTariff: 7.50,
  workingDays: 26,
  discountRate: 12,
  annualProductionVolume: 8000,
  residualValuePercentage: 15,
  isGSTClaimable: false,
  
  // Section 1: Material Rates
  materialRates: [
    { id: 'mr-1', name: 'Frontlit Flex', unit: 'sq.ft', quantity: 5000, amount: 75000, type: 'Flex' },
    { id: 'mr-2', name: 'Backlit Flex', unit: 'sq.ft', quantity: 2000, amount: 40000, type: 'Flex' },
    { id: 'mr-3', name: 'Vinyl Printing', unit: 'sq.ft', quantity: 3000, amount: 105000, type: 'Vinyl' },
  ],

  // Section 2: Vendor Invoices
  invoices: [
    {
      id: 'inv-1',
      campaignName: 'Annual Event Promo',
      code: 'EVT-101',
      clientCode: 'CLI-A',
      date: '2025-01-10',
      subTotal: 4661,
      gstAmount: 839,
      costToGDMR: 4000
    },
    {
      id: 'inv-2',
      campaignName: 'Office Branding',
      code: 'BRD-202',
      clientCode: 'CLI-B',
      date: '2025-01-15',
      subTotal: 2118,
      gstAmount: 382,
      costToGDMR: 2000
    }
  ],

  // Section 2: Machine Costs (CapEx)
  machines: [
    { id: 'm-1', name: 'Eco-Solvent Printer', desc: 'Main printer for flex/vinyl', cost: 450000, gstRate: 18 },
    { id: 'm-2', name: 'UV Flatbed Printer', desc: 'Direct to board printing', cost: 800000, gstRate: 18 },
    { id: 'm-3', name: 'Vinyl Cutter / Plotter', desc: 'Shape cutting', cost: 75000, gstRate: 18 },
    { id: 'm-4', name: 'Cold Laminator', desc: 'Finishing equipment', cost: 45000, gstRate: 18 },
    { id: 'm-5', name: 'Computer / RIP Software', desc: 'Design workstation', cost: 50000, gstRate: 18 },
    { id: 'm-6', name: 'Installation & Commissioning', desc: 'Setup fees', cost: 25000, gstRate: 0 },
    { id: 'm-7', name: 'First-Year AMC', desc: 'Maintenance contract', cost: 0, gstRate: 18 },
    { id: 'm-8', name: 'Civil / Infrastructure Work', desc: 'Room prep/AC', cost: 30000, gstRate: 0 },
    { id: 'm-9', name: 'Other Equipment', desc: 'Misc tools', cost: 0, gstRate: 18 },
  ],

  // Section 3: Ink & Media
  inkMedia: [
    { id: 'im-1', name: 'Eco-Solvent Ink', desc: 'For flex/vinyl printing', unit: 'litre', price: 800, coverage: 27.5, materialLink: '' },
    { id: 'im-2', name: 'UV-Curable Ink', desc: 'For flatbed printing', unit: 'litre', price: 3000, coverage: 17.5, materialLink: '' },
    { id: 'im-3', name: 'Frontlit Flex', desc: 'Standard banner material', unit: 'sq.m', price: 40, coverage: null, materialLink: '' },
    { id: 'im-4', name: 'Self-Adhesive Vinyl', desc: 'Sticker material', unit: 'sq.m', price: 60, coverage: null, materialLink: '' },
    { id: 'im-5', name: 'Backlit Film', desc: 'For glow signs', unit: 'sq.m', price: 80, coverage: null, materialLink: '' },
    { id: 'im-6', name: 'Cold Laminate', desc: 'Protective film', unit: 'sq.m', price: 50, coverage: 0.6, materialLink: '' },
    { id: 'im-7', name: 'Cleaning Solution', desc: 'Head maintenance', unit: 'litre', price: 500, coverage: 0.5, materialLink: '' },
    { id: 'im-8', name: 'Foam Board', desc: 'Mounting board', unit: 'sq.m', price: 120, coverage: null, materialLink: '' }
  ],

  // Override for monthly
  monthlyInkMediaCost: 25000,

  // Section 4: Electricity
  electricity: [
    { id: 'e-1', name: 'Eco-Solvent Printer', power: 2.0, hours: 6 },
    { id: 'e-2', name: 'UV Flatbed Printer', power: 3.5, hours: 4 },
    { id: 'e-3', name: 'Vinyl Cutter', power: 0.5, hours: 4 },
    { id: 'e-4', name: 'Cold Laminator', power: 1.0, hours: 3 },
    { id: 'e-5', name: 'Computers & Peripherals', power: 0.8, hours: 8 },
    { id: 'e-6', name: 'Lighting & Misc', power: 1.5, hours: 8 },
  ],

  // Section 5: Staff Costs
  staff: [
    { id: 's-1', role: 'Production Supervisor', salary: 22000, count: 1 },
    { id: 's-2', role: 'Machine Operator (primary)', salary: 15000, count: 1 },
    { id: 's-3', role: 'Operator/Finishing Staff', salary: 12000, count: 1 },
    { id: 's-4', role: 'Helper/Assistant', salary: 9000, count: 1 },
    { id: 's-5', role: 'Additional Staff', salary: 0, count: 0 },
  ],
  
  annualAMC: 35000,
};
