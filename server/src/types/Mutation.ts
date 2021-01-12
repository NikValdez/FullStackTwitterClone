import { intArg, mutationType, stringArg } from "@nexus/schema"
import { compare, hash } from "bcryptjs"
import { sign } from "jsonwebtoken"
import { APP_SECRET, getUserId } from "../utils"

export const Mutation = mutationType({
	definition(t) {
		t.field("signup", {
			type: "AuthPayload",
			args: {
				name: stringArg(),
				email: stringArg({ nullable: false }),
				password: stringArg({ nullable: false })
			},
			resolve: async (_parent, { name, email, password }, ctx) => {
				const hashedPassword = await hash(password, 10)
				const user = await ctx.prisma.user.create({
					data: {
						name,
						email,
						password: hashedPassword
					}
				})

				return {
					token: sign({ userId: user.id }, APP_SECRET),
					user
				}
			}
		})

		t.field("login", {
			type: "AuthPayload",
			args: {
				email: stringArg({ nullable: false }),
				password: stringArg({ nullable: false })
			},
			resolve: async (_parent, { email, password }, ctx) => {
				const user = await ctx.prisma.user.findOne({
					where: {
						email
					}
				})
				if (!user) {
					throw new Error(`No user found for email: ${email}`)
				}
				const passwordValid = await compare(password, user.password)
				if (!passwordValid) {
					throw new Error("Invalid password")
				}
				return {
					token: sign({ userId: user.id }, APP_SECRET),
					user
				}
			}
		})

		t.field("createProfile", {
			type: "Profile",
			args: {
				bio: stringArg(),
				location: stringArg(),
				website: stringArg(),
				avatar: stringArg()
			},
			resolve: (parent, args, ctx) => {
				const userId = getUserId(ctx)
				if (!userId) throw new Error("Could not authenticate user.")
				return ctx.prisma.profile.create({
					data: {
						...args,
						User: { connect: { id: Number(userId) } }
					}
				})
			}
		})

		t.field("updateProfile", {
			type: "Profile",
			args: {
				id: intArg(),
				bio: stringArg(),
				location: stringArg(),
				website: stringArg(),
				avatar: stringArg()
			},
			resolve: (parent, { id, ...args }, ctx) => {
				const userId = getUserId(ctx)
				if (!userId) throw new Error("Could not authenticate user.")

				return ctx.prisma.profile.update({
					data: {
						...args
					},
					where: {
						id: Number(id)
					}
				})
			}
		})

		t.field("createTweet", {
			type: "Tweet",
			args: {
				content: stringArg()
			},
			resolve: (parent, { content }, ctx) => {
				const userId = getUserId(ctx)
				if (!userId) throw new Error("Could not authenticate user.")
				return ctx.prisma.tweet.create({
					data: {
						content,
						author: { connect: { id: Number(userId) } }
					}
				})
			}
		})
		t.field("likeTweet", {
			type: "LikedTweet",
			args: {
				id: intArg()
			},
			resolve: (parent, { id }, ctx) => {
				const userId = getUserId(ctx)
				if (!userId) throw new Error("Could not authenticate user.")
				return ctx.prisma.likedTweet.create({
					data: {
						tweet: { connect: { id: Number(id) } },
						User: { connect: { id: Number(userId) } }
					}
				})
			}
		})
		t.field("deleteLike", {
			type: "LikedTweet",
			args: {
				id: intArg({ nullable: false })
			},
			resolve: (parent, { id }, ctx) => {
				const userId = getUserId(ctx)
				if (!userId) throw new Error("Could not authenticate user.")
				return ctx.prisma.likedTweet.delete({
					where: { id: id }
				})
			}
		})
		t.field("createComment", {
			type: "Comment",
			args: {
				content: stringArg({ nullable: false }),
				id: intArg({ nullable: false })
			},
			resolve: (parent, { content, id }, ctx) => {
				const userId = getUserId(ctx)
				if (!userId) throw new Error("Could not authenticate user.")
				return ctx.prisma.comment.create({
					data: {
						content,
						User: { connect: { id: Number(userId) } },
						Tweet: { connect: { id: Number(id) } }
					}
				})
			}
		})
		t.field("createReply", {
			type: "Comment",
			args: {
				content: stringArg({ nullable: false }),
				id: intArg({ nullable: false }),
				commentId: intArg()
			},
			resolve: (parent, { content, id, commentId }, ctx) => {
				const userId = getUserId(ctx)
				if (!userId) throw new Error("Could not authenticate user.")
				return ctx.prisma.comment.create({
					data: {
						content,
						User: { connect: { id: Number(userId) } },
						Tweet: { connect: { id: Number(id) } },
						Comment: { connect: { id: Number(commentId) } }
					}
				})
			}
		})
		t.field("follow", {
			type: "Following",
			args: {
				name: stringArg({ nullable: false }),
				followId: intArg({ nullable: false }),
				avatar: stringArg({ nullable: false })
			},
			resolve: (parent, { name, followId, avatar }, ctx) => {
				const userId = getUserId(ctx)
				if (!userId) throw new Error("Could not authenticate user.")
				return ctx.prisma.following.create({
					data: {
						name,
						avatar,
						followId,
						User: { connect: { id: Number(userId) } }
					}
				})
			}
		})
		t.field("deleteFollow", {
			type: "Following",
			args: {
				id: intArg({ nullable: false })
			},
			resolve: (parent, { id }, ctx) => {
				const userId = getUserId(ctx)
				if (!userId) throw new Error("Could not authenticate user.")
				return ctx.prisma.following.delete({
					where: { id: id }
				})
			}
		})
	}
})
