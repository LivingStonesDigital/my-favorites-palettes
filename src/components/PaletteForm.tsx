import { useState, useCallback, type FormEvent } from 'react'
import { useMutation } from 'convex/react'
import { toast } from 'sonner'
import { Plus, X } from 'lucide-react'

import { api } from '../../convex/_generated/api'
import type { Doc } from '../../convex/_generated/dataModel'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '#/components/ui/dialog.tsx'
import { Button } from '#/components/ui/button.tsx'
import { Input } from '#/components/ui/input.tsx'

interface ColorEntry {
  name: string
  hex: string
}

interface PaletteFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  palette?: Doc<'palettes'>
}

const EMPTY_COLOR: ColorEntry = { name: '', hex: '#000000' }

export default function PaletteForm({
  open,
  onOpenChange,
  palette,
}: PaletteFormProps) {
  const create = useMutation(api.palettes.create)
  const update = useMutation(api.palettes.update)

  const [name, setName] = useState(palette?.name ?? '')
  const [colors, setColors] = useState<ColorEntry[]>(
    palette?.colors.length ? palette.colors : [{ ...EMPTY_COLOR }],
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addColor = useCallback(() => {
    setColors((prev) => [...prev, { ...EMPTY_COLOR }])
  }, [])

  const removeColor = useCallback((index: number) => {
    setColors((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const updateColor = useCallback(
    (index: number, field: keyof ColorEntry, value: string) => {
      setColors((prev) =>
        prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)),
      )
    },
    [],
  )

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()

      const validColors = colors.filter(
        (c) => c.name.trim() && c.hex.trim(),
      )
      if (!name.trim()) {
        toast.error('Palette name is required')
        return
      }
      if (validColors.length === 0) {
        toast.error('Add at least one color')
        return
      }

      setIsSubmitting(true)
      try {
        if (palette) {
          await update({
            id: palette._id,
            name: name.trim(),
            colors: validColors,
          })
          toast.success(`Updated "${name.trim()}"`)
        } else {
          await create({ name: name.trim(), colors: validColors })
          toast.success(`Created "${name.trim()}"`)
        }
        onOpenChange(false)
      } catch {
        toast.error('Failed to save palette')
      } finally {
        setIsSubmitting(false)
      }
    },
    [name, colors, palette, create, update, onOpenChange],
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {palette ? 'Edit Palette' : 'New Palette'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Palette Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sunset Vibes"
            />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Colors</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addColor}
              >
                <Plus size={14} />
                Add
              </Button>
            </div>

            <div className="flex max-h-60 flex-col gap-2 overflow-y-auto pr-1">
              {colors.map((color, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="size-9 shrink-0 rounded-md border"
                    style={{ backgroundColor: color.hex }}
                  />
                  <Input
                    value={color.name}
                    onChange={(e) =>
                      updateColor(index, 'name', e.target.value)
                    }
                    placeholder="Color name"
                    className="flex-1"
                  />
                  <Input
                    type="color"
                    defaultValue={color.hex}
                    value={color.hex}
                    onChange={(e) =>
                      updateColor(index, 'hex', e.target.value)
                    }
                    className="size-9 cursor-pointer p-0.5"
                  />
                  {colors.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => removeColor(index)}
                    >
                      <X size={12} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : palette ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
