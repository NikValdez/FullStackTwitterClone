import { objectType } from "@nexus/schema"

export const User = objectType({
	name: "User",
	definition(t) {
		t.model.id()
		t.model.name()
		t.model.email()
		t.model.tweets({ pagination: false })
		t.model.Profile()
		t.model.likedTweet()
		t.model.comments()
		t.model.Following()
	}
})
