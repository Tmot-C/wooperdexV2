import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BuilderStore } from '../../builder.store';
import { BuiltPokemon, BaseStats, Team, Trainer } from '../../models';
import { StatsService } from '../../stats.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { switchMap, take } from 'rxjs';
import { BuilderService } from '../../builder.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-teamviewer',
  standalone: false,
  templateUrl: './teamviewer.component.html',
  styleUrl: './teamviewer.component.scss'
})
export class TeamviewerComponent implements OnInit {
  private store = inject(BuilderStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private statsService = inject(StatsService);
  private snackBar = inject(MatSnackBar);
  private builderService = inject(BuilderService);
  private fb = inject(FormBuilder);
  
  teamForm!: FormGroup;
  currentTeam: BuiltPokemon[] | null = null;
  currentTrainer: Trainer | null = null;
  teamCount: number = 0;
  teamIndex: number = 0;
  isNewTeam: boolean = true;
  
  ngOnInit(): void {
    // Initialize form
    console.log("TeamViewer init");
    this.teamForm = this.fb.group({
      teamName: ['']
    });
    
    // Get the team index from the route parameter
    this.route.params.pipe(
      switchMap(params => {
        this.teamIndex = parseInt(params['id']) || 0;
        this.store.setCurrentTeamIndex(this.teamIndex);
        this.isNewTeam = this.teamIndex === 0;

        console.log("Route param processed, team index:", this.teamIndex);
        
        // Return the trainer observable to continue the chain
        return this.store.currentTrainer$;
      }),
      switchMap(trainer => {
        console.log("Current trainer from store:", trainer);
        this.currentTrainer = trainer;
        
        // If we're editing an existing team and we have trainer data
        if (!this.isNewTeam && trainer && trainer.teams && trainer.teams.length > this.teamIndex - 1) {
          // Load the team from trainer data
          const existingTeam = trainer.teams[this.teamIndex - 1];
          this.store.loadTeam(existingTeam.team);
          
          // Set the team name in the form
          this.teamForm.patchValue({
            teamName: existingTeam.teamName || `Team ${this.teamIndex}`
          });
        } else {
          // Set a default team name for new teams
          this.teamForm.patchValue({
            teamName: `Team ${trainer?.teams?.length ? trainer.teams.length + 1 : 1}`
          });
        }
        
        // Return the team observable
        return this.store.currentTeam$;
      })
    ).subscribe(team => {
      this.currentTeam = team;
      this.teamCount = team ? team.length : 0;
    });
  }
  
  // Save team method is now cleaner with form handling
  saveTeam(): void {
    if (!this.currentTeam || this.currentTeam.length === 0) {
      this.snackBar.open('Cannot save an empty team', 'Close', { duration: 3000 });
      return;
    }
    
    if (!this.currentTrainer) {
      this.snackBar.open('You must be logged in to save a team', 'Close', { duration: 3000 });
      this.router.navigate(['/']);
      return;
    }

    // Get team name from form
    const teamName = this.teamForm.get('teamName')?.value || 
                    `Team ${this.teamIndex || (this.currentTrainer.teams?.length || 0) + 1}`;
    
    // Update trainer in store
    this.store.saveTeamToTrainer(teamName);
    
    // Save to backend
    this.store.currentTrainer$.pipe(take(1)).subscribe(updatedTrainer => {
      if (!updatedTrainer) {
        this.snackBar.open('Error saving team: Trainer data not found', 'Close', { duration: 3000 });
        return;
      }
      
      this.builderService.saveTrainer(updatedTrainer).subscribe({
        next: () => {
          this.snackBar.open('Team saved successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/teams']);
        },
        error: (error) => {
          console.error('Error saving team to backend:', error);
          this.snackBar.open('Error saving team to the server. Please try again.', 'Close', { duration: 3000 });
        }
      });
    });
  }
  
  // Other methods remain the same...
  
  addNewPokemon(): void {
    if (this.teamCount >= 6) {
      this.snackBar.open('Team is full! Remove a Pokémon before adding a new one.', 'Close', { duration: 3000 });
      return;
    }
    
    this.router.navigate(['/teambuilder/pokemon']);
  }
  
  editPokemon(index: number): void {
    if (!this.currentTeam || index < 0 || index >= this.currentTeam.length) {
      return;
    }
    
    // Set the selected Pokemon as the current Pokemon in the store
    const pokemonToEdit = this.currentTeam[index];
    this.store.updateCurrentPokemon(pokemonToEdit);
    
    // Remove it from the team
    this.removePokemon(index);
    
    // Navigate to team builder
    this.router.navigate(['/teambuilder/pokemon']);
  }
  
  removePokemon(index: number): void {
    if (!this.currentTeam || index < 0 || index >= this.currentTeam.length) {
      return;
    }
    
    const pokemonName = this.currentTeam[index].name || 'Pokémon';
    
    // Remove the Pokemon from the team in the store
    this.store.removePokemonFromTeam(index);
    
    // Show a snackbar confirmation
    this.snackBar.open(`${pokemonName} removed from team`, 'Close', { duration: 3000 });
  }
  
  // Helper methods for displaying stats
  getStat(stats: BaseStats, statName: string): number {
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
  
  getStatPercentage(value: number): number {
    return this.statsService.getStatPercentage(value);
  }
  
  getTypeClass(type: string): string {
    return `type-${type.toLowerCase()}`;
  }
}