import { useMutation } from "@apollo/client"
import gql from "graphql-tag"
import React from "react"
import { ME_QUERY } from "../pages/Profile"

const DELETE_FOLLOW_USER_QUERY = gql`
	mutation deleteFollow($id: Int!) {
		deleteFollow(id: $id) {
			id
		}
	}
`

interface Props {
	id: string
}

export default function UnfollowUser({ id }: Props) {
	const [ deleteFollow ] = useMutation(DELETE_FOLLOW_USER_QUERY, {
		refetchQueries: [ { query: ME_QUERY } ]
	})

	const handleUnFollow = async () => {
		await deleteFollow({
			variables: { id: parseInt(id) }
		})
	}

	return (
		<div>
			<button onClick={handleUnFollow} className="edit-button">
				Unfollow
			</button>
		</div>
	)
}
