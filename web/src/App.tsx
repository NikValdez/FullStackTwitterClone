import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"
import React from "react"
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import "./App.css"
import Landing from "./components/Landing"
import Users from "./components/Users"

const client = new ApolloClient({
  uri: "http://localhost:4000",
  cache: new InMemoryCache(),
})

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Switch>
          <Route path="/landing" >
            <Landing />
          </Route>
          <Route path="/">
            <Users />
          </Route>
        </Switch>
      </Router>
    </ApolloProvider>
  )
}

export default App
