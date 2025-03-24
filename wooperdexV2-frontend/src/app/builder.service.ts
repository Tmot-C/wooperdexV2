import { HttpClient } from "@angular/common/http";
import {Injectable, inject} from "@angular/core";
import {Observable} from "rxjs";
import { Ability, Item, Learnset, Move, Pokemon } from "./models";

@Injectable()
export class BuilderService{

    private http = inject(HttpClient);

    getPokedex(): Observable<Pokemon[]> {
        return this.http.get<Pokemon[]>('/api/pokedex')
    }
    getMoves(): Observable<Move[]> {
        return this.http.get<Move[]>('/api/moves')
    }
    getAbilities(): Observable<Ability[]> {
        return this.http.get<Ability[]>('/api/abilities')
    }
    getItems(): Observable<Item[]> {
        return this.http.get<Item[]>('/api/items')  
    }
    getLearnset(id: string): Observable<Learnset> {
        return this.http.get<Learnset>(`/api/learnset/${id}`)
    }   
}   