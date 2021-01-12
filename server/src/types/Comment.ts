import { objectType } from "@nexus/schema"

export const Comment = objectType({
	name: "Comment",
	definition(t) {
		t.model.id()
		t.model.content()
		t.model.createdAt()
		t.model.User()
		t.model.Comment()
		t.model.commentId()
	}
})
