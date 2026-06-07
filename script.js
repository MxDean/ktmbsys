// DOM elements
const distanceInput = document.getElementById('distance');
const attenInput = document.getElementById('attenuation');
const connectorInput = document.getElementById('connector');
const spliceInput = document.getElementById('splice');
const marginInput = document.getElementById('margin');

const distanceKPI = document.getElementById('distanceKPI');
const lossKPI = document.getElementById('lossKPI');
const marginKPI = document.getElementById('marginKPI');
const statusKPIElem = document.getElementById('statusKPI');

const fiberLossP = document.getElementById('fiberLoss');
const connectorLossP = document.getElementById('connectorLoss');
const spliceLossP = document.getElementById('spliceLoss');
const totalLossP = document.getElementById('totalLoss');
const linkAdviceSpan = document.getElementById('linkAdvice');

// Loss constants (standard values)
const CONNECTOR_LOSS_DB = 0.3;
const SPLICE_LOSS_DB = 0.1;

// Default values for reset
const DEFAULT_VALUES = {
    distance: 0,
    attenuation: 0.35,
    connector: 0,
    splice: 0,
    margin: 3
};

// Helper: parse float safely
function parseNumber(value, defaultValue = 0) {
    let parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : (parsed < 0 ? 0 : parsed);
}

// Helper: parse integer for counts (non-negative)
function parseIntSafe(value, defaultValue = 0) {
    let intVal = parseInt(value, 10);
    if (isNaN(intVal) || intVal < 0) return defaultValue;
    return intVal;
}

// Main calculation function
function calculateLoss() {
    // Get all values with validation
    let distance = parseNumber(distanceInput.value, 0);
    let attenuation = parseNumber(attenInput.value, 0.35);
    let connectorQty = parseIntSafe(connectorInput.value, 0);
    let spliceQty = parseIntSafe(spliceInput.value, 0);
    let systemMargin = parseNumber(marginInput.value, 3);
    
    // Calculate individual losses
    let fiberLossVal = distance * attenuation;
    let connectorLossVal = connectorQty * CONNECTOR_LOSS_DB;
    let spliceLossVal = spliceQty * SPLICE_LOSS_DB;
    let totalLossVal = fiberLossVal + connectorLossVal + spliceLossVal + systemMargin;
    
    // Update KPI board
    distanceKPI.innerHTML = distance.toFixed(2) + " <span style='font-size:16px;'>km</span>";
    lossKPI.innerHTML = totalLossVal.toFixed(2) + " dB";
    marginKPI.innerHTML = systemMargin.toFixed(2) + " dB";
    
    // Update detailed results panel
    fiberLossP.innerHTML = `🔹 Fiber Attenuation : <span class="value-badge">${fiberLossVal.toFixed(2)} dB</span>`;
    connectorLossP.innerHTML = `🔹 Connector Loss : <span class="value-badge">${connectorLossVal.toFixed(2)} dB</span>`;
    spliceLossP.innerHTML = `🔹 Splice Loss : <span class="value-badge">${spliceLossVal.toFixed(2)} dB</span>`;
    totalLossP.innerHTML = `📊 TOTAL LOSS (incl. margin) : <span class="value-badge">${totalLossVal.toFixed(2)} dB</span>`;
    
    // Link status evaluation & LED animation
    const isPass = totalLossVal <= 20;
    const ledElement = document.querySelector('.status-led');
    const statusCardDiv = document.querySelector('.status-card');
    
    if (isPass) {
        statusKPIElem.innerHTML = "PASS ✓";
        statusKPIElem.className = "pass";
        if (ledElement) {
            ledElement.style.background = "#22C55E";
            ledElement.style.boxShadow = "0 0 16px #22C55E";
            ledElement.style.animation = "pulseLed 1.2s infinite";
        }
        if (statusCardDiv) statusCardDiv.style.borderBottomColor = "#22C55E";
        if (linkAdviceSpan) {
            linkAdviceSpan.innerHTML = `<span class="signal-icon green"></span> ✅ LINK PASS: Total loss ${totalLossVal.toFixed(2)} dB ≤ 20 dB – Reliable railway comms.`;
            linkAdviceSpan.style.color = "#BBF7D0";
        }
    } else {
        statusKPIElem.innerHTML = "FAIL ✗";
        statusKPIElem.className = "fail";
        if (ledElement) {
            ledElement.style.background = "#EF4444";
            ledElement.style.boxShadow = "0 0 16px #EF4444";
            ledElement.style.animation = "pulseLed 0.9s infinite";
        }
        if (statusCardDiv) statusCardDiv.style.borderBottomColor = "#EF4444";
        if (linkAdviceSpan) {
            linkAdviceSpan.innerHTML = `<span class="signal-icon red"></span> ⚠️ LINK FAIL: Total loss ${totalLossVal.toFixed(2)} dB exceeds 20 dB. Reduce distance, connectors/splices.`;
            linkAdviceSpan.style.color = "#FECACA";
        }
    }
}

