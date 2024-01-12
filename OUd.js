import React, { useState } from 'react';
import '../index.css';

const CalculatorForm = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [mortgageType, setMortgageType] = useState('annuity');
  const [calculationResult, setCalculationResult] = useState([]);
  const [extraRepayment, setExtraRepayment] = useState('');

  const calculateAnnuityMortgage = (loanAmount, interestRate, loanTerm, extraRepayment) => {
    const monthlyInterestRate = interestRate / 100 / 12;
    const totalPayments = loanTerm * 12;
    let remainingLoanAmount = loanAmount;
    let paymentDetails = [];
  
    for (let month = 1; month <= totalPayments; month++) {
      if (remainingLoanAmount <= 0) break; // Stop als de lening volledig is afbetaald
  
      const monthlyPayment = remainingLoanAmount * (monthlyInterestRate / (1 - Math.pow(1 + monthlyInterestRate, -totalPayments)));
      const totalMonthlyPayment = monthlyPayment + extraRepayment;
      const interestPayment = remainingLoanAmount * monthlyInterestRate;
      const principalPayment = totalMonthlyPayment - interestPayment;
  
      remainingLoanAmount -= principalPayment;
  
      paymentDetails.push({
        month, 
        principalPayment: principalPayment < 0 ? 0 : principalPayment, 
        interestPayment, 
        totalPayment: totalMonthlyPayment
      });
    }
  
    return paymentDetails;
  };

  const calculateLinearMortgage = (loanAmount, interestRate, loanTerm, extraRepayment) => {
    const monthlyPrincipalRepayment = loanAmount / (loanTerm * 12);
    let remainingLoanAmount = loanAmount;
    let paymentDetails = [];
  
    for (let month = 1; month <= loanTerm * 12; month++) {
      if (remainingLoanAmount <= 0) break; // Stop als de lening volledig is afbetaald
  
      const interestPayment = remainingLoanAmount * (interestRate / 100 / 12);
      const totalMonthlyPayment = monthlyPrincipalRepayment + interestPayment + extraRepayment;
  
      remainingLoanAmount -= monthlyPrincipalRepayment + extraRepayment;
  
      paymentDetails.push({
        month, 
        principalPayment: monthlyPrincipalRepayment + extraRepayment, 
        interestPayment, 
        totalPayment: totalMonthlyPayment
      });
    }
  
    return paymentDetails;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const loanAmountNum = parseFloat(loanAmount);
    const interestRateNum = parseFloat(interestRate);
    const loanTermNum = parseInt(loanTerm, 10);
    const extraRepaymentNum = parseFloat(extraRepayment || 0);
  
    if (isNaN(loanAmountNum) || isNaN(interestRateNum) || isNaN(loanTermNum) || isNaN(extraRepaymentNum)) {
      // Voeg hier je foutafhandeling toe
      console.error('Een of meer invoerwaarden zijn ongeldig.');
      return;
    }

    const annuityResult = calculateAnnuityMortgage(loanAmountNum, interestRateNum, loanTermNum, extraRepaymentNum);
  const linearResult = calculateLinearMortgage(loanAmountNum, interestRateNum, loanTermNum, extraRepaymentNum);

  const shortestTerm = Math.min(annuityResult.length, linearResult.length);
  const result = mortgageType === 'annuity'
    ? annuityResult.slice(0, shortestTerm).map((payment, index) => ({
        ...payment,
        difference: payment.totalPayment - (linearResult[index]?.totalPayment || 0)
      }))
    : linearResult.slice(0, shortestTerm).map((payment, index) => ({
        ...payment,
        difference: payment.totalPayment - (annuityResult[index]?.totalPayment || 0)
      }));

  setCalculationResult(result);
};

  const totalPayments = calculationResult.reduce((acc, cur) => acc + cur.totalPayment, 0);
  const totalDifference = calculationResult.reduce((acc, cur) => acc + cur.difference, 0);

  return (
    <div className="form-container ">
      <form onSubmit={handleSubmit}>
        <h2>Hypotheek Calculator</h2>
        <div>
          <label>Hypotheekbedrag: </label>
          <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} />
        </div>
        <div>
          <label>Rentepercentage: </label>
          <input type="number" step="0.01" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} />
        </div>
        <div>
          <label>Looptijd (in jaren): </label>
          <input type="number" value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} />
        </div>
        <div>
          <label>Hypotheektype: </label>
          <select value={mortgageType} onChange={(e) => setMortgageType(e.target.value)}>
            <option value="annuity">Annuïtair</option>
            <option value="linear">Lineair</option>
          </select>
        </div>
        <div>
          <label>Extra aflossing (maandelijks): </label>
          <input type="number" value={extraRepayment} onChange={(e) => setExtraRepayment(e.target.value)} />
        </div>
        <button type="submit">Bereken</button>
      </form>
      
      {calculationResult.length > 0 && (
        <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Maand</th>
              <th>Beginsaldo (€)</th>
              <th>Aflossing (€)</th>
              <th>Rente (€)</th>
              <th>Totaal (€)</th>
              <th>{mortgageType === 'annuity' ? 'Verschil t.o.v. lineair' : 'Verschil t.o.v. annuïtair'} (€)</th>
            </tr>
          </thead>
          <tbody>
            {calculationResult.map(({ month, principalPayment, interestPayment, totalPayment, difference, remainingBalance }) => (
              <tr key={month}>
                <td>{month}</td>
                <td>{remainingBalance.toFixed(2)}</td>
                <td>{principalPayment.toFixed(2)}</td>
                <td>{interestPayment.toFixed(2)}</td>
                <td>{totalPayment.toFixed(2)}</td>
                <td>{difference.toFixed(2)}</td>
              </tr>
              ))}
              <tr>
                <td><strong>Totaal</strong></td>
                <td colSpan="2"></td>
                <td><strong>€{totalPayments.toFixed(2)}</strong></td>
                <td><strong>€{totalDifference.toFixed(2)}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CalculatorForm;