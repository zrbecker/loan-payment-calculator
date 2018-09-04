import React, { Component } from "react";
import { Button, ControlLabel, FormGroup, Panel } from "react-bootstrap";
import NumeralInput from "./NumeralInput";
import { computeLoanPayment } from "./utils/finance";
import {
  storeLoanCalculatorState,
  retrieveLoanCalculatorState
} from "./utils/storeLoanCalculatorState";

const FORM_FIELDS = [
  { label: "Loan Amount", stateKey: "loanAmount", isCurrency: true },
  { label: "Years", stateKey: "years" },
  { label: "Number of Payments", stateKey: "numPayments" },
  { label: "Payments per Year", stateKey: "paymentsPerYear" },
  { label: "APR", stateKey: "apr", isPercentage: true },
  {
    label: "Payment",
    stateKey: "payment",
    isCurrency: true,
    readOnly: true
  }
];

export default class LoanCalculator extends Component {
  constructor(props) {
    super(props);
    this.state = retrieveLoanCalculatorState();
  }

  setState(updater, callback) {
    super.setState(updater, () => {
      storeLoanCalculatorState(this.state);
      if (callback) {
        callback();
      }
    });
  }

  onBlur(field, value) {
    this.setState(state => {
      const updater = { [field]: value };
      if (field === "years") {
        updater.numPayments = value * state.paymentsPerYear;
      } else if (field === "numPayments") {
        updater.years = value / state.paymentsPerYear;
      } else if (field === "paymentsPerYear") {
        updater.numPayments = value * state.years;
      }
      return updater;
    });
  }

  onSubmit(e) {
    e.preventDefault();
    this.setState(state => {
      const { loanAmount, numPayments, paymentsPerYear, apr } = state;
      return {
        payment: computeLoanPayment(
          loanAmount,
          numPayments,
          paymentsPerYear,
          apr
        )
      };
    });
  }

  renderFields(formFields) {
    return formFields.map(
      ({ label, stateKey, isCurrency, isPercentage, readOnly }) => (
        <FormGroup key={stateKey}>
          <ControlLabel>{label}</ControlLabel>
          <NumeralInput
            value={this.state[stateKey]}
            onBlur={value => this.onBlur(stateKey, value)}
            isCurrency={isCurrency}
            isPercentage={isPercentage}
            readOnly={readOnly}
          />
        </FormGroup>
      )
    );
  }

  render() {
    return (
      <Panel className="LoanCalculator" bsStyle="primary">
        <Panel.Heading>
          <Panel.Title>Loan Payment Calculator</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <form onSubmit={e => this.onSubmit(e)}>
            {this.renderFields(FORM_FIELDS)}
            <Button type="submit" bsStyle="primary">
              Compute Payment
            </Button>
          </form>
        </Panel.Body>
      </Panel>
    );
  }
}
