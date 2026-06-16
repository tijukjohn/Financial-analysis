export const calculateTotals = (state) => {
  const { 
    materialRates,
    invoices, 
    machines, 
    inkMedia, 
    electricity, 
    staff, 
    ksebTariff, 
    workingDays, 
    annualProductionVolume, 
    discountRate, 
    residualValuePercentage, 
    annualAMC, 
    monthlyInkMediaCost 
  } = state;

  // 1. Material Rates calculations
  let totalMaterialQty = 0;
  let totalMaterialAmount = 0;

  (materialRates || []).forEach(mr => {
    totalMaterialQty += (mr.quantity || 0);
    totalMaterialAmount += (mr.amount || 0);
  });

  const averageVendorRate = totalMaterialQty > 0 ? totalMaterialAmount / totalMaterialQty : 15;

  // 1b. Vendor Invoices calculations
  let totalVendorCost = 0;
  let totalVendorSubTotal = 0;

  (invoices || []).forEach(inv => {
    const costToGDMR = inv.costToGDMR || 0; 
    
    totalVendorCost += costToGDMR;
    totalVendorSubTotal += (inv.subTotal || 0);
  });

  const averageMarginPercent = totalVendorSubTotal > 0 ? ((totalVendorSubTotal - totalVendorCost) / totalVendorSubTotal) * 100 : 0;

  // 2. CapEx
  const totalCapEx = machines.reduce((sum, m) => {
    const cost = m.cost || 0;
    const gst = cost * ((m.gstRate || 0) / 100);
    return sum + cost + gst;
  }, 0);

  const residualValue = totalCapEx * (residualValuePercentage / 100);
  const annualDepreciation = (totalCapEx - residualValue) / 5;

  const depreciationSchedule = [];
  let currentVal = totalCapEx;
  let accDep = 0;
  for (let year = 1; year <= 5; year++) {
    depreciationSchedule.push({
      year,
      openingValue: currentVal,
      depreciation: annualDepreciation,
      accDepreciation: accDep + annualDepreciation,
      closingValue: currentVal - annualDepreciation
    });
    accDep += annualDepreciation;
    currentVal -= annualDepreciation;
  }

  // 3. Ink & Media (calculate blended cost per sq.ft)
  let blendedConsumableCostPerSqFt = 0;
  let consumableTypes = 0;
  const sqMtoSqFt = 10.76;
  
  inkMedia.forEach(item => {
    let estCost = 0;
    if (item.unit === 'litre' && item.coverage) {
      estCost = item.price / (item.coverage * sqMtoSqFt);
    } else if (item.unit === 'sq.m') {
      estCost = (item.price / sqMtoSqFt) * (item.coverage || 1);
    }
    if (estCost > 0) {
      blendedConsumableCostPerSqFt += estCost;
      consumableTypes++;
    }
  });
  
  // 4. Electricity
  const monthlyElectricity = electricity.reduce((sum, e) => {
    const dailyKwh = (e.power || 0) * (e.hours || 0);
    const monthlyKwh = dailyKwh * workingDays;
    return sum + (monthlyKwh * ksebTariff);
  }, 0);

  // 5. Staff & AMC
  const totalMonthlyLabour = staff.reduce((sum, s) => {
    const gross = (s.salary || 0) * (s.count || 0);
    const epf = gross * 0.13;
    return sum + gross + epf;
  }, 0);

  const monthlyAMC = (annualAMC || 0) / 12;

  // Annual OpEx Summary
  const annualConsumables = monthlyInkMediaCost * 12; 
  const annualElectricity = monthlyElectricity * 12;
  const annualLabour = totalMonthlyLabour * 12;
  const totalAnnualOpEx = annualConsumables + annualElectricity + annualLabour + annualAMC;

  // H1: Cost Comparison
  const inHouseCostPerSqft = totalAnnualOpEx / annualProductionVolume;
  const savingPerSqFt = averageVendorRate - inHouseCostPerSqft;
  const savingPercent = averageVendorRate > 0 ? (savingPerSqFt / averageVendorRate) * 100 : 0;
  const h1Verdict = savingPerSqFt > 0;

  // 5-Year Cash Flow Projection
  const cashFlows = [];
  const rate = discountRate / 100;
  let npv = -totalCapEx;

  for (let year = 1; year <= 5; year++) {
    const annualSaving = averageVendorRate * annualProductionVolume;
    let netCashFlow = annualSaving - totalAnnualOpEx;
    if (year === 5) netCashFlow += residualValue;
    
    const pvFactor = 1 / Math.pow(1 + rate, year);
    const dcf = netCashFlow * pvFactor;
    npv += dcf;

    cashFlows.push({
      year,
      annualSaving,
      opEx: totalAnnualOpEx,
      netBenefit: annualSaving - totalAnnualOpEx,
      residualValue: year === 5 ? residualValue : 0,
      netCashFlow,
      pvFactor,
      dcf,
      cumulativeDcf: npv
    });
  }

  // Capital Budgeting Results
  const avgCashFlow = cashFlows.reduce((sum, cf) => sum + cf.netCashFlow, 0) / 5;
  const paybackMonths = avgCashFlow > 0 ? (totalCapEx / avgCashFlow) * 12 : 999;
  const irr = calculateIRR([-totalCapEx, ...cashFlows.map(cf => cf.netCashFlow)]);
  const pi = (npv + totalCapEx) / totalCapEx;
  const h2Verdict = npv > 0 && irr > discountRate;

  // SCENARIO ANALYSIS
  const scenarios = [60, 75, 90].map(utilization => {
    const vol = annualProductionVolume * (utilization / 100);
    const inHouseCost = totalAnnualOpEx / vol;
    const savingPct = averageVendorRate > 0 ? ((averageVendorRate - inHouseCost) / averageVendorRate) * 100 : 0;
    
    let scenNpv = -totalCapEx;
    let scenAvgCf = 0;
    for (let year = 1; year <= 5; year++) {
      let netCf = (averageVendorRate * vol) - totalAnnualOpEx;
      if (year === 5) netCf += residualValue;
      scenNpv += netCf / Math.pow(1 + rate, year);
      scenAvgCf += netCf;
    }
    scenAvgCf /= 5;
    const scenPayback = scenAvgCf > 0 ? (totalCapEx / scenAvgCf) * 12 : 999;

    return { utilization, npv: scenNpv, paybackMonths: scenPayback, savingPercent: savingPct };
  });

  // SENSITIVITY ANALYSIS
  const baseNPV = npv;
  const sensitivities = [
    { name: 'Vendor Rate', key: 'vendorRate', base: averageVendorRate, swings: [-20, 20] },
    { name: 'Consumable Cost', key: 'consumables', base: annualConsumables, swings: [-20, 20] },
    { name: 'Production Volume', key: 'volume', base: annualProductionVolume, swings: [-20, 20] }
  ].map(sens => {
    const results = {};
    sens.swings.forEach(swing => {
      let testVendorRate = averageVendorRate;
      let testConsumables = annualConsumables;
      let testVol = annualProductionVolume;

      const multiplier = 1 + (swing / 100);
      if (sens.key === 'vendorRate') testVendorRate *= multiplier;
      if (sens.key === 'consumables') testConsumables *= multiplier;
      if (sens.key === 'volume') testVol *= multiplier;

      const testOpEx = testConsumables + annualElectricity + annualLabour + annualAMC;
      
      let testNpv = -totalCapEx;
      for (let year = 1; year <= 5; year++) {
        let netCf = (testVendorRate * testVol) - testOpEx;
        if (year === 5) netCf += residualValue;
        testNpv += netCf / Math.pow(1 + rate, year);
      }
      
      results[`swing_${swing}`] = baseNPV !== 0 ? ((testNpv - baseNPV) / Math.abs(baseNPV)) * 100 : 0;
      results[`npv_${swing}`] = testNpv;
    });
    return { name: sens.name, ...results };
  });

  return {
    averageVendorRate,
    totalVendorCost,
    averageMarginPercent,
    totalCapEx,
    residualValue,
    annualDepreciation,
    depreciationSchedule,
    blendedConsumableCostPerSqFt,
    monthlyElectricity,
    totalMonthlyLabour,
    monthlyAMC,
    annualConsumables,
    annualElectricity,
    annualLabour,
    totalAnnualOpEx,
    inHouseCostPerSqft,
    savingPerSqFt,
    savingPercent,
    h1Verdict,
    cashFlows,
    npv,
    paybackMonths,
    irr,
    pi,
    h2Verdict,
    scenarios,
    sensitivities
  };
};

function calculateIRR(cashFlows) {
  let rate = 0.1;
  const maxIterations = 100;
  const precision = 0.00001;
  
  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let derivative = 0;
    for (let t = 0; t < cashFlows.length; t++) {
      npv += cashFlows[t] / Math.pow(1 + rate, t);
      if (t > 0) {
        derivative -= t * cashFlows[t] / Math.pow(1 + rate, t + 1);
      }
    }
    const newRate = rate - npv / derivative;
    if (Math.abs(newRate - rate) < precision) return newRate * 100;
    rate = newRate;
  }
  return rate * 100;
}
