// Shared Indian currency formatting utilities for Nidhi Pezhai calculators
function formatINR(val, includeSymbol = true) {
  if (isNaN(val)) return includeSymbol ? "₹ 0" : "0";
  const num = Math.round(val);
  const str = num.toLocaleString("en-IN");
  return includeSymbol ? `₹ ${str}` : str;
}

function formatAmountToWords(amount) {
  if (amount >= 10000000) {
    const cr = (amount / 10000000).toFixed(2);
    return `₹ ${parseFloat(cr)} கோடி`;
  } else if (amount >= 100000) {
    const lk = (amount / 100000).toFixed(2);
    return `₹ ${parseFloat(lk)} லட்சம்`;
  } else if (amount >= 1000) {
    return `₹ ${(amount / 1000).toFixed(1)} ஆயிரம்`;
  }
  return `₹ ${Math.round(amount)}`;
}

