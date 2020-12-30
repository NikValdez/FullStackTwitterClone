import { useQuery } from "@apollo/client"
import { formatDistance } from "date-fns"
import { subDays } from "date-fns/esm"
import gql from "graphql-tag"
import React from "react"
import "../styles/allTweets.css"

export const TWEETS_QUERY = gql`
	query TWEETS_QUERY {
		tweets {
			id
			createdAt
			content
			author {
				id
				name
				Profile {
					id
					avatar
				}
			}
		}
	}
`

export default function AllTweets() {
	const { loading, error, data } = useQuery(TWEETS_QUERY)
	if (loading) return <p>Loading...</p>
	if (error) return <p>{error.message}</p>

	interface AllTweets {
		content: string
		createdAt: Date
		author: {
			name: string
			Profile: {
				avatar: string
			}
		}
	}

	return (
		<div>
			{data.tweets.map((tweet: AllTweets) => (
				<div className="tweet-container">
					<div className="tweet-header">
						<img
							src={tweet.author.Profile.avatar}
							style={{ width: "40px", borderRadius: "50%" }}
							alt="avatar"
						/>
						<h4 className="name">{tweet.author.name} </h4>
						<p className="date-time">
							{formatDistance(subDays(new Date(tweet.createdAt), 0), new Date())} ago
						</p>
					</div>
					<p>{tweet.content}</p>
				</div>
			))}
		</div>
	)
}
