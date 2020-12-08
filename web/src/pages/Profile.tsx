import { useQuery } from "@apollo/client"
import gql from "graphql-tag"
import React from "react"
import CreateProfile from "../components/CreateProfile"
import UpdateProfile from "../components/UpdateProfile"

export const ME_QUERY = gql`
  query me {
    me {
      id
      Profile {
        id
        bio
        location
        website
        avatar
      }
    }
  }
`
function Profile() {
  const { loading, error, data } = useQuery(ME_QUERY)
  if (loading) return <p>Loading...</p>
  if (error) return <p>{error.message}</p>
  console.log(data)
  return (
    <div className="container">
      <h1>Profile</h1>
      {data.me.Profile.id ? <UpdateProfile /> : <CreateProfile />}
      <p>{data.me.Profile.bio}</p>
      <p>{data.me.Profile.location}</p>
      <p>{data.me.Profile.website}</p>
    </div>
  )
}

export default Profile
