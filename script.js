const form = document.getElementById('taxCalculatorForm');
const calculateBtn = document.getElementById('calculateBtn');
const resultsContainer = document.getElementById('results');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  calculateResults();
});

// taxes and deductions calculations
function calculateIncomeTax(annualIncome) {
  if (annualIncome <= 147580) {
    return annualIncome * 0.1;
  } else if (annualIncome <= 286623) {
    return (annualIncome - 147580) * 0.15 + 14758;
  } else if (annualIncome <= 425666) {
    return (annualIncome - 286623) * 0.2 + 39303;
  } else if (annualIncome <= 564709) {
    return (annualIncome - 425666) * 0.25 + 63653;
  } else {
    return (annualIncome - 564709) * 0.3 + 110298;
  }
}

function calculateNHIFContribution(annualIncome) {
  if (annualIncome <= 5999) {
    return 150;
  } else if (annualIncome <= 7999) {
    return 300;
  } else if (annualIncome <= 11999) {
    return 400;
  } else if (annualIncome <= 14999) {
    return 500;
  } else if (annualIncome <= 19999) {
    return 600;
  } else if (annualIncome <= 24999) {
    return 750;
  } else if (annualIncome <= 29999) {
    return 850;
  } else if (annualIncome <= 34999) {
    return 900;
  } else if (annualIncome <= 39999) {
    return 950;
  } else if (annualIncome <= 44999) {
    return 1000;
  } else if (annualIncome <= 49999) {
    return 1100;
  } else if (annualIncome <= 59999) {
    return 1200;
  } else if (annualIncome <= 69999) {
    return 1300;
  } else if (annualIncome <= 79999) {
    return 1400;
  } else if (annualIncome <= 89999) {
    return 1500;
  } else if (annualIncome <= 99999) {
    return 1600;
  } else {
    return 1700;
  }
}

function calculateNSSFContribution(annualIncome) {
  if (annualIncome > 18000) {
    return 2160;
  } else {
    return annualIncome * 0.12;
  }
}

// Calculate results
function calculateResults() {
  // Get form values
  const periodType = document.querySelector('input[name="periodType"]:checked').value;
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
  const nssfContribution = deductNSSF === 'yes' ? (nssfRates === 'new' ? calculateNSSFContribution(annualIncome) : 200) : 0;

  // Determine personal relief based on period type
  const personalRelief = periodType === 'month' ? 2700 : 28800;

  let netSalary;
  if (periodType === 'month') {
    netSalary = (basicSalary + benefits) - (incomeTax / 12) - (nhifContribution / 12) - (nssfContribution / 12);
  } else {
    netSalary = (basicSalary + benefits) - incomeTax - nhifContribution - nssfContribution;
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
