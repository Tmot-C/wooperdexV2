// overview.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseAuthService } from '../../firebase-auth.service';
import { BuilderService } from '../../builder.service';
import { BuilderStore } from '../../builder.store';
import { Trainer, Team } from '../../models';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-overview',
  standalone: false,
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  
  private authService = inject(FirebaseAuthService);
  private builderService = inject(BuilderService);
  private store = inject(BuilderStore);
  private router = inject(Router);
  
  trainer$: Observable<Trainer | null> = this.store.currentTrainer$;
  teams: Team[] = [];
  isLoading: boolean = true;
  loadError: string | null = null;
  
  ngOnInit(): void {
    this.isLoading = true;
    
    // Subscribe to the authenticated user
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.loadTrainerData(user.id);
      } else {
        this.isLoading = false;
        this.loadError = 'You must be logged in to view your teams';
        this.router.navigate(['/']);
      }
    });

    // Subscribe to the store to get the current trainer
    this.trainer$.subscribe(trainer => {
      if (trainer) {
        this.teams = trainer.teams || [];
        this.isLoading = false;
      }
    });
  }
  
  loadTrainerData(userId: string): void {
    this.builderService.getTrainer(userId).subscribe({
      next: (trainerData) => {
        // Update the store with the trainer data
        this.store.updateCurrentTrainer(trainerData);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading trainer data:', error);
        this.loadError = 'Failed to load your teams. Please try again later.';
        this.isLoading = false;
      }
    });
  }
  
  navigateToTeamBuilder(): void {
    // For a new team, use index 0
    this.store.setCurrentTeamIndex(0);
    
    // Initialize an empty team
    this.store.loadTeam([]);
    
    // Navigate to the team builder for creating a new Pokémon
    this.router.navigate(['/teambuilder/pokemon']);
  }
  
  viewTeam(index: number): void {
    // Calculate the team index for the router
    // Index in UI is 0-based, but in routing we use 1-based for existing teams
    const teamIndex = index + 1;
    
    // Navigate to the team viewer with the correct index
    this.router.navigate(['/teams', teamIndex]);
  }
}