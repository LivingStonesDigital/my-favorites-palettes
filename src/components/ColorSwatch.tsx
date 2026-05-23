import { useCallback } from 'react'
import { toast } from 'sonner'
import { Copy } from 'lucide-react'

interface ColorSwatchProps {
  name: string
  hex: string
}

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#1a1a1a' : '#ffffff'
}

export default function ColorSwatch({ name, hex }: ColorSwatchProps) {
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(hex)
      toast.success(`Copied ${hex}`)
    } catch {
      toast.error('Failed to copy')
    }
  }, [hex])

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="group relative flex flex-col items-center gap-1.5 rounded-lg p-2 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      <div
        className="flex h-16 w-full items-center justify-center rounded-md border border-border/50 shadow-sm transition-shadow group-hover:shadow-md"
        style={{ backgroundColor: hex }}
      >
        <Copy
          className="opacity-0 transition-opacity group-hover:opacity-70"
          size={16}
          style={{ color: getContrastColor(hex) }}
        />
      </div>
      <div className="w-full text-center">
        <p className="truncate text-xs font-medium">{name}</p>
        <p className="font-mono text-xs text-muted-foreground">{hex}</p>
      </div>
    </button>
  )
}
