import { intArg, mutationType, stringArg } from '@nexus/schema'
import { compare, hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { APP_SECRET, getUserId } from '../utils'

export const Mutation = mutationType({
  definition(t) {
    t.field('signup', {
      type: 'AuthPayload',
      args: {
        name: stringArg(),
        email: stringArg({ nullable: false }),
        password: stringArg({ nullable: false }),
      },
      resolve: async (_parent, { name, email, password }, ctx) => {
        const hashedPassword = await hash(password, 10)
        const user = await ctx.prisma.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
          },
        })

        return {
          token: sign({ userId: user.id }, APP_SECRET),
          user,
        }
      },
    })

    t.field('login', {
      type: 'AuthPayload',
      args: {
        email: stringArg({ nullable: false }),
        password: stringArg({ nullable: false }),
      },
      resolve: async (_parent, { email, password }, ctx) => {
        const user = await ctx.prisma.user.findOne({
          where: {
            email,
          },
        })
        if (!user) {
          throw new Error(`No user found for email: ${email}`)
        }
        const passwordValid = await compare(password, user.password)
        if (!passwordValid) {
          throw new Error('Invalid password')
        }
        return {
          token: sign({ userId: user.id }, APP_SECRET),
          user,
        }
      },
    })

    t.field('createProfile', {
      type: 'Profile',
      args: {
        bio: stringArg(),
        location: stringArg(),
        website: stringArg(),
        avatar: stringArg(),
      },
      resolve: (parent, args, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.profile.create({
          data: {
            ...args,
            User: { connect: { id: Number(userId) } },
          },
        })
      },
    })

    t.field('updateProfile', {
      type: 'Profile',
      args: {
        id: intArg(),
        bio: stringArg(),
        location: stringArg(),
        website: stringArg(),
        avatar: stringArg(),
      },
      resolve: (parent, { id, ...args }, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')

        return ctx.prisma.profile.update({
          data: {
            ...args,
          },
          where: {
            id: Number(id),
          },
        })
      },
    })

    t.field('createTweet', {
      type: 'Tweet',
      args: {
        content: stringArg(),
      },
      resolve: (parent, { content }, ctx) => {
        const userId = getUserId(ctx)
        if (!userId) throw new Error('Could not authenticate user.')
        return ctx.prisma.tweet.create({
          data: {
            content,
            author: { connect: { id: Number(userId) } },
          },
        })
      },
    })

    // t.field('deletePost', {
    //   type: 'Post',
    //   nullable: true,
    //   args: { id: intArg({ nullable: false }) },
    //   resolve: (parent, { id }, ctx) => {
    //     return ctx.prisma.post.delete({
    //       where: {
    //         id,
    //       },
    //     })
    //   },
    // })
  },
})
