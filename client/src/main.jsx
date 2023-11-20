import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'; // Import the CSS entry file

import { Auth0Provider } from '@auth0/auth0-react';

// Try this tomorrow: https://developer.auth0.com/resources/guides/spa/react/basic-authentication

ReactDOM.createRoot(document.getElementById('root')).render(
  <Auth0Provider
      domain="dev-3fyicqpw62lwaeft.us.auth0.com"
      clientId="6coRmpQHAQdCeZaw63i2M0vzLUw5FmTr"
      authorizationParams={{
        redirect_uri: "http://localhost:3000/info"
      }}
    >
      <App />
  </Auth0Provider>
);
