import { gql, useQuery } from "@apollo/client"
import React from "react"
import { Link, useHistory, useParams } from "react-router-dom"
import FollowUser from "../components/FollowUser"
import LeftNav from "../components/LeftNav"
import PopularTweets from "../components/PopularTweets"
import UnfollowUser from "../components/UnfollowUser"
import "../styles/primary.css"
import "../styles/profile.css"
import { ME_QUERY } from "./Profile"

export const USER_QUERY = gql`
  query user($id: Int) {
    user(id: $id) {
      id
      name
      Profile {
          id 
          avatar
          website
      }
  }
  }
`

interface ParamType {
    id: string
}

function SingleUser() {
  const history = useHistory()
  const {id} = useParams<ParamType>()

  const { loading, error, data } = useQuery(USER_QUERY, {
      variables: {id: parseInt(id)}
  })
	const { loading: meLoading, error: meError, data: meData } = useQuery(ME_QUERY)

	if (loading) return <p>Loading...</p>
	if (error) return <p>{error.message}</p>

	if (meLoading) return <p>Loading...</p>
	if (meError) return <p>{meError.message}</p>

interface FollowerIds {
    followId: number
    id: number
}

const idOfFollowers = meData.me.Following.map((follow: FollowerIds) => 
follow.followId
)
const follows = meData.me.Following.map((follow: FollowerIds) => 
follow
)

const getFollowId = follows.filter((follow: any) => follow.followId === data.user.id)




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
                <h3>{data.user.name}</h3>
              </span>
            </div>
            <div className="avatar">
              {data.user.Profile?.avatar ? (
                <img
                  src={data.user.Profile.avatar}
                  style={{ width: "150px", borderRadius: "50%" }}
                  alt="avatar"
                />
              ) : (
                <i className="fa fa-user fa-5x" aria-hidden="true"></i>
              )}
            </div>
            <div className="make-profile">
                {idOfFollowers.includes(data.user.id) ? (
                    <UnfollowUser id={getFollowId[0].id}/>
                    ):<FollowUser id={data.user.id} name={data.user.name} avatar={data.user.Profile.avatar}/>
                    }
            </div>

            <h3 className="name">{data.user.name}</h3>

            {data.user.Profile ? (
              <p>
                <i className="fas fa-link"> </i>{" "}
                <Link
                  to={{ pathname: `http://${data.user.Profile.website}` }}
                  target="_blank"
                >
                  {data.user.Profile.website}
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
          <PopularTweets/>
        </div>
      </div>
    </>
  )
}

export default SingleUser
