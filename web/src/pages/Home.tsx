import { gql, useQuery } from "@apollo/client"
import React from "react"
import { useHistory } from "react-router-dom"
import AllTweets from "../components/AllTweets"
import HomPageTweet from "../components/HomePageTweet"
import LeftNav from "../components/LeftNav"
import PopularTweets from "../components/PopularTweets"
import "../styles/home.css"
import "../styles/primary.css"

export const ME_QUERY = gql`
  query me {
    me {
      id
      name
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

function Home() {
  const history = useHistory()
  const { loading, error, data } = useQuery(ME_QUERY)

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error.message}</p>
  return (
    <>
      <div className="primary">
        <div className="left">
          <LeftNav />
        </div>
        <div className="home">
            <div className="home-header">
                <h3 className="home-title">Home</h3>
            </div>
                <HomPageTweet/>
                <AllTweets/>
        </div>
        <div className="right">
          <PopularTweets/>
        </div>
      </div>
    </>
  )
}

export default Home
