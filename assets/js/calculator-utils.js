// Shared Indian currency formatting utilities for Nidhi Pezhai calculators
function formatINR(val, includeSymbol = true) {
  if (isNaN(val)) return includeSymbol ? "₹\u00A00" : "0";
  const num = Math.round(val);
  const str = num.toLocaleString("en-IN");
  return includeSymbol ? `₹\u00A0${str}` : str;
}

function formatAmountToWords(amount) {
  if (amount >= 10000000) {
    const cr = (amount / 10000000).toFixed(2);
    return `₹\u00A0${parseFloat(cr)} கோடி`;
  } else if (amount >= 100000) {
    const lk = (amount / 100000).toFixed(2);
    return `₹\u00A0${parseFloat(lk)} லட்சம்`;
  } else if (amount >= 1000) {
    return `₹\u00A0${(amount / 1000).toFixed(1)} ஆயிரம்`;
  }
  return `₹\u00A0${Math.round(amount)}`;
}

// Universal Calculator Reset handler
function resetAllCalculatorInputs() {
  const container = document.querySelector("main") || document;
  const inputs = [...container.querySelectorAll("input, select")];
  
  inputs.forEach((elem) => {
    if (elem.type === "checkbox" || elem.type === "radio") {
      elem.checked = elem.defaultChecked;
    } else if (elem.tagName === "SELECT") {
      const defaultOpt = [...elem.options].findIndex((opt) => opt.defaultSelected);
      elem.selectedIndex = defaultOpt >= 0 ? defaultOpt : 0;
    } else {
      elem.value = elem.defaultValue;
    }
  });

  // Reset mode buttons or tabs if present
  const defaultTab = container.querySelector(".sip-mode-btn[data-mode='regular'], .tab-btn[data-default='true'], [data-default-tab='true']");
  if (defaultTab && typeof defaultTab.click === "function") {
    defaultTab.click();
  }

  // Trigger input and change events so all calculator listeners refresh calculations
  inputs.forEach((elem) => {
    elem.dispatchEvent(new Event("input", { bubbles: true }));
    elem.dispatchEvent(new Event("change", { bubbles: true }));
  });

  // Visual pulse on reset buttons
  const resetBtns = document.querySelectorAll("#btnReset, #btnHeaderReset, .calc-reset-btn");
  resetBtns.forEach((btn) => {
    btn.classList.add("calc-reset-btn--active");
    setTimeout(() => btn.classList.remove("calc-reset-btn--active"), 350);
  });
}

function initCalculatorResetListeners() {
  const resetBtns = document.querySelectorAll("#btnReset, #btnHeaderReset, .calc-reset-btn");
  resetBtns.forEach((btn) => {
    btn.removeEventListener("click", resetAllCalculatorInputs);
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      resetAllCalculatorInputs();
    });
  });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCalculatorResetListeners);
  } else {
    initCalculatorResetListeners();
  }
}

if (typeof window !== "undefined") {
  window.resetAllCalculatorInputs = resetAllCalculatorInputs;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { formatINR, formatAmountToWords, resetAllCalculatorInputs };
}


