/**
 * main.tsx
 * --------
 * Punto de entrada de React. NO se importa ningún archivo .css.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./estilos.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
