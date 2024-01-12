// Functie om de belastingteruggaaf te berekenen
export const calculateTaxRelief = (interestPayment, taxRate) => {
    return interestPayment * (taxRate / 100);
  };
  