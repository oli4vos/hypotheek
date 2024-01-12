export const calculateInterestBenefit = (loanAmount, interestRate, loanTerm, extraRepayment) => {
    const monthlyInterestRate = interestRate / 100 / 12;
    let remainingLoanAmountWithExtra = loanAmount;
    let remainingLoanAmountWithoutExtra = loanAmount;
    let totalInterestWithExtra = 0;
    let totalInterestWithoutExtra = 0;
  
    for (let month = 1; month <= loanTerm * 12; month++) {
      const interestWithExtra = remainingLoanAmountWithExtra * monthlyInterestRate;
      const interestWithoutExtra = remainingLoanAmountWithoutExtra * monthlyInterestRate;
  
      totalInterestWithExtra += interestWithExtra;
      totalInterestWithoutExtra += interestWithoutExtra;
  
      // Berekeningen met extra aflossing
      remainingLoanAmountWithExtra -= (loanAmount / (loanTerm * 12)) + extraRepayment;
  
      // Berekeningen zonder extra aflossing
      remainingLoanAmountWithoutExtra -= loanAmount / (loanTerm * 12);
  
      if (remainingLoanAmountWithExtra <= 0) break;
    }
  
    return totalInterestWithoutExtra - totalInterestWithExtra;
  };
  