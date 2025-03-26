import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BuilderStore } from '../../builder.store';
import { BuilderService } from '../../builder.service';
import { BuiltPokemon, BaseStats, Team, Trainer } from '../../models';
import { StatsService } from '../../stats.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';
import { ImagePathService } from '../../image-path.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-teamviewer',
  standalone: false,
  templateUrl: './teamviewer.component.html',
  styleUrls: ['./teamviewer.component.scss'],
})
export class TeamviewerComponent implements OnInit {
  private store = inject(BuilderStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private statsService = inject(StatsService);
  private snackBar = inject(MatSnackBar);
  private builderService = inject(BuilderService);
  protected imageService = inject(ImagePathService);

  currentTeam: BuiltPokemon[] | null = null;
  currentTrainer: Trainer | null = null;
  teamCount: number = 0;
  teamIndex: number = 0;
  isNewTeam: boolean = true;

  //WARNING:  Fucked spaghetti logic in this file. Result of my own gross incompetence and planning
  ngOnInit(): void {
    console.log('TeamviewerComponent initialized');

    this.route.params.subscribe((params) => {
      this.teamIndex = parseInt(params['id']) || 0;
      console.log('Team index from route:', this.teamIndex);

      this.store.setCurrentTeamIndex(this.teamIndex);

      this.isNewTeam = this.teamIndex === 0;
      console.log('Is new team:', this.isNewTeam);

      if (!this.isNewTeam) {
        this.store.setEditExistingTeam(true);
      } else {
        this.store.setEditExistingTeam(false);
      }

      this.store.currentTrainer$.pipe(take(1)).subscribe((trainer) => {
        this.currentTrainer = trainer;
        console.log('Current trainer loaded:', trainer?.name);

        if (
          !this.isNewTeam &&
          trainer &&
          trainer.teams &&
          trainer.teams.length > this.teamIndex - 1
        ) {
          // Load the team from trainer data
          const teamToLoad = trainer.teams[this.teamIndex - 1].team;
          console.log(
            'Loading existing team with',
            teamToLoad.length,
            'Pokémon'
          );

          // Check if we're coming back from editing a specific Pokémon
          this.store.editingPokemonIndex$
            .pipe(take(1))
            .subscribe((editIndex) => {
              this.store.currentPokemon$
                .pipe(take(1))
                .subscribe((editedPokemon) => {
                  // If we have both an edited Pokémon and a valid index
                  if (
                    editedPokemon &&
                    editIndex >= 0 &&
                    editIndex < teamToLoad.length
                  ) {
                    // Replace the Pokémon at the specified index
                    console.log('Updating Pokémon at index', editIndex);
                    const updatedTeam = [...teamToLoad];
                    updatedTeam[editIndex] = editedPokemon;

                    this.store.loadTeam(updatedTeam);

                    // Reset the editing state
                    this.store.setEditingPokemonIndex(-1);
                  } else {
                    // Just load the team as is
                    console.log('Loading team without editing');
                    this.store.loadTeam(teamToLoad);
                  }
                });
            });
        } else if (this.isNewTeam) {
          // For new teams, check if there's already a team in progress
          this.store.currentTeam$.pipe(take(1)).subscribe((currentTeam) => {
            if (!currentTeam || currentTeam.length === 0) {
              console.log('Initializing new empty team');
              this.store.loadTeam([]);
            } else {
              console.log(
                'Using existing team in progress:',
                currentTeam.length,
                'Pokémon'
              );
            }
          });
        }
      });
    });

    this.store.currentTeam$.subscribe((team) => {
      this.currentTeam = team;
      this.teamCount = team ? team.length : 0;
      console.log('Current team updated, count:', this.teamCount);
    });

    this.store.currentTeam$.subscribe((team) => {
      this.currentTeam = team;
      this.teamCount = team ? team.length : 0;
      console.log('Current team updated:', team);
    });
  }

  // Add a new Pokemon - As of now, mutually exclusive with the edit pokemon function
  addNewPokemon(): void {
    if (this.teamCount >= 6) {
      this.snackBar.open(
        'Team is full! Remove a Pokémon before adding a new one.',
        'Close',
        {
          duration: 3000,
        }
      );
      return;
    }

    // Before navigating to the teambuilder, ensure we preserve the current team context

    // Make sure currentTeamIndex is set correctly in the store
    this.store.setCurrentTeamIndex(this.teamIndex);

    // Set a flag to indicate we're editing an existing team
    if (!this.isNewTeam) {
      this.store.setEditExistingTeam(true);
    }

    console.log('Adding new Pokémon to team index:', this.teamIndex);
    console.log('Current team size:', this.teamCount);

    this.router.navigate(['/teambuilder/pokemon']);
  }

  // Edit an existing Pokemon - Bugged and not working as intended
  editPokemon(index: number): void {
    if (!this.currentTeam || index < 0 || index >= this.currentTeam.length) {
      return;
    }

    const pokemonToEdit = this.currentTeam[index];
    this.store.updateCurrentPokemon(pokemonToEdit);

    this.store.setEditingPokemonIndex(index);

    this.router.navigate(['/teambuilder/pokemon']);
  }

  removePokemon(index: number): void {
    if (!this.currentTeam || index < 0 || index >= this.currentTeam.length) {
      return;
    }

    const pokemonName = this.currentTeam[index].name || 'Pokémon';

    this.store.removePokemonFromTeam(index);

    this.snackBar.open(`${pokemonName} removed from team`, 'Close', {
      duration: 3000,
    });
  }

  saveTeam(): void {
    if (!this.currentTeam || this.currentTeam.length === 0) {
      this.snackBar.open('Cannot save an empty team', 'Close', {
        duration: 3000,
      });
      return;
    }

    if (!this.currentTrainer) {
      this.snackBar.open('You must be logged in to save a team', 'Close', {
        duration: 3000,
      });
      this.router.navigate(['/']);
      return;
    }

    this.store.saveTeamToTrainer();

    console.log('Saving team at index:', this.teamIndex);
    console.log('Team data:', this.currentTeam);

    this.store.currentTrainer$.pipe(take(1)).subscribe((updatedTrainer) => {
      if (!updatedTrainer) {
        this.snackBar.open(
          'Error saving team: Trainer data not found',
          'Close',
          {
            duration: 3000,
          }
        );
        return;
      }

      // Verify the teams in the trainer before saving
      console.log('Trainer teams before save:', updatedTrainer.teams);

      this.builderService.saveTrainer(updatedTrainer).subscribe({
        next: () => {
          this.snackBar.open('Team saved successfully!', 'Close', {
            duration: 3000,
          });
          this.store.resetCurrents();
          this.router.navigate(['/teams']);
        },
        error: (error) => {
          console.error('Error saving team to backend:', error);
          this.snackBar.open(
            'Error saving team to the server. Please try again.',
            'Close',
            {
              duration: 3000,
            }
          );
        },
      });
    });
  }

  // Helper methods for displaying stats, should have been stored in a service honestly at this point.
  getStat(stats: BaseStats, statName: string): number {
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

  getTypeClass(type: string): string {
    return `type-${type.toLowerCase()}`;
  }
  deleteTeam(): void {
    if (!this.currentTeam || !this.currentTrainer) {
      return;
    }

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this entire team?'
    );
    if (!confirmDelete) {
      return;
    }

    this.store.deleteTeamFromTrainer(this.teamIndex);

    this.store.currentTrainer$.pipe(take(1)).subscribe((updatedTrainer) => {
      if (!updatedTrainer) {
        this.snackBar.open(
          'Error deleting team: Trainer data not found',
          'Close',
          {
            duration: 3000,
          }
        );
        return;
      }

      this.builderService.saveTrainer(updatedTrainer).subscribe({
        next: () => {
          this.snackBar.open('Team deleted successfully!', 'Close', {
            duration: 3000,
          });

          this.store.resetCurrents();
          this.router.navigate(['/teams']);
        },
        error: (error) => {
          console.error('Error saving changes to backend:', error);
          this.snackBar.open(
            'Error deleting team. Please try again.',
            'Close',
            {
              duration: 3000,
            }
          );
        },
      });
    });
  }
}
