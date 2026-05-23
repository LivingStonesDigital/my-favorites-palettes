import { useCallback, useState } from 'react'
import { useMutation } from 'convex/react'
import { toast } from 'sonner'
import { Pencil, Trash2 } from 'lucide-react'

import { api } from '../../convex/_generated/api'
import type { Id, Doc } from '../../convex/_generated/dataModel'
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '#/components/ui/card.tsx'
import { Button } from '#/components/ui/button.tsx'
import ColorSwatch from './ColorSwatch'
import PaletteForm from './PaletteForm'

interface PaletteCardProps {
  palette: Doc<'palettes'>
}

export default function PaletteCard({ palette }: PaletteCardProps) {
  const remove = useMutation(api.palettes.remove)
  const [isEditing, setIsEditing] = useState(false)

  const handleDelete = useCallback(async () => {
    try {
      await remove({ id: palette._id as Id<'palettes'> })
      toast.success(`Deleted "${palette.name}"`)
    } catch {
      toast.error('Failed to delete palette')
    }
  }, [remove, palette._id, palette.name])

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{palette.name}</CardTitle>
          <CardAction className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => setIsEditing(true)}
            >
              <Pencil size={14} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-destructive hover:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 size={14} />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {palette.colors.map((color) => (
              <ColorSwatch key={color.hex} name={color.name} hex={color.hex} />
            ))}
          </div>
        </CardContent>
      </Card>

      {isEditing && (
        <PaletteForm
          open={isEditing}
          onOpenChange={setIsEditing}
          palette={palette}
        />
      )}
    </>
  )
}
