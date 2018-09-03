import React, { Component } from "react";
import {
  Button,
  ControlLabel,
  FormControl,
  FormGroup,
  InputGroup,
  Panel
} from "react-bootstrap";
import numeral from "numeral";

import "./LoanCalculator.css";

const DEFAULT_STATE = {
  loanAmount: formatNumber(15000),
  years: formatNumber(4),
  numPayments: formatNumber(48),
  paymentsPerYear: formatNumber(12),
  apr: formatNumber(4)
};
const LOCAL_STORAGE_STATE_KEY = "LOCAL_STORAGE_STATE_KEY";

function formatNumber(value) {
  if (isFinite(value)) {
    return numeral(value).format("0,0.00");
  } else {
    return String(value);
  }
}

export default class LoanCalculator extends Component {
  constructor(props) {
    super(props);

    const localState = localStorage.getItem(LOCAL_STORAGE_STATE_KEY);
    if (localState) {
      try {
        this.state = JSON.parse(localState);
      } catch (ex) {
        console.error(ex);
        this.state = DEFAULT_STATE;
      }
    } else {
      this.state = DEFAULT_STATE;
    }
  }

  componentDidMount() {
    this.computePayment();
  }

  setState(updater, callback) {
    super.setState(updater, () => {
      localStorage.setItem(LOCAL_STORAGE_STATE_KEY, JSON.stringify(this.state));
      if (callback) {
        callback();
      }
    });
  }

  computePayment() {
    const loanAmount = numeral(this.state.loanAmount).value();
    const numPayments = numeral(this.state.numPayments).value();
    const paymentsPerYear = numeral(this.state.paymentsPerYear).value();
    const apr = numeral(this.state.apr).value() / 100;

    let payment;
    if (apr === 0) {
      payment = loanAmount / numPayments;
    } else {
      const interestPerPeriod = apr / paymentsPerYear;
      payment =
        (loanAmount *
          Math.pow(1 + interestPerPeriod, numPayments - 1) *
          interestPerPeriod) /
        (Math.pow(1 + interestPerPeriod, numPayments) - 1);
    }

    this.setState({ payment: payment.toFixed(2) });
  }

  onChange(field, e) {
    this.setState({ [field]: e.target.value });
  }

  onBlur(field, e) {
    const targetValue = numeral(e.target.value).value();
    switch (field) {
      case "years":
        this.setState(state => {
          return {
            years: formatNumber(targetValue),
            numPayments: formatNumber(targetValue * state.paymentsPerYear)
          };
        });
        break;
      case "numPayments":
        this.setState(state => {
          return {
            years: formatNumber(targetValue / state.paymentsPerYear),
            numPayments: formatNumber(targetValue)
          };
        });
        break;
      case "paymentsPerYear":
        this.setState(state => {
          return {
            numPayments: formatNumber(targetValue * state.years),
            paymentsPerYear: formatNumber(targetValue)
          };
        });
        break;
      default:
        this.setState({ [field]: formatNumber(targetValue) });
        break;
    }
  }

  onSubmit(e) {
    e.preventDefault();
    this.computePayment();
  }

  render() {
    return (
      <Panel className="LoanCalculator" bsStyle="primary">
        <Panel.Heading>
          <Panel.Title>Loan Payment Calculator</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <form onSubmit={e => this.onSubmit(e)}>
            <FormGroup>
              <ControlLabel>Loan Amount</ControlLabel>
              <InputGroup>
                <InputGroup.Addon>$</InputGroup.Addon>
                <FormControl
                  type="text"
                  value={this.state.loanAmount}
                  onChange={e => this.onChange("loanAmount", e)}
                  onBlur={e => this.onBlur("loanAmount", e)}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Years</ControlLabel>
              <FormControl
                type="text"
                value={this.state.years}
                onChange={e => this.onChange("years", e)}
                onBlur={e => this.onBlur("years", e)}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Number of Payments</ControlLabel>
              <FormControl
                type="text"
                value={this.state.numPayments}
                onChange={e => this.onChange("numPayments", e)}
                onBlur={e => this.onBlur("numPayments", e)}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Payments per Year</ControlLabel>
              <FormControl
                type="text"
                value={this.state.paymentsPerYear}
                onChange={e => this.onChange("paymentsPerYear", e)}
                onBlur={e => this.onBlur("paymentsPerYear", e)}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>APR</ControlLabel>
              <InputGroup>
                <FormControl
                  type="text"
                  value={this.state.apr}
                  onChange={e => this.onChange("apr", e)}
                  onBlur={e => this.onBlur("apr", e)}
                />
                <InputGroup.Addon>%</InputGroup.Addon>
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Payment</ControlLabel>
              <InputGroup>
                <InputGroup.Addon>$</InputGroup.Addon>
                <FormControl
                  type="text"
                  value={formatNumber(this.state.payment)}
                  readOnly={true}
                />
              </InputGroup>
            </FormGroup>
            <Button type="submit" bsStyle="primary">
              Compute Payment
            </Button>
          </form>
        </Panel.Body>
      </Panel>
    );
  }
}
