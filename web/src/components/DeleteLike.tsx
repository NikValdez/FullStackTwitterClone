import { useMutation } from "@apollo/client"
import gql from "graphql-tag"
import { ME_QUERY } from "../pages/Profile"
import { TWEETS_QUERY } from "./AllTweets"

const DELETE_LIKE_MUTATION = gql`
	mutation deleteLike($id: Int!) {
		deleteLike(id: $id) {
			id
		}
	}
`

interface Props {
	id: number
}

export default function DeleteLike({ id }: Props) {
	const [ deleteLike ] = useMutation(DELETE_LIKE_MUTATION, {
		refetchQueries: [ { query: TWEETS_QUERY }, { query: ME_QUERY } ]
	})

	const handleDeleteLike = async () => {
		await deleteLike({
			variables: { id }
		})
	}

	return (
		<span onClick={handleDeleteLike} style={{ marginRight: "5px" }}>
			<i className="fas fa-thumbs-up" aria-hidden="true" />
		</span>
	)
}
