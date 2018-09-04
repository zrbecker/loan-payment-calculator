export function computeLoanPayment(
  loanAmount,
  numPayments,
  paymentsPerYear,
  apr
) {
  if (apr === 0) {
    return loanAmount / numPayments;
  } else {
    const interestPerPeriod = apr / 100 / paymentsPerYear;
    const payment =
      (loanAmount *
        Math.pow(1 + interestPerPeriod, numPayments) *
        interestPerPeriod) /
      (Math.pow(1 + interestPerPeriod, numPayments) - 1);
    return payment;
  }
}
