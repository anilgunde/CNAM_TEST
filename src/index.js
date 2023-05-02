import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import App from "./App";
import theme from "./Styles/style";
import "./css/left.css";
import "./css/right.css";
import "./Styles/index.css";
import Spinner from "./components/Common/Spinner";
import "bootstrap/dist/css/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";
import "@react-pdf-viewer/core/lib/styles/index.css";

import { getConfig } from "./utils/config";

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <React.StrictMode>
      <CssBaseline />
      <Suspense fallback={<Spinner />}>
        <Router basename={getConfig("CONTEXT_ROOT")}>
          <App />
        </Router>
      </Suspense>
    </React.StrictMode>
  </ThemeProvider>,
  document.getElementById("root"),
);
