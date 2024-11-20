import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { Provider } from "react-redux";
import store from "./store/store.js";
import App from "./App";
import "./assets/css/style.css";
import "./assets/css/satoshi.css";
ReactDOM.createRoot(document.getElementById("root")).render(
    <Auth0Provider
        domain="dev-230wj2ug0zi047sj.us.auth0.com"
        clientId="tTXkYHLgwb729KErOgLGl1uLgyetxdoO"
        authorizationParams={{
            redirect_uri: window.location.origin,
        }}
    >
        <React.StrictMode>
            <Router>
                <Provider store={store}>
                    <App />
                </Provider>
            </Router>
        </React.StrictMode>
    </Auth0Provider>
);