// Reset function - clears all inputs to default values
function resetForm() {
    distanceInput.value = DEFAULT_VALUES.distance;
    attenInput.value = DEFAULT_VALUES.attenuation;
    connectorInput.value = DEFAULT_VALUES.connector;
    spliceInput.value = DEFAULT_VALUES.splice;
    marginInput.value = DEFAULT_VALUES.margin;
    
    // Recalculate with default values
    calculateLoss();
}

// Animated digital clock with high visibility
function updateClock() {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
    
    const clockDiv = document.getElementById('clock');
    if (clockDiv) {
        clockDiv.innerHTML = `
            <span class="date-part">📅 ${formattedDate}</span>
            <span class="time-part">⏱️ ${formattedTime}</span>
        `;
    }
}

// Attach live event listeners to inputs
function attachEvents() {
    const inputs = [distanceInput, attenInput, connectorInput, spliceInput, marginInput];
    inputs.forEach(input => {
        input.addEventListener('input', () => calculateLoss());
        input.addEventListener('change', () => calculateLoss());
    });
    
    // Input sanitization for negative values
    distanceInput.addEventListener('change', function() { 
        if (parseFloat(this.value) < 0) this.value = 0; 
        calculateLoss(); 
    });
    
    connectorInput.addEventListener('change', function() { 
        if (parseInt(this.value) < 0) this.value = 0; 
        calculateLoss(); 
    });
    
    spliceInput.addEventListener('change', function() { 
        if (parseInt(this.value) < 0) this.value = 0; 
        calculateLoss(); 
    });
    
    marginInput.addEventListener('change', function() { 
        if (parseFloat(this.value) < 0) this.value = 0; 
        calculateLoss(); 
    });
    
    attenInput.addEventListener('change', function() { 
        if (parseFloat(this.value) < 0) this.value = 0; 
        calculateLoss(); 
    });
}

// Set demo values on initial load (only if fields are empty)
function setDemoValues() {
    if (distanceInput.value === "" || distanceInput.value === "0") {
        distanceInput.value = "14.2";
        attenInput.value = "0.35";
        connectorInput.value = "3";
        spliceInput.value = "5";
        marginInput.value = "3.0";
    }
    calculateLoss();
}

// Handle logo loading error - provide fallback
function handleLogoError(img) {
    img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%231E293B' stroke='%2338BDF8' stroke-width='2'/%3E%3Ctext x='50' y='67' font-size='40' text-anchor='middle' fill='%2338BDF8' font-weight='bold'%3EKTMB%3C/text%3E%3C/svg%3E";
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    attachEvents();
    setDemoValues();
    updateClock();
    setInterval(updateClock, 1000);
    
    const logoImg = document.querySelector('.logo-container img');
    if (logoImg) logoImg.onerror = () => handleLogoError(logoImg);
    
    calculateLoss();
});

// Expose functions to global scope for HTML button calls
window.calculateLoss = calculateLoss;
window.resetForm = resetForm;
