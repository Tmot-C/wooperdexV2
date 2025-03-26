import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BuilderStore } from '../../../builder.store';
import { Ability, BuiltPokemon } from '../../../models';

@Component({
  selector: 'app-abilityselect',
  standalone: false,
  templateUrl: './abilityselect.component.html',
  styleUrl: './abilityselect.component.scss'
})
export class AbilityselectComponent implements OnInit {
  private store = inject(BuilderStore);
  private router = inject(Router);
  
  currentPokemon: BuiltPokemon | null = null;
  availableAbilities: Ability[] = [];
  
  ngOnInit(): void {
    // Get the current Pokémon from the store
    this.store.currentPokemon$.subscribe(pokemon => {
      this.currentPokemon = pokemon;
      
      if (!pokemon) {
        this.router.navigate(['/teambuilder/pokemon']);
        return;
      }
    });
    
    // Load all abilities and filter for current Pokémon
    this.store.abilitylist$.subscribe(abilities => {
      if (this.currentPokemon?.abilities) {
        this.availableAbilities = abilities.filter(ability => 
          this.currentPokemon?.abilities?.includes(ability.name)
        );
        
        // Sort by rating (highest first)
        this.availableAbilities.sort((a, b) => b.rating - a.rating);
      }
    });
  }
  
  selectAbility(ability: Ability): void {
    if (!this.currentPokemon) return;
    
    const updatedPokemon: BuiltPokemon = {
      ...this.currentPokemon,
      chosenAbility: ability.name
    };
    
    this.store.updateCurrentPokemon(updatedPokemon);
    this.router.navigate(['/teambuilder/move/1']);
  }
  
  goBack(): void {
    this.router.navigate(['/teambuilder/item']);
  }
}
