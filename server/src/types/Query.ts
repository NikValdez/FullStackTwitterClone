import { intArg, queryType } from "@nexus/schema"
import { getUserId } from "../utils"

export const Query = queryType({
	definition(t) {
		t.field("me", {
			type: "User",
			nullable: true,
			resolve: (parent, args, ctx) => {
				const userId = getUserId(ctx)
				return ctx.prisma.user.findOne({
					where: {
						id: Number(userId)
					}
				})
			}
		})

		t.list.field("users", {
			type: "User",
			resolve: (parent, args, ctx) => {
				return ctx.prisma.user.findMany()
			}
		})
		t.list.field("tweets", {
			type: "Tweet",
			resolve: (parent, args, ctx) => {
				return ctx.prisma.tweet.findMany()
			}
		})

		t.field("tweet", {
			type: "Tweet",
			nullable: true,
			args: { id: intArg() },
			resolve: (parent, { id }, ctx) => {
				return ctx.prisma.tweet.findOne({
					where: {
						id: Number(id)
					}
				})
			}
		})
		t.field("user", {
			type: "User",
			nullable: true,
			args: { id: intArg() },
			resolve: (parent, { id }, ctx) => {
				return ctx.prisma.user.findOne({
					where: {
						id: Number(id)
					}
				})
			}
		})
	}
})
