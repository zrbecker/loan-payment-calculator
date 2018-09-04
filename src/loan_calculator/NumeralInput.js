import React, { Component } from "react";
import { InputGroup, FormControl } from "react-bootstrap";

import { valueToString, valueToNumber } from "./utils/numeralUtils";

const CURRENCY_SYMBOL = "$";
const PERCENTAGE_SYMBOL = "%";

export default class NumeralInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: valueToString(props.value),
      value: valueToNumber(props.value)
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.setState({
        inputValue: valueToString(this.props.value),
        value: valueToNumber(this.props.value)
      });
    }
  }

  onChange(e) {
    this.setState({ inputValue: e.target.value });
  }

  onBlur(e) {
    this.setState(
      {
        inputValue: valueToString(e.target.value),
        value: valueToNumber(e.target.value)
      },
      () => {
        if (this.props.onBlur) {
          this.props.onBlur(valueToNumber(this.state.value));
        }
      }
    );
  }

  renderFormControl() {
    return (
      <FormControl
        type="text"
        value={this.state.inputValue}
        onBlur={e => this.onBlur(e)}
        onChange={e => this.onChange(e)}
        readOnly={this.props.readOnly}
      />
    );
  }

  render() {
    if (this.props.isCurrency || this.props.isPercentage) {
      return (
        <InputGroup>
          {this.props.isCurrency ? (
            <InputGroup.Addon>{CURRENCY_SYMBOL}</InputGroup.Addon>
          ) : null}
          {this.renderFormControl()}
          {this.props.isPercentage ? (
            <InputGroup.Addon>{PERCENTAGE_SYMBOL}</InputGroup.Addon>
          ) : null}
        </InputGroup>
      );
    } else {
      return this.renderFormControl();
    }
  }
}
