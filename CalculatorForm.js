import React, { useState } from 'react';
import '../index.css';

const CalculatorForm = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [mortgageType, setMortgageType] = useState('annuity');
  const [calculationResult, setCalculationResult] = useState([]);
  const [discountFactor, setDiscountFactor] = useState('');

  const calculateTimeValue = (difference, loanTerm, month, discountFactor) => {
    const discountRatePerMonth = Math.pow(1 + parseFloat(discountFactor) / 100, 1 / 12);
    return (difference * Math.pow(discountRatePerMonth, loanTerm * 12 - month + 1)) *-1;
  };


  const calculateAnnuityMortgage = (loanAmount, interestRate, loanTerm, discountFactor) => {
    const monthlyInterestRate = interestRate / 100 / 12;
    const totalPayments = loanTerm * 12;
    let remainingLoanAmount = loanAmount;
    let paymentDetails = [];

    for (let month = 1; month <= totalPayments; month++) {
      const interestPayment = remainingLoanAmount * monthlyInterestRate;
      const monthlyPayment = loanAmount * (monthlyInterestRate / (1 - Math.pow(1 + monthlyInterestRate, -totalPayments)));
      const principalPayment = monthlyPayment - interestPayment;
      remainingLoanAmount -= principalPayment;
      const nettoMonthly = principalPayment + 0.6303 * interestPayment;
      const discountRatePerMonth = Math.pow(1 + parseFloat(discountFactor) / 100, 1/12);
      const timeValue = mortgageType === 'annuity'
        ? nettoMonthly * Math.pow(discountRatePerMonth, loanTerm * 12 - month + 1)
        : nettoMonthly * Math.pow(discountRatePerMonth, loanTerm * 12 - month + 1);

      paymentDetails.push({ month, principalPayment, interestPayment, totalPayment: monthlyPayment, nettoMonthly, timeValue});
    }

    return paymentDetails;
  };

  const calculateLinearMortgage = (loanAmount, interestRate, loanTerm, discountRatePerMonth) => {
    let remainingLoanAmount = loanAmount;
    let paymentDetails = [];

    for (let month = 1; month <= loanTerm * 12; month++) {
      const interestPayment = remainingLoanAmount * (interestRate / 100 / 12);
      const monthlyPrincipalRepayment = loanAmount / (loanTerm * 12);
      const totalPayment = monthlyPrincipalRepayment + interestPayment;
      const nettoMonthly = monthlyPrincipalRepayment + 0.6303 * interestPayment;
      const discountRatePerMonth = Math.pow(1 + parseFloat(discountFactor) / 100, 1/12);
      const timeValue = mortgageType === 'Linear'
        ? nettoMonthly * Math.pow(discountRatePerMonth, loanTerm * 12 - month + 1)
        : nettoMonthly * Math.pow(discountRatePerMonth, loanTerm * 12 - month + 1);

      remainingLoanAmount -= monthlyPrincipalRepayment;

      paymentDetails.push({ month, principalPayment: monthlyPrincipalRepayment, interestPayment, totalPayment, nettoMonthly, timeValue});
    }

    return paymentDetails;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const loanAmountNum = parseFloat(loanAmount);
    const interestRateNum = parseFloat(interestRate);
    const loanTermNum = parseInt(loanTerm, 10);
    const discountFactorNum = parseFloat(discountFactor) || 0;

    const annuityResult = calculateAnnuityMortgage(loanAmountNum, interestRateNum, loanTermNum, discountFactorNum);
    const linearResult = calculateLinearMortgage(loanAmountNum, interestRateNum, loanTermNum, discountFactorNum);
  
    const result = mortgageType === 'annuity'
      ? annuityResult.map((payment, index) => {
        const difference = payment.nettoMonthly - (index < linearResult.length ? linearResult[index].nettoMonthly : 0);
        const timeValue = calculateTimeValue(difference, loanTermNum, payment.month, discountFactor);
        return { ...payment, difference, timeValue };
      })
      : linearResult.map((payment, index) => {
        const difference = payment.nettoMonthly - (index < annuityResult.length ? annuityResult[index].nettoMonthly : 0);
        const timeValue = calculateTimeValue(difference, loanTermNum, payment.month, discountFactor);
        return { ...payment, difference, timeValue };
      });

    setCalculationResult(result);
  };

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
          <label>Discount Factor (%): </label>
          <input type="number" step="0.01" value={discountFactor} onChange={(e) => setDiscountFactor(e.target.value)} />
        </div>
        <button type="submit">Bereken</button>
      </form>
      
      {calculationResult.length > 0 && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Maand</th>
                <th>Aflossing (€)</th>
                <th>Rente (€)</th>
                <th>Totaal (€)</th>
                <th>Netto maandlasten (€)</th>
                <th>Verschil met andere type (€)</th>
                <th> Tijdswaarde netto betaling</th>
              </tr>
            </thead>
            <tbody>
              {calculationResult.map(({ month, principalPayment, interestPayment, totalPayment, difference, nettoMonthly, timeValue}) => (
                <tr key={month}>
                  <td>{month}</td>
                  <td>{principalPayment.toFixed(2)}</td>
                  <td>{interestPayment.toFixed(2)}</td>
                  <td>{totalPayment.toFixed(2)}</td>
                  <td>{nettoMonthly.toFixed(2)}</td>
                  <td>{difference.toFixed(2)}</td>
                  <td>{timeValue.toFixed(2)}</td>
                </tr>
              ))}

        {/* Rij voor de totalen */}
              <tr>
                <td><strong>Totaal</strong></td>
                <td><strong>€{calculationResult.reduce((acc, cur) => acc + cur.principalPayment, 0).toFixed(2)}</strong></td>
                <td><strong>€{calculationResult.reduce((acc, cur) => acc + cur.interestPayment, 0).toFixed(2)}</strong></td>
                <td><strong>€{calculationResult.reduce((acc, cur) => acc + cur.totalPayment, 0).toFixed(2)}</strong></td>
                <td><strong>€{calculationResult.reduce((acc, cur) => acc + cur.nettoMonthly, 0).toFixed(2)}</strong></td>
                <td><strong>€{calculationResult.reduce((acc, cur) => acc + cur.difference, 0).toFixed(2)}</strong></td>
                <td><strong>€{calculationResult.reduce((acc, cur) => acc + cur.timeValue, 0).toFixed(2)}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      </div>
);
};

export default CalculatorForm;
