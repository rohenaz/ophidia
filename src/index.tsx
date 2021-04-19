import { Router } from "@reach/router";
import React from "react";
import ReactDOM from "react-dom";
import Header from "./components/layout/Header";
import GamePage from "./components/pages/GamePage";
import LandingPage from "./components/pages/LandingPage";
import ResultsPage from "./components/pages/ResultsPage";
import AppContext from "./context";
import "./fonts.css";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <AppContext>
      <Header />
      <Router>
        <LandingPage path="/" />
        <GamePage path="/game" />
        <ResultsPage path="/results" />
      </Router>
    </AppContext>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
