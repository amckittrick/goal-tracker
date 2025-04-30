import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context';
import { GoogleOAuthProvider } from '@react-oauth/google'

import App from './App.tsx'
import './style.scss'


export const setCookie = (name: string, value: string, days: number) => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + days);
  document.cookie = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`
};


export const getCookie = (name: string) => {
  const cookies = document.cookie.split("; ").find((row) => row.startsWith(`${name}`));
  return cookies ? cookies.split("=")[1] : null;
};


export const deleteCookie = (name: string) => {
  if (getCookie(name)) {
    document.cookie = `${name}=null; expires=Thu, 01 Jan 1970 00:0:00 UTC; path=/`
  }
};


const httpLink = createHttpLink({
  uri: '/api/graphql',
});


const authLink = setContext((_, {headers}) => {
  // get the authentication token from local storage if it exists
  const token = getCookie("userToken");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})


createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}>
    <StrictMode>
      <ApolloProvider client={client}>
        <App/>
      </ApolloProvider>
    </StrictMode>
  </GoogleOAuthProvider>
)
