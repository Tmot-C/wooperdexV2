import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImagePathService {
  getPokemonSpritePath(pokemonId: string | null | undefined): string {
    if (!pokemonId) {
      return this.getPlaceholderPath();
    }
    return `assets/sprites/${pokemonId}.png`;
  }

  getItemSpritePath(itemId: string | null | undefined): string {
    if (!itemId) {
      return this.getItemPlaceholderPath();
    }

    return `assets/sprites/items/${itemId}.png`;
  }

  handleImageError(event: any): void {
    event.target.src = this.getPlaceholderPath();
  }

  getPlaceholderPath(): string {
    return 'assets/sprites/placeholder.png';
  }

  getItemPlaceholderPath(): string {
    return 'assets/sprites/items/placeholder.png';
  }
}
