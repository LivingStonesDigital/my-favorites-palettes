import { createFileRoute } from '@tanstack/react-router'
import { useState, useCallback } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { toast } from 'sonner'
import { Plus, Search, Palette, Database } from 'lucide-react'

import { api } from '../../convex/_generated/api'
import { Button } from '#/components/ui/button.tsx'
import { Input } from '#/components/ui/input.tsx'
import PaletteCard from '#/components/PaletteCard.tsx'
import PaletteForm from '#/components/PaletteForm.tsx'
export const Route = createFileRoute('/')({ component: App })

function App() {
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
            <p className="text-muted-foreground">Your personal color library</p>
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
                <Button variant="outline" onClick={() => setIsCreating(true)}>
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

//  <main className="page-wrap px-4 pb-8 pt-14">
//       <section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14">
//         <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]" />
//         <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]" />
//         <p className="island-kicker mb-3">TanStack Start Base Template</p>
//         <h1 className="display-title mb-5 max-w-3xl text-4xl leading-[1.02] font-bold tracking-tight text-[var(--sea-ink)] sm:text-6xl">
//           Start simple, ship quickly.
//         </h1>
//         <p className="mb-8 max-w-2xl text-base text-[var(--sea-ink-soft)] sm:text-lg">
//           This base starter intentionally keeps things light: two routes, clean
//           structure, and the essentials you need to build from scratch.
//         </p>
//         <div className="flex flex-wrap gap-3">
//           <a
//             href="/about"
//             className="rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm font-semibold text-[var(--lagoon-deep)] no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]"
//           >
//             About This Starter
//           </a>
//           <a
//             href="https://tanstack.com/router"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="rounded-full border border-[rgba(23,58,64,0.2)] bg-white/50 px-5 py-2.5 text-sm font-semibold text-[var(--sea-ink)] no-underline transition hover:-translate-y-0.5 hover:border-[rgba(23,58,64,0.35)]"
//           >
//             Router Guide
//           </a>
//         </div>
//       </section>

//       <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         {[
//           [
//             'Type-Safe Routing',
//             'Routes and links stay in sync across every page.',
//           ],
//           [
//             'Server Functions',
//             'Call server code from your UI without creating API boilerplate.',
//           ],
//           [
//             'Streaming by Default',
//             'Ship progressively rendered responses for faster experiences.',
//           ],
//           [
//             'Tailwind Native',
//             'Design quickly with utility-first styling and reusable tokens.',
//           ],
//         ].map(([title, desc], index) => (
//           <article
//             key={title}
//             className="island-shell feature-card rise-in rounded-2xl p-5"
//             style={{ animationDelay: `${index * 90 + 80}ms` }}
//           >
//             <h2 className="mb-2 text-base font-semibold text-[var(--sea-ink)]">
//               {title}
//             </h2>
//             <p className="m-0 text-sm text-[var(--sea-ink-soft)]">{desc}</p>
//           </article>
//         ))}
//       </section>

//       <section className="island-shell mt-8 rounded-2xl p-6">
//         <p className="island-kicker mb-2">Quick Start</p>
//         <ul className="m-0 list-disc space-y-2 pl-5 text-sm text-[var(--sea-ink-soft)]">
//           <li>
//             Edit <code>src/routes/index.tsx</code> to customize the home page.
//           </li>
//           <li>
//             Update <code>src/components/Header.tsx</code> and{' '}
//             <code>src/components/Footer.tsx</code> for brand links.
//           </li>
//           <li>
//             Add routes in <code>src/routes</code> and tweak visual tokens in{' '}
//             <code>src/styles.css</code>.
//           </li>
//         </ul>
//       </section>
//     </main>
