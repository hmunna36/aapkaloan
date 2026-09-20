/** Standard reducing-balance EMI. `annualRate` in percent, `months` as an integer. */
export function calculateEmi(principal: number, annualRate: number, months: number) {
  if (principal <= 0 || months <= 0) return { emi: 0, totalInterest: 0, totalPayable: 0 };
  const r = annualRate / 12 / 100;
  const emi = r === 0 ? principal / months : (principal * r * (1 + r) ** months) / ((1 + r) ** months - 1);
  const totalPayable = emi * months;
  return { emi, totalInterest: totalPayable - principal, totalPayable };
}

/** Year-by-year principal / interest split for the amortisation chart. */
export function yearlySchedule(principal: number, annualRate: number, months: number) {
  const { emi } = calculateEmi(principal, annualRate, months);
  const r = annualRate / 12 / 100;
  let balance = principal;
  const years: { year: number; principal: number; interest: number; balance: number }[] = [];
  for (let m = 1; m <= months; m++) {
    const interest = balance * r;
    const principalPart = Math.min(emi - interest, balance);
    balance = Math.max(0, balance - principalPart);
    const y = Math.ceil(m / 12);
    if (!years[y - 1]) years[y - 1] = { year: y, principal: 0, interest: 0, balance };
    years[y - 1].principal += principalPart;
    years[y - 1].interest += interest;
    years[y - 1].balance = balance;
  }
  return years;
}

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/** ₹ 12,34,567 */
export function formatINR(n: number) {
  return `₹${inr.format(Math.round(n))}`;
}

/** ₹12.5 L / ₹1.25 Cr — compact Indian notation for labels. */
export function formatINRShort(n: number) {
  if (n >= 1e7) return `₹${trim(n / 1e7)} Cr`;
  if (n >= 1e5) return `₹${trim(n / 1e5)} L`;
  if (n >= 1e3) return `₹${trim(n / 1e3)} K`;
  return `₹${Math.round(n)}`;
}

function trim(n: number) {
  return n.toFixed(2).replace(/\.?0+$/, "");
}
