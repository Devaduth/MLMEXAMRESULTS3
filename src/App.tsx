import React, { useState } from "react";
import Header from "./components/Header";
import Result from "./components/Result";
import Footer from "./components/Footer";


function App() {
  
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      <Result />
      <Footer />
    </div>
      
  );
}

export default App;
