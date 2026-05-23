import { mutation } from './_generated/server'

const PALETTES = [
  {
    name: 'Midnight Coral',
    colors: [
      { name: 'Midnight Blue', hex: '#1A1F2B' },
      { name: 'Coral Amber', hex: '#FF6F5E' },
      { name: 'Ocean Mist', hex: '#3CA6A6' },
      { name: 'Cloud Pearl', hex: '#F3F4F6' },
    ],
  },
  {
    name: 'Frost Winter',
    colors: [
      { name: 'Frost White', hex: '#F8F9FA' },
      { name: 'Ice Blue', hex: '#D0EBFF' },
      { name: 'Slate Gray', hex: '#495057' },
      { name: 'Winter Navy', hex: '#1C2B39' },
    ],
  },
  {
    name: 'Sunset Lagoon',
    colors: [
      { name: 'Sunset Coral', hex: '#FF6B6B' },
      { name: 'Golden Sand', hex: '#FFD93D' },
      { name: 'Lagoon Teal', hex: '#00A8A8' },
      { name: 'Evening Lavender', hex: '#A393EB' },
    ],
  },
  {
    name: 'Neon Cyber',
    colors: [
      { name: 'Neon Fuchsia', hex: '#FF2E9A' },
      { name: 'Electric Indigo', hex: '#5D00FF' },
      { name: 'Cyber Lime', hex: '#CFFF04' },
      { name: 'Graphite Black', hex: '#1C1C1C' },
    ],
  },
  {
    name: 'Stone Nature',
    colors: [
      { name: 'Stone Charcoal', hex: '#2E2E2E' },
      { name: 'Moss Green', hex: '#6C8A5D' },
      { name: 'Clay Beige', hex: '#D8CAB8' },
      { name: 'Sky Fog', hex: '#EEF1F3' },
    ],
  },
  {
    name: 'Bubblegum Ocean',
    colors: [
      { name: 'Bubblegum Pink', hex: '#ef476f' },
      { name: 'Royal Gold', hex: '#ffd166' },
      { name: 'Emerald', hex: '#06d6a0' },
      { name: 'Ocean Blue', hex: '#118ab2' },
      { name: 'Dark Teal', hex: '#073b4c' },
    ],
  },
  {
    name: 'Soft Sand',
    colors: [
      { name: 'Parchment', hex: '#EDEDE9' },
      { name: 'Bone', hex: '#D6CCC2' },
      { name: 'Linen', hex: '#f5ebe0' },
      { name: 'Almond Cream', hex: '#e3d5ca' },
      { name: 'Almond Silk', hex: '#d5bdaf' },
    ],
  },
]

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query('palettes').collect()
    if (existing.length > 0) {
      return { inserted: 0, message: 'Already seeded' }
    }

    for (const palette of PALETTES) {
      await ctx.db.insert('palettes', palette)
    }

    return { inserted: PALETTES.length, message: 'Seeded successfully' }
  },
})
