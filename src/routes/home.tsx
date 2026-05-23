import { useState, useCallback } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation } from 'convex/react'
import { toast } from 'sonner'
import { Plus, Search, Palette, Database } from 'lucide-react'

import { api } from '../../convex/_generated/api'
import { Button } from '#/components/ui/button.tsx'
import { Input } from '#/components/ui/input.tsx'
import PaletteCard from '#/components/PaletteCard.tsx'
import PaletteForm from '#/components/PaletteForm.tsx'

export const Route = createFileRoute('/home')({
  component: RouteComponent,
})

function RouteComponent() {
  const [search, setSearch] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [isSeeding, setIsSeeding] = useState(false)

  const palettes = useQuery(
    api.palettes.search,
    search.trim() ? { query: search } : { query: '' },
  )
  const seed = useMutation(api.seed.seed)

  const handleSeed = useCallback(async () => {
    setIsSeeding(true)
    try {
      const result = await seed()
      toast.success(result.message)
    } catch {
      toast.error('Failed to seed palettes')
    } finally {
      setIsSeeding(false)
    }
  }, [seed])

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              My Color Palettes
            </h1>
            <p className="text-muted-foreground">
              Your personal color library
            </p>
          </div>
          <Button onClick={() => setIsCreating(true)}>
            <Plus size={16} />
            New Palette
          </Button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search palettes..."
            className="pl-9"
          />
        </div>

        {palettes === undefined ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
            <div className="size-8 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <p>Loading palettes...</p>
          </div>
        ) : palettes.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
            <Palette size={48} />
            <p className="text-lg font-medium">
              {search ? 'No palettes found' : 'No palettes yet'}
            </p>
            <p className="text-sm">
              {search
                ? 'Try a different search term'
                : 'Create your first palette to get started'}
            </p>
            {!search && (
              <div className="mt-2 flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreating(true)}
                >
                  <Plus size={16} />
                  Create Palette
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleSeed}
                  disabled={isSeeding}
                >
                  <Database size={16} />
                  {isSeeding ? 'Loading...' : 'Load Colors from JSON'}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {palettes.map((palette) => (
              <PaletteCard key={palette._id} palette={palette} />
            ))}
          </div>
        )}
      </div>

      {isCreating && (
        <PaletteForm open={isCreating} onOpenChange={setIsCreating} />
      )}
    </main>
  )
}
