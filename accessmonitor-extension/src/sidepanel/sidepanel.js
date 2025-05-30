import React from 'react';
import ReactDOM from 'react-dom/client';

import { Provider } from 'react-redux';

import App from './App';
import store from './store/store';

// const root = ReactDOM.createRoot(document.createElement("root"));

// const rootDiv = document.createElement("div");
// rootDiv.className = "container";

// document.body.appendChild(rootDiv);

// const root = ReactDOM.createRoot(rootDiv);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);