import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('palettes')
      .withIndex('by_creation_time')
      .order('desc')
      .collect()
  },
})

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    try {
      const all = await ctx.db
        .query('palettes')
        .withIndex('by_creation_time')
        .order('desc')
        .collect()

      if (!args.query.trim()) return all

      const lower = args.query.toLowerCase()
      return all.filter((p) => p.name.toLowerCase().includes(lower))
    } catch (error) {
      console.error('Search error:', error)
      throw new Error(
        `Search failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
      )
    }
  },
})

export const create = mutation({
  args: {
    name: v.string(),
    colors: v.array(
      v.object({
        name: v.string(),
        hex: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('palettes', {
      name: args.name,
      colors: args.colors,
    })
  },
})

export const update = mutation({
  args: {
    id: v.id('palettes'),
    name: v.string(),
    colors: v.array(
      v.object({
        name: v.string(),
        hex: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      name: args.name,
      colors: args.colors,
    })
  },
})

export const remove = mutation({
  args: { id: v.id('palettes') },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id)
  },
})
