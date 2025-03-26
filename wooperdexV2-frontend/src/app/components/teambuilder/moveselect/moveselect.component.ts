import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BuilderStore } from '../../../builder.store';
import { BuilderService } from '../../../builder.service';
import { BuiltPokemon, Move, Learnset } from '../../../models';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-moveselect',
  standalone: false,
  templateUrl: './moveselect.component.html',
  styleUrl: './moveselect.component.scss',
})
export class MoveselectComponent implements OnInit {
  private store = inject(BuilderStore);
  private builderService = inject(BuilderService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  currentPokemon: BuiltPokemon | null = null;
  allMoves: Move[] = [];
  availableMoves: Move[] = [];
  filteredMoves: Move[] = [];
  learnset: string[] = [];

  searchControl = new FormControl('');
  moveSlot: number = 1;
  selectedType: string | null = null;
  selectedCategory: string | null = null;

  // For filtering again
  categories: string[] = ['Physical', 'Special', 'Status'];

  ngOnInit(): void {
    // Get move slot from route
    this.route.url.subscribe((segments) => {
      if (segments.length > 0) {
        const slotParam = segments[segments.length - 1].path;
        this.moveSlot = parseInt(slotParam) || 1;
      }
    });

    this.store.currentPokemon$.subscribe((pokemon) => {
      this.currentPokemon = pokemon;

      if (!pokemon) {
        this.router.navigate(['/teambuilder/pokemon']);
        return;
      }

      // Load the learnset for this Pokémon
      this.builderService
        .getLearnset(pokemon.id as string)
        .subscribe((learnset) => {
          this.learnset = learnset.moves || [];
          this.filterAvailableMoves();
        });
    });

    // Load all moves from store
    this.store.movelist$.subscribe((moves) => {
      this.allMoves = moves;
      this.filterAvailableMoves();
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.applyFilters();
      });
  }

  filterAvailableMoves(): void {
    if (!this.learnset.length || !this.allMoves.length) {
      return;
    }

    // Filter moves to only those in the learnset
    this.availableMoves = this.allMoves.filter((move) =>
      this.learnset.includes(move.id)
    );

    this.applyFilters();
  }

  applyFilters(): void {
    const searchTerm = this.searchControl.value?.toLowerCase() || '';

    this.filteredMoves = this.availableMoves.filter((move) => {
      const matchesSearch = searchTerm
        ? move.name.toLowerCase().includes(searchTerm) ||
          move.type.toLowerCase().includes(searchTerm) ||
          move.category.toLowerCase().includes(searchTerm) ||
          (move.shortDesc && move.shortDesc.toLowerCase().includes(searchTerm))
        : true;

      const matchesType = this.selectedType
        ? move.type.toLowerCase() === this.selectedType.toLowerCase()
        : true;

      const matchesCategory = this.selectedCategory
        ? move.category.toLowerCase() === this.selectedCategory.toLowerCase()
        : true;

      return matchesSearch && matchesType && matchesCategory;
    });

    this.filteredMoves.sort((a, b) => {
      if (a.category === 'Status' && b.category !== 'Status') return 1;
      if (a.category !== 'Status' && b.category === 'Status') return -1;

      return b.basePower - a.basePower;
    });
  }

  selectMove(move: Move): void {
    if (!this.currentPokemon) return;

    const updatedPokemon: BuiltPokemon = {
      ...this.currentPokemon,
    };

    // Barbaric switch statement to update the correct move slot
    switch (this.moveSlot) {
      case 1:
        updatedPokemon.move1 = move.name;
        break;
      case 2:
        updatedPokemon.move2 = move.name;
        break;
      case 3:
        updatedPokemon.move3 = move.name;
        break;
      case 4:
        updatedPokemon.move4 = move.name;
        break;
    }

    this.store.updateCurrentPokemon(updatedPokemon);

    if (this.moveSlot < 4) {
      this.router.navigate(['/teambuilder/move', this.moveSlot + 1]);
    } else {
      this.router.navigate(['/teambuilder/stats']);
    }
  }

  setTypeFilter(type: string | null): void {
    this.selectedType = type;
    this.applyFilters();
  }

  setCategoryFilter(category: string | null): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.selectedType = null;
    this.selectedCategory = null;
    this.applyFilters();
  }

  goBack(): void {
    if (this.moveSlot > 1) {
      this.router.navigate(['/teambuilder/move', this.moveSlot - 1]);
    } else {
      this.router.navigate(['/teambuilder/ability']);
    }
  }

  skipToStats(): void {
    this.router.navigate(['/teambuilder/stats']);
  }
}
