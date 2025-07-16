const categorySelect = document.getElementById("category");
const fromUnit = document.getElementById("fromUnit");
const toUnit = document.getElementById("toUnit");
const inputValue = document.getElementById("inputValue");
const resultBox = document.getElementById("result");
const historyList = document.getElementById("history");
const darkModeToggle = document.getElementById("darkModeToggle");
const exportBtn = document.getElementById("exportBtn");

const unitData = {
  length: {
    units: ["meter", "kilometer", "centimeter", "mile", "inch", "foot"],
    toMeter: {
      meter: 1, kilometer: 1000, centimeter: 0.01,
      mile: 1609.34, inch: 0.0254, foot: 0.3048
    }
  },
  weight: {
    units: ["kilogram", "gram", "pound", "ounce"],
    toKilogram: {
      kilogram: 1, gram: 0.001, pound: 0.453592, ounce: 0.0283495
    }
  },
  temperature: {
    units: ["celsius", "fahrenheit", "kelvin"]
  },
  time: {
    units: ["second", "minute", "hour", "day"],
    toSecond: {
      second: 1, minute: 60, hour: 3600, day: 86400
    }
  }
};

function populateUnits() {
  const category = categorySelect.value;
  const units = unitData[category].units;
  fromUnit.innerHTML = units.map(u => `<option value="${u}">${u}</option>`).join('');
  toUnit.innerHTML = units.map(u => `<option value="${u}">${u}</option>`).join('');
  convert();
}

function convert() {
  const val = parseFloat(inputValue.value);
  const from = fromUnit.value;
  const to = toUnit.value;
  const category = categorySelect.value;

  if (isNaN(val)) {
    resultBox.textContent = "Please enter a number";
    return;
  }

  let result = 0;

  if (category === "temperature") {
    result = convertTemp(val, from, to);
  } else {
    const factor = unitData[category][`to${capitalize(unitData[category].units[0])}`];
    const base = val * factor[from];
    result = base / factor[to];
  }

  resultBox.textContent = `${val} ${from} = ${result.toFixed(4)} ${to}`;
  addToHistory(`${val} ${from} → ${result.toFixed(4)} ${to}`);
}

function convertTemp(val, from, to) {
  let tempInCelsius;

  if (from === "celsius") tempInCelsius = val;
  else if (from === "fahrenheit") tempInCelsius = (val - 32) * 5 / 9;
  else if (from === "kelvin") tempInCelsius = val - 273.15;

  if (to === "celsius") return tempInCelsius;
  else if (to === "fahrenheit") return (tempInCelsius * 9 / 5) + 32;
  else if (to === "kelvin") return tempInCelsius + 273.15;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function addToHistory(entry) {
  let history = JSON.parse(localStorage.getItem("conversionHistory") || "[]");
  history.unshift(entry);
  history = history.slice(0, 5);
  localStorage.setItem("conversionHistory", JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem("conversionHistory") || "[]");
  historyList.innerHTML = history.map(item => `<li>${item}</li>`).join('');
}

function exportCSV() {
  const history = JSON.parse(localStorage.getItem("conversionHistory") || "[]");
  if (history.length === 0) return alert("No history to export.");

  let csvContent = "data:text/csv;charset=utf-8,Conversion History\n";
  csvContent += history.join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "conversion_history.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
}

function loadTheme() {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") document.body.classList.add("dark");
}

categorySelect.addEventListener("change", populateUnits);
fromUnit.addEventListener("change", convert);
toUnit.addEventListener("change", convert);
inputValue.addEventListener("input", convert);
darkModeToggle.addEventListener("click", toggleDarkMode);
exportBtn.addEventListener("click", exportCSV);

loadTheme();
populateUnits();
renderHistory();
