import { useQuery } from "@apollo/client"
import { format } from "date-fns"
import gql from "graphql-tag"
import React from "react"
import "../styles/popularTweets.css"

export const POPULAR_TWEETS = gql`
	query POPULAR_TWEETS {
		tweets {
			id
			createdAt
			content
			author {
				id
				Profile {
					id
					avatar
				}
			}
			likes {
				id
			}
		}
	}
`

interface Tweet {
	id: number
	createdAt: Date
	content: string
	author: {
		Profile: {
			avatar: string
		}
	}
	likes: {
		id: number
		length: number
	}
}

export default function PopularTweets() {
	const { loading, error, data } = useQuery(POPULAR_TWEETS)
	if (loading) return <p>Loading...</p>
	if (error) return <p>{error.message}</p>

	const getPopularTweets = data.tweets
		.map((tweet: Tweet) => tweet)
		.sort(function(a: Tweet, b: Tweet) {
			return b.likes.length - a.likes.length
		})
		.slice(0, 6)

	return (
		<div className="popular-tweets">
			<h3 className="trending">Trending</h3>
			{getPopularTweets.map((tweet: Tweet) => (
				<div className="popular-tweet-container" key={tweet.id}>
					<div className="date-title">
						<div className="title-logo">
							<img
								src={tweet.author.Profile.avatar}
								style={{ width: "40px", borderRadius: "50%" }}
								alt="avatar"
							/>
							<p className="tweet-content">{tweet.content}</p>
						</div>
						<p className="date">{format(new Date(tweet.createdAt), "MM/dd/yy")}</p>
					</div>
					<div className="tweet-likes">
						{tweet.likes.length > 0 ? <span>Likes {tweet.likes.length}</span> : null}
					</div>
				</div>
			))}
		</div>
	)
}
