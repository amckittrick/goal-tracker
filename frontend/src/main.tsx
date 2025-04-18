import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { GoogleOAuthProvider } from '@react-oauth/google'

import App from './App.tsx'
import './style.scss'

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
});


createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}>
    <StrictMode>
      <ApolloProvider client={client}>
        <App/>
      </ApolloProvider>
    </StrictMode>
  </GoogleOAuthProvider>
)
