import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import './index.css'
import { ANILIST_GRAPHQL_URL } from './constants'
import './i18n'

const client = new ApolloClient({
  uri: ANILIST_GRAPHQL_URL,
  cache: new InMemoryCache()
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
)
