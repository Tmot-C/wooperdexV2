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
        console.log(user.id)
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
        console.log("Trainer data loaded:", trainerData);
        // Update the store with the trainer data
        this.store.updateCurrentTrainer(trainerData);
        // No need to directly set this.trainer as we're getting it from the store
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
    this.router.navigate(['/teambuilder/pokemon']);
  }
  
  viewTeam(index: number): void {
    // We'll use the index in the array as the identifier for now
    this.router.navigate(['/teams', index]);
  }
}