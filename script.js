const form = document.getElementById('taxCalculatorForm');
const calculateBtn = document.getElementById('calculateBtn');
const resultsContainer = document.getElementById('results');
let periodType; 

form.addEventListener('submit', function (e) {
  e.preventDefault();
  calculateResults();
});

// Taxes and deductions
function calculateIncomeTax(annualIncome) {
  let tax = 0;
  const personalRelief = 28800;

  if (annualIncome <= 147580) {
    tax = annualIncome * 0.1;
  } else if (annualIncome <= 286623) {
    tax = (annualIncome - 147580) * 0.15 + 14758;
  } else if (annualIncome <= 425666) {
    tax = (annualIncome - 286623) * 0.2 + 39303;
  } else if (annualIncome <= 564709) {
    tax = (annualIncome - 425666) * 0.25 + 63653;
  } else {
    tax = (annualIncome - 564709) * 0.3 + 110298;
  }

  let paye;
  if (periodType === 'month') {
    paye = Math.max((tax - personalRelief) / 12, 0);
  } else {
    paye = Math.max(tax - personalRelief, 0);
  }

  return paye;
}

function calculateNHIFContribution(annualIncome) {
  const nhifRates = [
    { minIncome: 0, maxIncome: 5999, contribution: 150 },
    { minIncome: 6000, maxIncome: 7999, contribution: 300 },
    { minIncome: 8000, maxIncome: 11999, contribution: 400 },
    { minIncome: 12000, maxIncome: 14999, contribution: 500 },
    { minIncome: 15000, maxIncome: 19999, contribution: 600 },
    { minIncome: 20000, maxIncome: 24999, contribution: 750 },
    { minIncome: 25000, maxIncome: 29999, contribution: 850 },
    { minIncome: 30000, maxIncome: 34999, contribution: 900 },
    { minIncome: 35000, maxIncome: 39999, contribution: 950 },
    { minIncome: 40000, maxIncome: 44999, contribution: 1000 },
    { minIncome: 45000, maxIncome: 49999, contribution: 1100 },
    { minIncome: 50000, maxIncome: 59999, contribution: 1200 },
    { minIncome: 60000, maxIncome: 69999, contribution: 1300 },
    { minIncome: 70000, maxIncome: 79999, contribution: 1400 },
    { minIncome: 80000, maxIncome: 89999, contribution: 1500 },
    { minIncome: 90000, maxIncome: 99999, contribution: 1600 },
    { minIncome: 100000, maxIncome: Infinity, contribution: 1700 },
    { minIncome: 0, maxIncome: Infinity, contribution: 500 }, // Self-employed contribution
  ];

  let contribution = 0;
  for (let i = 0; i < nhifRates.length; i++) {
    const rate = nhifRates[i];
    if (annualIncome >= rate.minIncome && annualIncome <= rate.maxIncome) {
      contribution = rate.contribution;
      break;
    }
  }

  return contribution;
}

function calculateNSSFContribution(annualIncome) {
  const nssfRates = {
    old: 200,
    new: 0.12, // 12% of pensionable wages
  };

  const lowerEarningLimit = 6000;
  const upperEarningLimit = 18000;

  let contribution = 0;
  if (annualIncome > lowerEarningLimit) {
    const pensionableWages = Math.min(annualIncome, upperEarningLimit);
    contribution = pensionableWages * nssfRates.new;
    if (annualIncome > upperEarningLimit) {
      contribution += nssfRates.old;
    }
  }

  return contribution;
}

// results calculations
function calculateResults() {
//values
  periodType = document.querySelector('input[name="periodType"]:checked').value;
  const basicSalary = parseFloat(document.getElementById('basicSalary').value);
  const benefits = parseFloat(document.getElementById('benefits').value);
  const deductNSSF = document.querySelector('input[name="deductNSSF"]:checked').value;
  const nssfRates = document.querySelector('input[name="nssfRates"]:checked').value;
  const deductNHIF = document.querySelector('input[name="deductNHIF"]:checked').value;

  // Income tax
  const annualIncome = periodType === 'month' ? (basicSalary + benefits) * 12 : basicSalary + benefits;
  const incomeTax = calculateIncomeTax(annualIncome);

  // NHIF contribution
  const nhifContribution = deductNHIF === 'yes' ? calculateNHIFContribution(annualIncome) : 0;

  // NSSF contribution
  const nssfContribution =
    deductNSSF === 'yes' ? (nssfRates === 'new' ? calculateNSSFContribution(annualIncome) : 200) : 0;

  // Personal relief
  const personalRelief = periodType === 'month' ? 2400 : 28800;

  let netSalary;
  if (periodType === 'month') {
    netSalary = basicSalary + benefits - incomeTax- nhifContribution  - nssfContribution + 2400;
  } else {
    netSalary = basicSalary + benefits - incomeTax - nhifContribution - nssfContribution+ personalRelief + 28800;
  }

  // Display results
  resultsContainer.innerHTML = `
    <p><strong>Income before Pension Deduction:</strong> Ksh ${(basicSalary + benefits).toFixed(2)}</p>
    <p><strong>Deductible NSSF Pension Contributions:</strong> Ksh ${nssfContribution.toFixed(2)}</p>
    <p><strong>Income after Pension Deductions:</strong> Ksh ${(basicSalary + benefits - nssfContribution).toFixed(2)}</p>
    <p><strong>Benefits of Kind:</strong> Ksh ${benefits.toFixed(2)}</p>
    <p><strong>Taxable Income:</strong> Ksh ${((basicSalary + benefits) - nssfContribution).toFixed(2)}</p>
    <p><strong>Tax on Taxable Income:</strong> Ksh ${incomeTax.toFixed(2)}</p>
    <p><strong>Personal Relief:</strong> Ksh ${personalRelief.toFixed(2)}</p>
    <p><strong>Tax Net Off Relief:</strong> Ksh ${Math.max(incomeTax - personalRelief, 0).toFixed(2)}</p>
    <p><strong>PAYE:</strong> Ksh ${Math.max(incomeTax - personalRelief, 0).toFixed(2)}</p>
    <p><strong>Chargeable Income:</strong> Ksh ${((basicSalary + benefits) - nssfContribution).toFixed(2)}</p>
    <p><strong>NHIF Contribution:</strong> Ksh ${nhifContribution.toFixed(2)}</p>
    <p><strong>Net Pay:</strong> Ksh ${netSalary.toFixed(2)}</p>
  `;

  resultsContainer.classList.remove('hidden');
}
