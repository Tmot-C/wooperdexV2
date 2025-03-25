import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BuilderStore } from '../../../builder.store';
import { BuiltPokemon, BaseStats } from '../../../models';
import { POKEMON_NATURES, EV_TOTAL_MAX, EV_MAX, IV_MAX, IV_MIN } from '../../../constants';

@Component({
  selector: 'app-statselect',
  standalone: false,
  templateUrl: './statselect.component.html',
  styleUrl: './statselect.component.scss'
})
export class StatselectComponent implements OnInit {
  private store = inject(BuilderStore);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  
  currentPokemon: BuiltPokemon | null = null;
  
  // Constants
  natures: string[] = POKEMON_NATURES;
  evTotalMax: number = EV_TOTAL_MAX;
  evMax: number = EV_MAX;
  ivMax: number = IV_MAX;
  ivMin: number = IV_MIN;
  
  // Stat keys in a specific order
  statKeys: Array<keyof BaseStats> = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
  
  // Form for EVs and IVs
  evForm!: FormGroup;
  ivForm!: FormGroup;
  
  // Nature (just the name part without the effect description)
  nature: string = 'Serious (Neutral)';
  
  ngOnInit(): void {
    // Create form with strongly typed controls for EVs
    this.evForm = this.fb.group({
      hp: [0],
      atk: [0],
      def: [0],
      spa: [0],
      spd: [0],
      spe: [0]
    });
    
    // Create form with strongly typed controls for IVs
    this.ivForm = this.fb.group({
      hp: [31],  // Default to perfect IVs
      atk: [31],
      def: [31],
      spa: [31],
      spd: [31],
      spe: [31]
    });
    
    // Get the current Pokémon from the store
    this.store.currentPokemon$.subscribe(pokemon => {
      this.currentPokemon = pokemon;
      
      if (!pokemon) {
        this.router.navigate(['/teambuilder/pokemon']);
        return;
      }
      
      // Initialize EVs if already set
      if (pokemon.evs) {
        this.statKeys.forEach(stat => {
          const control = this.evForm.get(stat);
          if (control) {
            control.setValue(pokemon.evs?.[stat] || 0);
          }
        });
      }
      
      // Initialize IVs if already set
      if (pokemon.ivs) {
        this.statKeys.forEach(stat => {
          const control = this.ivForm.get(stat);
          if (control) {
            control.setValue(pokemon.ivs?.[stat] || 31);
          }
        });
      }
      
      // Initialize nature if already set
      if (pokemon.nature) {
        // Find the full nature string (with effect) that matches the saved value
        const fullNature = this.natures.find(n => n.startsWith(pokemon.nature as string));
        if (fullNature) {
          this.nature = fullNature;
        }
      }
    });
  }
  
  // Round to nearest multiple of 4 for EVs
  private roundToNearestEv(value: number): number {
    return Math.round(value / 4) * 4;
  }
  
  // Get just the nature name without the effect
  private getNatureName(fullNature: string): string {
    return fullNature.split(' (')[0];
  }
  
  // EV Methods
  // Check if a stat can receive more EVs
  canIncreaseEv(stat: keyof BaseStats): boolean {
    // Calculate current total EVs
    const currentEvs = this.evForm.value as BaseStats;
    const totalEvs = Object.values(currentEvs).reduce((a, b) => a + b, 0);
    
    // Get current value of the specific stat
    const currentStatEv = currentEvs[stat] || 0;
    
    // Check if adding 4 EVs would exceed total or stat max
    return (totalEvs + 4 <= this.evTotalMax) && 
           (currentStatEv + 4 <= this.evMax);
  }
  
  // Increase EV for a specific stat
  increaseEv(stat: keyof BaseStats): void {
    const control = this.evForm.get(stat);
    if (!control) return;
    
    // Get current value
    const currentValue = control.value || 0;
    
    // Check if can increase
    if (this.canIncreaseEv(stat)) {
      control.setValue(currentValue + 4);
    }
  }
  
  // Decrease EV for a specific stat
  decreaseEv(stat: keyof BaseStats): void {
    const control = this.evForm.get(stat);
    if (!control) return;
    
    // Get current value
    const currentValue = control.value || 0;
    
    // Decrease by 4, but not below 0
    const newValue = Math.max(0, currentValue - 4);
    control.setValue(newValue);
  }
  
