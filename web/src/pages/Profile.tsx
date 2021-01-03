import { gql, useQuery } from "@apollo/client"
import React from "react"
import { Link, useHistory } from "react-router-dom"
import CreateProfile from "../components/CreateProfile"
import LeftNav from "../components/LeftNav"
import UpdateProfile from "../components/UpdateProfile"
import "../styles/primary.css"
import "../styles/profile.css"

export const ME_QUERY = gql`
  query me {
    me {
      id
      name
      likedTweet {
        id
        tweet {
          id
        }
      }
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
        <div className="profile">
          <div className="profile-info">
            <div className="profile-head">
              <span className="back-arrow" onClick={() => history.goBack()}>
                <i className="fa fa-arrow-left" aria-hidden="true"></i>
              </span>
              <span className="nickname">
                <h3>{data.me.name}</h3>
              </span>
            </div>
            <div className="avatar">
              {data.me.Profile?.avatar ? (
                <img
                  src={data.me.Profile.avatar}
                  style={{ width: "150px", borderRadius: "50%" }}
                  alt="avatar"
                />
              ) : (
                <i className="fa fa-user fa-5x" aria-hidden="true"></i>
              )}
            </div>
            <div className="make-profile">
              {data.me.Profile ? <UpdateProfile /> : <CreateProfile />}
            </div>

            <h3 className="name">{data.me.name}</h3>

            {data.me.Profile ? (
              <p>
                <i className="fas fa-link"> </i>{" "}
                <Link
                  to={{ pathname: `http://${data.me.Profile.website}` }}
                  target="_blank"
                >
                  {data.me.Profile.website}
                </Link>
              </p>
            ) : null}
            <div className="followers">
              <p>200 following</p>
              <p>384 followers</p>
            </div>
          </div>
        </div>
        <div className="right">
          Right
          {/* <PopularNetworks /> */}
        </div>
      </div>
    </>
  )
}

export default Profile
