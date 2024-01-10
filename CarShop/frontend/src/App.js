import './App.css';
import React from 'react';
import {BrowserRouter as Router,
    Route,
    Routes,
} from "react-router-dom";
import Header from "./components/Header";
import SignIn from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import MyCarsPage from "./pages/MyCarsPage";
import CarPage from "./pages/CarPage";
import AddCarPage from "./pages/AddCarPage";
import MarketPage from "./pages/MarketPage";
import InboxPage from "./pages/InboxPage";
import ConversationPage from "./pages/ConversationPage";

function App() {
  return (
          <Router>
              <div className="container dark">
                  <div className="app">
                      <Header />
                      <Routes>
                          <Route path="/" Component={SignIn}/>
                          <Route path="/my-cars" Component={MyCarsPage}/>
                          <Route path="/market" Component={MarketPage}/>
                          <Route path="/inbox" Component={InboxPage}/>
                          <Route path="/conversation/:id" Component={ConversationPage}/>
                          <Route path="/car/:id" Component={CarPage}/>'
                          <Route path="/add-car" Component={AddCarPage}/>
                          <Route path="/login/" Component={SignIn}/>
                          <Route path="/signup" Component={SignUpPage}/>
                      </Routes>
                  </div>
              </div>
          </Router>
  );
}

export default App;
