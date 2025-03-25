import { Component, inject, OnInit } from '@angular/core';
import { BuilderService } from './builder.service';
import { BuilderStore } from './builder.store';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'wooperdexV2-frontend';

  private builderService = inject(BuilderService);
  private store = inject(BuilderStore);

  ngOnInit(): void {
    // Load all initial data in parallel using forkJoin
    forkJoin({
      pokedex: this.builderService.getPokedex(),
      items: this.builderService.getItems(),
      moves: this.builderService.getMoves(),
      abilities: this.builderService.getAbilities()
    }).subscribe({
      next: (data) => {
        // Set all data in the store using the corrected updater methods
        this.store.setPokedex(data.pokedex);
        this.store.setItems(data.items);
        this.store.setMoves(data.moves);
        this.store.setAbilities(data.abilities);
        
        console.log('App data loaded successfully');
      },
      error: (error) => {
        console.error('Error loading initial app data:', error);
      }
    });
  }
}
