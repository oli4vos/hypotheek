import React from 'react';
import Header from '../components/Header'; // Pas het pad aan indien nodig
import Footer from '../components/Footer'; // Pas het pad aan indien nodig
import CalculatorForm from '../components/CalculatorForm'; // Pas het pad aan indien nodig

const HomePage = () => {
  return (
    <div>
      <Header />
      <CalculatorForm />
      <Footer />
    </div>
  );
};

export default HomePage;
