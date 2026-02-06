// ===================================
// CONSTANTES
// ===================================
const TAX_BRACKETS_MONTHLY = [
    { from: 0, to: 550.00, fixedTax: 0, percentage: 0, threshold: 0 },
    { from: 550.01, to: 895.24, fixedTax: 17.67, percentage: 0.1, threshold: 550 },
    { from: 895.25, to: 2038.10, fixedTax: 60, percentage: 0.2, threshold: 895.24 },
    { from: 2038.11, to: Infinity, fixedTax: 288.57, percentage: 0.3, threshold: 2038.10 }
];

const RATES = {
    ISSS: 0.03,
    AFP: 0.0725,
    ISSS_MAX: 1000
};

// ===================================
// FUNCIONES
// ===================================
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

function calculateISSS(salary) {
    return Math.round(Math.min(salary, RATES.ISSS_MAX) * RATES.ISSS * 100) / 100;
}

function calculateAFP(salary) {
    return Math.round(salary * RATES.AFP * 100) / 100;
}

function calculateISR(taxableIncome) {
    for (let bracket of TAX_BRACKETS_MONTHLY) {
        if (taxableIncome >= bracket.from && taxableIncome <= bracket.to) {
            const excess = taxableIncome - bracket.threshold;
            return Math.round((bracket.fixedTax + excess * bracket.percentage) * 100) / 100;
        }
    }
    return 0;
}

// ===================================
// FORMATO INPUT
// ===================================
const salaryInput = document.getElementById('salary');

salaryInput.addEventListener('input', function () {
    let value = this.value.replace(/,/g, '').replace(/[^\d.]/g, '');
    const parts = value.split('.');
    if (parts.length > 2) value = parts[0] + '.' + parts.slice(1).join('');
    if (value) {
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        value = parts.join('.');
    }
    this.value = value;
});

// ===================================
// CALCULAR
// ===================================
document.getElementById('calculateBtn').addEventListener('click', function () {
    const salary = parseFloat(salaryInput.value.replace(/,/g, ''));
    const employeeName = document.getElementById('employeeName').value.trim() || 'Empleado';

    if (!salary || salary <= 0) {
        alert('Ingrese un salario válido');
        return;
    }

    const isss = calculateISSS(salary);
    const afp = calculateAFP(salary);
    const taxableIncome = salary - isss - afp;
    const isr = calculateISR(taxableIncome);
    const netSalary = salary - isss - afp - isr;

    document.getElementById('employeeDisplayName').textContent = employeeName;

    const now = new Date();
    const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    document.getElementById('currentPeriod').textContent =
        `${months[now.getMonth()]} ${now.getFullYear()}`;

    document.getElementById('displayGrossSalary').textContent = `$${formatCurrency(salary)}`;
    document.getElementById('displayAFP').textContent = `-$${formatCurrency(afp)}`;
    document.getElementById('displayISSS').textContent = `-$${formatCurrency(isss)}`;
    document.getElementById('displayTaxableIncome').textContent = `$${formatCurrency(taxableIncome)}`;
    document.getElementById('displayISR').textContent =
        isr === 0 ? 'Exento' : `-$${formatCurrency(isr)}`;
    document.getElementById('displayNetMensual').textContent = `$${formatCurrency(netSalary)}`;
    document.getElementById('displayNetQuincenal').textContent = `$${formatCurrency(netSalary / 2)}`;

    document.getElementById('emptyState').classList.add('hidden');
    document.getElementById('resultsContent').classList.remove('hidden');
});

// ===================================
// LIMPIAR
// ===================================
document.getElementById('clearBtn').addEventListener('click', () => {
    document.getElementById('employeeName').value = '';
    salaryInput.value = '';
    document.getElementById('emptyState').classList.remove('hidden');
    document.getElementById('resultsContent').classList.add('hidden');
});
