import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css';
import App from './App.jsx';

import { StrictMode } from 'react';

const onRedirectCallback = (appState) => {
  window.history.replaceState({}, document.title, appState?.returnTo || "/");
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
    domain="dev-lxi2vw3wbdo4kdcp.us.auth0.com"
    clientId="n2Z6qcKT4lYv5f8q23uCVuZdhHLFSypt"
    authorizationParams={{redirect_uri: window.location.origin}}
    useRefreshTokens={true}
    cacheLocation='localstorage'
    onRedirectCallback={onRedirectCallback}
  >
    <App />
  </Auth0Provider>
  </StrictMode>
)
