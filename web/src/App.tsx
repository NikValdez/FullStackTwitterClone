import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"
import React from "react"
import "./App.css"
import Users from "./components/Users"

const client = new ApolloClient({
  uri: "http://localhost:4000",
  cache: new InMemoryCache(),
})

function App() {
  return (
    <ApolloProvider client={client}>
      <div>
        <Users />
      </div>
    </ApolloProvider>
  )
}

export default App
