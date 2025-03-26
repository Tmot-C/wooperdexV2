import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BuilderStore } from '../../builder.store';
import { FirebaseAuthService } from '../../firebase-auth.service';
import { filter, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { BuilderService } from '../../builder.service';
import { BuiltPokemon } from '../../models';
import { DexAIComponent } from '../teambuilder/dex-ai/dex-ai.component';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  private authService = inject(FirebaseAuthService);
  private store = inject(BuilderStore);
  private router = inject(Router);
  private builderService = inject(BuilderService);
  private dialog = inject(MatDialog);
  
  currentUser: any = null;
  isTeamsPage: boolean = false;
  isTeambuilderPage: boolean = false;
  currentPokemon$: Observable<BuiltPokemon | null> = this.store.currentPokemon$;
  currentPokemon: BuiltPokemon | null = null;
  
  ngOnInit(): void {
    // Subscribe to user changes
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    // Subscribe to router events to track current page
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Check if we're on the teams page
      this.isTeamsPage = event.url === '/teams' || event.url.startsWith('/teams/');
      // Check if we're on the teambuilder page
      this.isTeambuilderPage = event.url.startsWith('/teambuilder');
    });
    
    // Set initial state based on current URL
    this.isTeamsPage = this.router.url === '/teams' || this.router.url.startsWith('/teams/');
    this.isTeambuilderPage = this.router.url.startsWith('/teambuilder');
    
    // Subscribe to current Pokémon
    this.currentPokemon$.subscribe(pokemon => {
      this.currentPokemon = pokemon;
    });
  }
  
  navigateToTeams(): void {
    //reset non essential
    this.store.resetCurrents();
    this.router.navigate(['/teams']);
  }
  
  logout(): void {
    
    this.authService.signOut().then(() => {
      //
      this.store.resetCurrents();
      
      
      this.router.navigate(['/']);
    }).catch(error => {
      console.error('Logout error:', error);
      // Still try to navigate away and reset store even if there's an error
      this.store.resetCurrents();
      this.router.navigate(['/']);
    });
  }
  
  showPokemonAnalysis(): void {
    if (!this.currentPokemon || !this.currentPokemon.name) return;
    
    this.builderService.getPokemonAnalysis(this.currentPokemon.name)
      .subscribe({
        next: (analysisText) => {
          // Open dialog with the analysis
          this.dialog.open(DexAIComponent, {
            width: '500px',
            data: { analysisText }
          });
        },
        error: (error) => {
          console.error('Error fetching Pokémon analysis:', error);
          // Optionally show an error message
        }
      });
  }
}
