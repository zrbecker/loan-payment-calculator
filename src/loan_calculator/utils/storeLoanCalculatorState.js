import { computeLoanPayment } from "./finance";
import { valueToNumber } from "./numeralUtils";

const DEFAULT_STATE = {
  loanAmount: 15000,
  years: 4,
  numPayments: 48,
  paymentsPerYear: 12,
  apr: 4,
  payment: computeLoanPayment(15000, 48, 12, 4)
};
const LOCAL_STORAGE_STATE_KEY = "LOCAL_STORAGE_STATE_KEY";

export function storeLoanCalculatorState(state) {
  localStorage.setItem(
    LOCAL_STORAGE_STATE_KEY,
    JSON.stringify({
      loanAmount: state.loanAmount,
      numPayments: state.numPayments,
      paymentsPerYear: state.paymentsPerYear,
      apr: state.apr
    })
  );
}

export function retrieveLoanCalculatorState() {
  const localState = localStorage.getItem(LOCAL_STORAGE_STATE_KEY);
  if (localState) {
    try {
      const parsedState = JSON.parse(localState);

      const loanAmount = valueToNumber(parsedState.loanAmount);
      const numPayments = valueToNumber(parsedState.numPayments);
      const paymentsPerYear = valueToNumber(parsedState.paymentsPerYear);
      const apr = valueToNumber(parsedState.apr);

      const years = numPayments / paymentsPerYear;
      const payment = computeLoanPayment(
        loanAmount,
        numPayments,
        paymentsPerYear,
        apr
      );

      return {
        loanAmount,
        years,
        numPayments,
        paymentsPerYear,
        apr,
        payment
      };
    } catch (ex) {
      console.error(ex);
      return DEFAULT_STATE;
    }
  } else {
    return DEFAULT_STATE;
  }
}
