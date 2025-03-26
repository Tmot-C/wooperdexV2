// overview.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseAuthService } from '../../firebase-auth.service';
import { BuilderService } from '../../builder.service';
import { BuilderStore } from '../../builder.store';
import { Trainer, Team, BuiltPokemon } from '../../models';
import { Observable } from 'rxjs';
import { ImagePathService } from '../../image-path.service';

@Component({
  selector: 'app-overview',
  standalone: false,
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  private authService = inject(FirebaseAuthService);
  private builderService = inject(BuilderService);
  private store = inject(BuilderStore);
  private router = inject(Router);
  private imageService = inject(ImagePathService);

  trainer$: Observable<Trainer | null> = this.store.currentTrainer$;
  teams: Team[] = [];
  isLoading: boolean = true;
  loadError: string | null = null;

  ngOnInit(): void {
    this.store.resetCurrents();
    this.isLoading = true;

    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.loadTrainerData(user.id);
      } else {
        this.isLoading = false;
        this.loadError = 'You must be logged in to view your teams';
        this.router.navigate(['/']);
      }
    });

    this.trainer$.subscribe((trainer) => {
      if (trainer) {
        this.teams = trainer.teams || [];
        this.isLoading = false;
      }
    });
  }

  loadTrainerData(userId: string): void {
    this.builderService.getTrainer(userId).subscribe({
      next: (trainerData) => {
        this.store.updateCurrentTrainer(trainerData);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading trainer data:', error);
        this.loadError = 'Failed to load your teams. Please try again later.';
        this.isLoading = false;
      },
    });
  }

  navigateToTeamBuilder(): void {
    this.store.setCurrentTeamIndex(0);

    this.store.loadTeam([]);

    this.router.navigate(['/teambuilder/pokemon']);
  }

  viewTeam(index: number): void {
    const teamIndex = index + 1;

    // Navigate to the team viewer with the team index
    this.router.navigate(['/teams', teamIndex]);
  }

  getPokemonSpritePath(pokemonId: string | null): string {
    return this.imageService.getPokemonSpritePath(pokemonId);
  }

  handleImageError(event: any): void {
    this.imageService.handleImageError(event);
  }

  // Calculate empty slots to display placeholders
  getEmptySlots(teamPokemon: BuiltPokemon[]): number[] {
    const emptyCount = 6 - (teamPokemon?.length || 0);
    return emptyCount > 0 ? Array(emptyCount).fill(0) : [];
  }
}
