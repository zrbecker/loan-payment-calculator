import React, { Component } from "react";
import LoanCalculator from "./loan_calculator/LoanCalculator";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <LoanCalculator />
      </div>
    );
  }
}

export default App;
