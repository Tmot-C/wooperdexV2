import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BuilderStore } from '../../../builder.store';
import { BuiltPokemon, BaseStats } from '../../../models';
import { Observable, take } from 'rxjs';
import { StatsService } from '../../../stats.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImagePathService } from '../../../image-path.service';

@Component({
  selector: 'app-statusbar',
  standalone: false,
  templateUrl: './statusbar.component.html',
  styleUrl: './statusbar.component.scss',
})
export class StatusbarComponent implements OnInit {
  private store = inject(BuilderStore);
  private router = inject(Router);
  private statsService = inject(StatsService);
  private snackBar = inject(MatSnackBar);
  public imageService = inject(ImagePathService);

  currentPokemon$: Observable<BuiltPokemon | null> = this.store.currentPokemon$;
  currentPokemon: BuiltPokemon | null = null;
  currentTeamIndex: number = 0;
  editExistingTeam: boolean = false;

  // Tab tracker
  activeTab: 'pokemon' | 'item' | 'ability' | 'moves' | 'stats' = 'pokemon';

  constructor() {}

  ngOnInit(): void {
    this.currentPokemon$.subscribe((pokemon) => {
      this.currentPokemon = pokemon;
      console.log('Current Pokemon:', pokemon?.id);
    });

    this.store.currentTeamIndex$.subscribe((index) => {
      this.currentTeamIndex = index;
      console.log('Current team index in statusbar:', index);
    });

    this.store.editExistingTeam$.subscribe((value) => {
      this.editExistingTeam = value;
      console.log('Editing existing team:', value);
    });

    const currentUrl = this.router.url;
    if (currentUrl.includes('/pokemon')) {
      this.activeTab = 'pokemon';
    } else if (currentUrl.includes('/ability')) {
      this.activeTab = 'ability';
    } else if (currentUrl.includes('/move')) {
      this.activeTab = 'moves';
    } else if (currentUrl.includes('/stats')) {
      this.activeTab = 'stats';
    } else if (currentUrl.includes('/item')) {
      this.activeTab = 'item';
    }
  }

  // Save Pokemon to team
  savePokemonToTeam(): void {
    if (!this.currentPokemon || !this.currentPokemon.name) {
      this.snackBar.open('Please select a Pokémon first', 'Close', {
        duration: 3000,
      });
      return;
    }

    console.log('Saving Pokémon to team');
    console.log('Current context - Team index:', this.currentTeamIndex);
    console.log(
      'Current context - Editing existing team:',
      this.editExistingTeam
    );

    this.store.addPokemonToTeam();

    this.snackBar.open(`${this.currentPokemon.name} added to team!`, 'Close', {
      duration: 3000,
    });

    if (this.editExistingTeam && this.currentTeamIndex > 0) {
      console.log('Updating existing team in trainer data');

      // Save the updated team to the trainer state
      this.store.currentTeam$.pipe(take(1)).subscribe((currentTeam) => {
        if (currentTeam && currentTeam.length > 0) {
          // Create an updated version of the trainer's team
          this.store.saveTeamToTrainer();

          console.log('Team saved to trainer, returning to team view');
        }
      });
    }

    if (this.editExistingTeam && this.currentTeamIndex > 0) {
      console.log('Returning to existing team:', this.currentTeamIndex);
      this.router.navigate(['/teams', this.currentTeamIndex]);
    } else {
      console.log('Returning to new team view');
      this.router.navigate(['/teams', this.currentTeamIndex || 0]);
    }
  }

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
    this.router.navigate(['/teambuilder/item']);
    this.activeTab = 'item';
  }

  getStat(stats: BaseStats | null, statName: string): number {
    if (!stats) return 0;

    switch (statName) {
      case 'hp':
        return stats.hp;
      case 'atk':
        return stats.atk;
      case 'def':
        return stats.def;
      case 'spa':
        return stats.spa;
      case 'spd':
        return stats.spd;
      case 'spe':
        return stats.spe;
      default:
        return 0;
    }
  }

  getStatPercentage(value: number): number {
    return this.statsService.getStatPercentage(value);
  }

  getStatColor(stat: keyof BaseStats): string {
    return this.statsService.getStatColor(stat);
  }

  getTypeClass(type: string): string {
    return `type-${type.toLowerCase()}`;
  }
}