  // Handle manual EV input
  onEvInput(stat: keyof BaseStats, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = parseInt(inputElement.value, 10) || 0;
    
    // Round to nearest multiple of 4
    const roundedValue = this.roundToNearestEv(inputValue);
    
    // Calculate current total EVs
    const currentEvs = {...(this.evForm.value as BaseStats)};
    const otherStatsTotalEvs = Object.entries(currentEvs)
      .filter(([key]) => key !== stat)
      .reduce((sum, [, value]) => sum + value, 0);
    
    // Adjust if total would exceed max
    let finalValue = roundedValue;
    if (otherStatsTotalEvs + roundedValue > this.evTotalMax) {
      finalValue = Math.max(0, this.evTotalMax - otherStatsTotalEvs);
      finalValue = this.roundToNearestEv(finalValue);
    }
    
    // Ensure individual stat doesn't exceed max
    finalValue = Math.min(finalValue, this.evMax);
    
    // Set the value
    const control = this.evForm.get(stat);
    if (control) {
      control.setValue(finalValue);
      
      // Update input to show final value
      inputElement.value = finalValue.toString();
    }
  }
  
  // Calculate remaining EVs
  getRemainingEvs(): number {
    const currentEvs = this.evForm.value as BaseStats;
    return this.evTotalMax - Object.values(currentEvs).reduce((a, b) => a + b, 0);
  }
  
  // IV Methods
  // Increase IV for a specific stat
  increaseIv(stat: keyof BaseStats): void {
    const control = this.ivForm.get(stat);
    if (!control) return;
    
    // Get current value
    const currentValue = control.value || 0;
    
    // Increase by 1, but not above max
    const newValue = Math.min(this.ivMax, currentValue + 1);
    control.setValue(newValue);
  }
  
  // Decrease IV for a specific stat
  decreaseIv(stat: keyof BaseStats): void {
    const control = this.ivForm.get(stat);
    if (!control) return;
    
    // Get current value
    const currentValue = control.value || 0;
    
    // Decrease by 1, but not below min
    const newValue = Math.max(this.ivMin, currentValue - 1);
    control.setValue(newValue);
  }
  
  // Handle manual IV input
  onIvInput(stat: keyof BaseStats, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = parseInt(inputElement.value, 10) || 0;
    
    // Ensure value is within bounds
    let finalValue = Math.max(this.ivMin, Math.min(this.ivMax, inputValue));
    
    // Set the value
    const control = this.ivForm.get(stat);
    if (control) {
      control.setValue(finalValue);
      
      // Update input to show final value
      inputElement.value = finalValue.toString();
    }
  }
  
  // Retrieves the current base stat value for a given stat key
  getBaseStat(stat: keyof BaseStats): number {
    return this.currentPokemon?.baseStats?.[stat] || 0;
  }
  
  // Navigate to the next step or save
  saveStatsAndContinue(): void {
    if (!this.currentPokemon) return;
    
    const updatedPokemon: BuiltPokemon = {
      ...this.currentPokemon,
      evs: this.evForm.value as BaseStats,
      ivs: this.ivForm.value as BaseStats,
      nature: this.getNatureName(this.nature) // Store only the name part
    };
    
    this.store.updateCurrentPokemon(updatedPokemon);
    
    // TODO: Add team saving logic when team builder is complete
    this.router.navigate(['/teams']);
  }
  
  goBack(): void {
    this.router.navigate(['/teambuilder/item']);
  }
  
  // Stat name mapping
  getStatLabel(stat: keyof BaseStats): string {
    switch (stat) {
      case 'hp': return 'HP';
      case 'atk': return 'Atk';
      case 'def': return 'Def';
      case 'spa': return 'SpA';
      case 'spd': return 'SpD';
      case 'spe': return 'Spe';
      default: return '';
    }
  }
  
  // Reset EVs to zero
  resetEvs(): void {
    this.statKeys.forEach(stat => {
      const control = this.evForm.get(stat);
      if (control) {
        control.setValue(0);
      }
    });
  }
  
  // Set IVs to max (perfect)
  perfectIvs(): void {
    this.statKeys.forEach(stat => {
      const control = this.ivForm.get(stat);
      if (control) {
        control.setValue(this.ivMax);
      }
    });
  }
}