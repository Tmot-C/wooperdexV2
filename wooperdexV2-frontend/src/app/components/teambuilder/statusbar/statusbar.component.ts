import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BuilderStore } from '../../../builder.store';
import { BuiltPokemon, BaseStats } from '../../../models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-statusbar',
  standalone: false,
  templateUrl: './statusbar.component.html',
  styleUrl: './statusbar.component.scss'
})

export class StatusbarComponent implements OnInit {
  private store = inject(BuilderStore);
  private router = inject(Router);
  
  currentPokemon$: Observable<BuiltPokemon | null> = this.store.currentPokemon$;
  currentPokemon: BuiltPokemon | null = null;
  
  // Track which tab is active for navigation
  activeTab: 'pokemon' | 'ability' | 'moves' | 'stats' = 'pokemon';
  
  constructor() {}
  
  ngOnInit(): void {
    // Subscribe to the current Pokémon from the store
    this.currentPokemon$.subscribe(pokemon => {
      this.currentPokemon = pokemon;
    });
    
    // Determine active tab based on the current route
    const currentUrl = this.router.url;
    if (currentUrl.includes('/pokemon')) {
      this.activeTab = 'pokemon';
    } else if (currentUrl.includes('/ability')) {
      this.activeTab = 'ability';
    } else if (currentUrl.includes('/move')) {
      this.activeTab = 'moves';
    } else if (currentUrl.includes('/stats')) {
      this.activeTab = 'stats';
    }
  }
  
  // Navigation methods
  navigateToPokemonSelect(): void {
    this.router.navigate(['/teambuilder/pokemon']);
    this.activeTab = 'pokemon';
  }
  
  navigateToAbilitySelect(): void {
    if (!this.currentPokemon) return;
    this.router.navigate(['/teambuilder/ability']);
    this.activeTab = 'ability';
  }
  
  navigateToMoveSelect(slot: number): void {
    if (!this.currentPokemon) return;
    this.router.navigate([`/teambuilder/move/${slot}`]);
    this.activeTab = 'moves';
  }
  
  navigateToStatsSelect(): void {
    if (!this.currentPokemon) return;
    this.router.navigate(['/teambuilder/stats']);
    this.activeTab = 'stats';
  }
  
  navigateToItemSelect(): void {
    if (!this.currentPokemon) return;
    // You'll need to add a route for item selection in your routing module
    // For now, this redirects to the pokemon selection as a placeholder
    this.router.navigate(['/teambuilder/pokemon']);
    this.activeTab = 'pokemon';
  }
  
  // Gets the correct stat value from BaseStats object
  getStat(stats: BaseStats | null, statName: string): number {
    if (!stats) return 0;
    
    switch (statName) {
      case 'hp': return stats.hp;
      case 'atk': return stats.atk;
      case 'def': return stats.def;
      case 'spa': return stats.spa;
      case 'spd': return stats.spd;
      case 'spe': return stats.spe;
      default: return 0;
    }
  }
  
  // Helper methods for UI display
  getStatPercentage(value: number): number {
    // Map the stat value to a percentage for progress bars
    // Assuming max base stat is around 255
    return Math.min((value / 255) * 100, 100);
  }
  
  getTypeClass(type: string): string {
    return `type-${type.toLowerCase()}`;
  }
}
