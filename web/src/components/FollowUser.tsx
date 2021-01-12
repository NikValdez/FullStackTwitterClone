import { useMutation } from "@apollo/client"
import gql from "graphql-tag"
import React from "react"
import { ME_QUERY } from "../pages/Profile"

const FOLLOW_USER_QUERY = gql`
	mutation follow($followId: Int!, $avatar: String!, $name: String!) {
		follow(followId: $followId, avatar: $avatar, name: $name) {
			id
		}
	}
`

interface Props {
	id: number
	name: string
	avatar: string
}

export default function FollowUser({ id, name, avatar }: Props) {
	const [ follow ] = useMutation(FOLLOW_USER_QUERY, {
		refetchQueries: [ { query: ME_QUERY } ]
	})

	const handleFollow = async () => {
		await follow({
			variables: { followId: id, name, avatar }
		})
	}

	return (
		<div>
			<button onClick={handleFollow} className="edit-button">
				Follow
			</button>
		</div>
	)
}
