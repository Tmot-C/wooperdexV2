import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { provideHttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { OverviewComponent } from './components/overview/overview.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TeamviewerComponent } from './components/teamviewer/teamviewer.component';
import { StatusbarComponent } from './components/teambuilder/statusbar/statusbar.component';
import { AbilityselectComponent } from './components/teambuilder/abilityselect/abilityselect.component';
import { PokemonselectComponent } from './components/teambuilder/pokemonselect/pokemonselect.component';
import { ItemselectComponent } from './components/teambuilder/itemselect/itemselect.component';
import { MoveselectComponent } from './components/teambuilder/moveselect/moveselect.component';
import { StatselectComponent } from './components/teambuilder/statselect/statselect.component';
import { DexAIComponent } from './components/teambuilder/dex-ai/dex-ai.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    OverviewComponent,
    NavbarComponent,
    TeamviewerComponent,
    StatusbarComponent,
    AbilityselectComponent,
    PokemonselectComponent,
    ItemselectComponent,
    MoveselectComponent,
    StatselectComponent,
    DexAIComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }
