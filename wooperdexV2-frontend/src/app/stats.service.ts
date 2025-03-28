import { Injectable } from '@angular/core';
import { BaseStats } from './models';
import { EV_TOTAL_MAX, EV_MAX, IV_MAX, IV_MIN } from './constants';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  
  readonly evTotalMax: number = EV_TOTAL_MAX;
  readonly evMax: number = EV_MAX;
  readonly ivMax: number = IV_MAX;
  readonly ivMin: number = IV_MIN;
  
  constructor() { }
  
  // Get color
  getStatColor(stat: keyof BaseStats): string {
    switch(stat) {
      case 'hp': return 'warn';
      case 'atk': return 'accent';
      case 'def': return 'primary';
      case 'spa': return 'accent';
      case 'spd': return 'primary';
      case 'spe': return 'warn';
      default: return 'primary';
    }
  }
  
  // Hardcoded display label
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
  
  // Calculate stat percentage for progress bars (255 max)
  getStatPercentage(value: number): number {
    return Math.min((value / 255) * 100, 100);
  }
  
  
  roundToNearestEv(value: number): number {
    return Math.round(value / 4) * 4;
  }
  
  // Final stat total calculation
  calculateFinalStat(baseStat: number, ev: number, iv: number, natureEffect: number, isHpStat: boolean): number {

    if (isHpStat) {
      return Math.floor(((2 * baseStat + iv + Math.floor(ev/4)) * 100/100) + 100 + 10);
    } else {
      return Math.floor((((2 * baseStat + iv + Math.floor(ev/4)) * 100/100) + 5) * natureEffect);
    }
  }
  
  // Parse nature effect from nature name string
  getNatureEffect(natureName: string, stat: keyof BaseStats): number {
    if (!natureName) return 1.0;
    
    const lowerNature = natureName.toLowerCase();
    
    // Map stats to their nature-effect identifiers
    const statMap: Record<keyof BaseStats, string> = {
      hp: '',  // HP is never affected by nature
      atk: 'atk',
      def: 'def',
      spa: 'spa',
      spd: 'spd',
      spe: 'spe'
    };
    
    // Skip HP as it's never affected by nature
    if (stat === 'hp') return 1.0;
    
    // Check if this stat is boosted (e.g., "+Atk")
    if (lowerNature.includes(`+${statMap[stat]}`)) {
      return 1.1;
    }
    
    // Check if this stat is hindered (e.g., "-Atk")
    if (lowerNature.includes(`-${statMap[stat]}`)) {
      return 0.9;
    }
    
    // Neutral effect
    return 1.0;
  }
  
  // Get just the nature name without the effect
  extractNatureName(fullNature: string): string {
    return fullNature.split(' (')[0];
  }
}