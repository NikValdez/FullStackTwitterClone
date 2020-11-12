import { gql, useQuery } from "@apollo/client"
import React from "react"

const USERS_QUERY = gql`
  query USERS_QUERY {
    users {
      id
      name
    }
  }
`

interface User {
  name: string
}

export default function Users() {
  const { loading, error, data } = useQuery(USERS_QUERY)
  if (loading) return <p>Loading...</p>
  if (error) return <p>{error.message}</p>
  return (
    <div>
      {data.users.map((user: User) => (
        <p>{user.name}</p>
      ))}
    </div>
  )
}
