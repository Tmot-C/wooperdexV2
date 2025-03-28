import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { BuilderStore } from '../../../builder.store';
import { Item, BuiltPokemon } from '../../../models';
import { ImagePathService } from '../../../image-path.service';

@Component({
  selector: 'app-itemselect',
  standalone: false,
  templateUrl: './itemselect.component.html',
  styleUrl: './itemselect.component.scss',
})
export class ItemselectComponent implements OnInit {
  private store = inject(BuilderStore);
  private router = inject(Router);
  public imageService = inject(ImagePathService);

  searchControl = new FormControl('');
  currentPokemon: BuiltPokemon | null = null;
  allItems: Item[] = [];
  filteredItems: Item[] = [];

  selectedCategory: string | null = null;
  categories: string[] = [];

  ngOnInit(): void {
    this.store.currentPokemon$.subscribe((pokemon) => {
      this.currentPokemon = pokemon;

      if (!pokemon) {
        this.router.navigate(['/teambuilder/pokemon']);
        return;
      }
    });

    this.store.itemlist$.subscribe((items) => {
      this.allItems = items;

      // Extract unique categories, was done before consts
      this.categories = [
        ...new Set(items.map((item) => item.category).filter(Boolean)),
      ];
      console.log('Categories:', this.categories);

      this.applyFilters();
    });

    //https://www.learnrxjs.io/learn-rxjs/operators/filtering/debouncetime
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.applyFilters();
      });
  }

  applyFilters(): void {
    const searchTerm = this.searchControl.value?.toLowerCase() || '';

    this.filteredItems = this.allItems.filter((item) => {
      const matchesSearch = searchTerm
        ? item.name.toLowerCase().includes(searchTerm) ||
          (item.shortDesc && item.shortDesc.toLowerCase().includes(searchTerm))
        : true;

      const matchesCategory = this.selectedCategory
        ? item.category === this.selectedCategory
        : true;

      return matchesSearch && matchesCategory;
    });

    this.filteredItems.sort((a, b) => a.name.localeCompare(b.name));
  }

  selectItem(item: Item): void {
    if (!this.currentPokemon) return;

    const updatedPokemon: BuiltPokemon = {
      ...this.currentPokemon,
      item: item.name,
    };

    this.store.updateCurrentPokemon(updatedPokemon);
    this.router.navigate(['/teambuilder/ability']);
  }

  setCategoryFilter(category: string | null): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.selectedCategory = null;
    this.applyFilters();
  }

  goBack(): void {
    this.router.navigate(['/teambuilder/pokemon']);
  }
}
