import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { provideHttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module'; // Import our custom Material module
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';

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
    DexAIComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent],
})
export class AppModule {}
