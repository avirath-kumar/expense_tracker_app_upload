import { Route, Routes } from "react-router-dom";

import './App.css';
import { HomePage } from "./components/HomePage.js";
import { BillingCyclePage } from "./components/BillingCyclePage.js";
import { TransactionPage } from "./components/TransactionPage.js";
import { CategorizationPage } from "./components/CategorizationPage.js";

function App() {
  
  return (
    <div className="App">
        <Routes>
          <Route path='/' element={<BillingCyclePage />} />
          <Route path='/home' element={<HomePage />} />
          <Route path='/transactions' element={<TransactionPage />} />
          <Route path='/categorization' element={<CategorizationPage />} />
        </Routes>
    </div>
  );
}

export default App;
