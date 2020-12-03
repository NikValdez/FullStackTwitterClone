import { objectType } from '@nexus/schema'

export const Tweet = objectType({
  name: 'Tweet',
  definition(t) {
    t.model.id()
    t.model.content()
    t.model.author()
  },
})
