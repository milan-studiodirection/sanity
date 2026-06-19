'use client'
import {useState} from 'react'

export default function CopyButton({code}: {code: string}) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="text-xs text-slate-400 hover:text-slate-200 transition-colors px-2 py-1 rounded hover:bg-white/10"
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}
