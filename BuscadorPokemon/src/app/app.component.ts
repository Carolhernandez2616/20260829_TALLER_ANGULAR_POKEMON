import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { Pokemon, PokemonService } from './pokemon.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private readonly pokemonService = inject(PokemonService);
  readonly pokemon = signal<Pokemon[]>([]);
  readonly query = signal('pikachu, charizard, bulbasaur');
  readonly loading = signal(false);
  readonly error = signal('');
  readonly searched = signal(false);

  search(): void {
    const names = this.query().split(',').map((name) => name.trim().toLowerCase()).filter(Boolean).slice(0, 12);
    if (!names.length) {
      this.error.set('Escribe al menos un nombre de Pokémon para buscar.');
      this.pokemon.set([]);
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.searched.set(true);
    this.pokemonService.getPokemon(names).pipe(finalize(() => this.loading.set(false))).subscribe({
      next: (results) => this.pokemon.set(results),
      error: () => {
        this.pokemon.set([]);
        this.error.set('No encontramos uno de esos Pokémon. Revisa los nombres e inténtalo de nuevo.');
      }
    });
  }

  formatName(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
}
