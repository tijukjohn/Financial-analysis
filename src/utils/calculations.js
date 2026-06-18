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
    monthlyInkMediaCost,
    isGSTClaimable 
  } = state;

  // 1. Material Rates calculations
  let totalMaterialQty = 0;
  let totalMaterialAmount = 0;
  let directRateWeightedSum = 0;
  let hasDirectRate = false;

  (materialRates || []).forEach(mr => {
    const qty = mr.quantity || 0;
    totalMaterialQty += qty;
    totalMaterialAmount += (mr.amount || 0);
    if (mr.directRate > 0) {
      hasDirectRate = true;
      directRateWeightedSum += (mr.directRate * qty);
    }
  });

  const methodARate = totalMaterialQty > 0 ? totalMaterialAmount / totalMaterialQty : 15;
  const methodBRate = totalMaterialQty > 0 ? directRateWeightedSum / totalMaterialQty : methodARate;
  
  const averageVendorRate = hasDirectRate ? methodBRate : methodARate;
  const vendorRateMethod = hasDirectRate ? 'Method B (Direct)' : 'Method A (Calculated)';

  // 1b. Vendor Invoices calculations
  let totalVendorCost = 0;
  let totalVendorSubTotal = 0;

  (invoices || []).forEach(inv => {
    const costToGDMR = inv.costToGDMR || 0; 
    
    totalVendorCost += costToGDMR;
    totalVendorSubTotal += (inv.subTotal || 0);
  });

  const averageMarginPercent = totalVendorSubTotal > 0 ? ((totalVendorSubTotal - totalVendorCost) / totalVendorSubTotal) * 100 : 0;

  // 2. CapEx (Fix 4: GST Toggle)
  const totalCapEx = machines.reduce((sum, m) => {
    const cost = m.cost || 0;
    const gst = cost * ((m.gstRate || 0) / 100);
    return sum + cost + (isGSTClaimable ? 0 : gst);
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
  const sqMtoSqFt = 10.76;
  
  let sharedConsumableCostPerSqFt = 0;
  const materialConsumables = {};
  (materialRates || []).forEach(mr => {
    materialConsumables[mr.name] = 0;
  });

  inkMedia.forEach(item => {
    let estCost = 0;
    if (item.unit === 'litre' && item.coverage) {
      estCost = item.price / (item.coverage * sqMtoSqFt);
    } else if (item.unit === 'sq.m') {
      estCost = (item.price / sqMtoSqFt) * (item.coverage || 1);
    }

    if (item.materialLink && materialConsumables[item.materialLink] !== undefined) {
      materialConsumables[item.materialLink] += estCost;
    } else {
      sharedConsumableCostPerSqFt += estCost;
    }
  });

  let blendedConsumableCostPerSqFt = sharedConsumableCostPerSqFt;
  if (totalMaterialQty > 0) {
    let weightedLinked = 0;
    (materialRates || []).forEach(mr => {
      weightedLinked += (materialConsumables[mr.name] || 0) * (mr.quantity || 0);
    });
    blendedConsumableCostPerSqFt += (weightedLinked / totalMaterialQty);
  }
  
  // 4. Electricity
  const monthlyElectricity = electricity.reduce((sum, e) => {
    const dailyKwh = (e.power || 0) * (e.hours || 0);
    const monthlyKwh = dailyKwh * workingDays;
    return sum + (monthlyKwh * ksebTariff);
  }, 0);
  const annualElectricity = monthlyElectricity * 12;

  // 5. Staff & AMC
  const totalMonthlyLabour = staff.reduce((sum, s) => {
    const gross = (s.salary || 0) * (s.count || 0);
    const epf = gross * 0.13;
    return sum + gross + epf;
  }, 0);
  const annualLabour = totalMonthlyLabour * 12;

  // Annual OpEx Summary
  const isUsingInkOverride = monthlyInkMediaCost > 0;
  const annualConsumables = isUsingInkOverride ? (monthlyInkMediaCost * 12) : (blendedConsumableCostPerSqFt * annualProductionVolume); 
  const totalAnnualOpEx = annualConsumables + annualElectricity + annualLabour + (annualAMC || 0);

  // Fix 6: Material-Wise Breakdown
  const totalFixedOpEx = annualElectricity + annualLabour + (annualAMC || 0) + annualDepreciation;
  const allocatedFixedOpExPerSqFt = annualProductionVolume > 0 ? totalFixedOpEx / annualProductionVolume : 0;
  
  const materialWiseBreakdown = (materialRates || []).map(mr => {
    const qty = mr.quantity || 0;
    const vendorRate = qty > 0 ? (mr.amount || 0) / qty : 0;
    const consumableCost = (materialConsumables[mr.name] || 0) + sharedConsumableCostPerSqFt;
    const inHouseCost = consumableCost + allocatedFixedOpExPerSqFt;
    const savingRs = vendorRate - inHouseCost;
    const savingPercent = vendorRate > 0 ? (savingRs / vendorRate) * 100 : 0;
    
    return {
      name: mr.name,
      volume: qty,
      vendorRate,
      consumableCost,
      allocatedFixedOpEx: allocatedFixedOpExPerSqFt,
      inHouseCost,
      savingRs,
      savingPercent
    };
  });

  // H1: Cost Comparison
  const inHouseCostPerSqft = totalAnnualOpEx / annualProductionVolume;
  const savingPerSqFt = averageVendorRate - inHouseCostPerSqft;
  const savingPercent = averageVendorRate > 0 ? (savingPerSqFt / averageVendorRate) * 100 : 0;
  
  // Fix 2: H1 Verdict Threshold
  const h1Verdict = savingPercent >= 30;

  // 5-Year Cash Flow Projection
  const cashFlows = [];
  const rate = discountRate / 100;
  let npv = -totalCapEx;

  // Fix 1: Payback Method (Cumulative crossing CapEx)
  let paybackMonths = 999;
  let cumulativeForPayback = 0;

  for (let year = 1; year <= 5; year++) {
    const annualSaving = averageVendorRate * annualProductionVolume;
    let netCashFlow = annualSaving - totalAnnualOpEx;
    if (year === 5) netCashFlow += residualValue;
    
    cumulativeForPayback += netCashFlow;

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
      cumulativeNetCashFlow: cumulativeForPayback,
      pvFactor,
      dcf,
      cumulativeDcf: npv
    });

    if (paybackMonths === 999 && cumulativeForPayback >= totalCapEx) {
      const priorCumulative = cumulativeForPayback - netCashFlow;
      const amountNeeded = totalCapEx - priorCumulative;
      const fractionOfYear = amountNeeded / netCashFlow;
      paybackMonths = ((year - 1) * 12) + (fractionOfYear * 12);
    }
  }

  // Capital Budgeting Results
  const irr = calculateIRR([-totalCapEx, ...cashFlows.map(cf => cf.netCashFlow)]);
  const pi = totalCapEx > 0 ? (npv + totalCapEx) / totalCapEx : 0;
  
  // Fix 3: H2 Verdict Condition
  const h2Verdict = npv > 0 && paybackMonths <= 60;

  // SCENARIO ANALYSIS
  const scenarios = [60, 75, 90].map(utilization => {
    const vol = annualProductionVolume * (utilization / 100);
    const inHouseCost = totalAnnualOpEx / vol;
    const savingPct = averageVendorRate > 0 ? ((averageVendorRate - inHouseCost) / averageVendorRate) * 100 : 0;
    
    let scenNpv = -totalCapEx;
    let scenCumForPayback = 0;
    let scenPayback = 999;
    
    for (let year = 1; year <= 5; year++) {
      let netCf = (averageVendorRate * vol) - totalAnnualOpEx;
      if (year === 5) netCf += residualValue;
      
      scenNpv += netCf / Math.pow(1 + rate, year);
      scenCumForPayback += netCf;
      
      if (scenPayback === 999 && scenCumForPayback >= totalCapEx) {
        const priorCumulative = scenCumForPayback - netCf;
        const amountNeeded = totalCapEx - priorCumulative;
        const fractionOfYear = amountNeeded / netCf;
        scenPayback = ((year - 1) * 12) + (fractionOfYear * 12);
      }
    }

    return { utilization, npv: scenNpv, paybackMonths: scenPayback, savingPercent: savingPct };
  });

  // SENSITIVITY ANALYSIS
  const baseNPV = npv;
  const sensitivities = [
    { name: 'Vendor Rate', key: 'vendorRate', base: averageVendorRate, swings: [-20, 20] },
    { name: 'Consumable Cost', key: 'consumables', base: annualConsumables, swings: [-20, 20] },
    { name: 'Production Volume', key: 'volume', base: annualProductionVolume, swings: [-20, 20] }
  ].map(sens => {
    // simplified mock for sensitivity (this is used by RiskAnalysis component which recalculates natively anyway)
    return sens;
  });

  return {
    totalMaterialQty,
    totalMaterialAmount,
    averageVendorRate,
    vendorRateMethod,
    totalVendorCost,
    totalVendorSubTotal,
    averageMarginPercent,
    totalCapEx,
    residualValue,
    annualDepreciation,
    depreciationSchedule,
    blendedConsumableCostPerSqFt,
    isUsingInkOverride,
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
    irr,
    paybackMonths,
    pi,
    h2Verdict,
    scenarios,
    sensitivities,
    baseNPV,
    materialWiseBreakdown,
    sharedConsumableCostPerSqFt
  };
};

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
    if (Math.abs(dNpv) < 0.0001) return rate; // Prevent division by zero
    const newRate = rate - npv / dNpv;
    if (Math.abs(newRate - rate) < 0.0001) return newRate;
    rate = newRate;
  }
  return rate;
}
