'use client'

import { FormEvent, useState } from 'react'
import { Search, Sparkles } from 'lucide-react'

type Pokemon = {
  id: number
  name: string
  image: string
}

const featuredPokemon = ['pikachu', 'bulbasaur', 'charmander', 'squirtle', 'eevee', 'snorlax']

function formatName(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

export function Pokedex() {
  const [query, setQuery] = useState('')
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')

  async function searchPokemon(event?: FormEvent) {
    event?.preventDefault()
    const names = query
      .split(',')
      .map((name) => name.trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 12)

    if (!names.length) {
      setError('Escribe al menos un nombre para comenzar.')
      setPokemon([])
      setSearched(true)
      return
    }

    setLoading(true)
    setError('')
    setSearched(true)

    try {
      const results = await Promise.all(
        names.map(async (name) => {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(name)}`)
          if (!response.ok) throw new Error('not-found')
          const data = await response.json()
          return {
            id: data.id,
            name: data.name,
            image: data.sprites.other?.['official-artwork']?.front_default ?? data.sprites.front_default,
          }
        }),
      )
      setPokemon(results)
    } catch {
      setPokemon([])
      setError('No encontramos uno de esos Pokémon. Prueba con otro nombre.')
    } finally {
      setLoading(false)
    }
  }

  function showFeatured() {
    setQuery(featuredPokemon.join(', '))
    void searchPokemon()
  }

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </div>
            <span className="font-mono text-sm font-bold tracking-[0.2em]">POKÉDEX</span>
          </div>
          <span className="hidden rounded-full border border-border bg-card px-3 py-1.5 font-mono text-xs text-muted-foreground sm:block">API / POKEAPI.CO</span>
        </header>

        <section className="relative py-20 text-center sm:py-28">
          <div className="mx-auto max-w-3xl">
            <p className="mb-5 font-mono text-xs font-bold uppercase tracking-[0.3em] text-primary">Explora la región completa</p>
            <h1 className="font-serif text-5xl font-bold leading-[0.95] tracking-tight text-balance sm:text-7xl">Encuentra tu próximo Pokémon.</h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">Busca por nombre y descubre criaturas, estadísticas y arte oficial directamente desde la PokéAPI.</p>
          </div>

          <form onSubmit={searchPokemon} className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row">
            <label className="relative flex-1 text-left">
              <span className="sr-only">Nombre del Pokémon</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ej. pikachu, eevee, mew..." className="h-14 w-full rounded-2xl border border-border bg-card pl-12 pr-4 text-base shadow-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10" />
            </label>
            <button type="submit" disabled={loading} className="h-14 rounded-2xl bg-primary px-8 font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-wait disabled:opacity-60">{loading ? 'Buscando...' : 'Buscar Pokémon'}</button>
          </form>
          <p className="mt-3 text-left text-xs text-muted-foreground sm:text-center">Puedes separar varios nombres con comas · máximo 12 resultados</p>
        </section>

        {error && <p role="alert" className="mx-auto mb-8 max-w-2xl rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-center text-sm text-destructive">{error}</p>}

        {!searched && (
          <section className="pb-16">
            <div className="mb-6 flex items-end justify-between gap-4"><div><p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Para empezar</p><h2 className="mt-2 font-serif text-3xl font-bold">Pokémon populares</h2></div><button onClick={showFeatured} className="text-sm font-semibold text-primary hover:underline">Ver todos</button></div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">{featuredPokemon.map((name, index) => <div key={name} className="rounded-2xl border border-border bg-card p-4 text-center shadow-sm"><img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${index === 0 ? 25 : index === 1 ? 1 : index === 2 ? 4 : index === 3 ? 7 : index === 4 ? 133 : 143}.png`} alt={formatName(name)} className="mx-auto h-28 w-28 object-contain" /><p className="mt-2 font-semibold">{formatName(name)}</p></div>)}</div>
          </section>
        )}

        {searched && pokemon.length > 0 && <section className="pb-16"><div className="mb-6 flex items-end justify-between"><div><p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Resultados</p><h2 className="mt-2 font-serif text-3xl font-bold">{pokemon.length} Pokémon encontrados</h2></div></div><div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{pokemon.map((item) => <article key={item.id} className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"><div className="flex items-start justify-between"><span className="font-mono text-xs text-muted-foreground">#{String(item.id).padStart(3, '0')}</span><span className="rounded-full bg-accent px-2 py-1 font-mono text-[10px] text-accent-foreground">POKÉMON</span></div><img src={item.image} alt={`Imagen de ${formatName(item.name)}`} className="mx-auto h-40 w-40 object-contain transition duration-300 group-hover:scale-105" /><h3 className="font-serif text-2xl font-bold">{formatName(item.name)}</h3></article>)}</div></section>}
      </div>
    </main>
  )
}

export default Pokedex
