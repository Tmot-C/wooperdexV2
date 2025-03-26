import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { OverviewComponent } from './components/overview/overview.component';
import { TeamviewerComponent } from './components/teamviewer/teamviewer.component';
import { StatusbarComponent } from './components/teambuilder/statusbar/statusbar.component';
import { PokemonselectComponent } from './components/teambuilder/pokemonselect/pokemonselect.component';
import { AbilityselectComponent } from './components/teambuilder/abilityselect/abilityselect.component';
import { MoveselectComponent } from './components/teambuilder/moveselect/moveselect.component';
import { StatselectComponent } from './components/teambuilder/statselect/statselect.component';
import { ItemselectComponent } from './components/teambuilder/itemselect/itemselect.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'teams',
    component: OverviewComponent,
  },
  {
    path: 'teams/:id', //team array index
    component: TeamviewerComponent,
  },
  {
    path: 'teambuilder',
    component: StatusbarComponent,
    children: [
      { path: 'pokemon', component: PokemonselectComponent },
      { path: 'item', component: ItemselectComponent },
      { path: 'ability', component: AbilityselectComponent },
      { path: 'move/1', component: MoveselectComponent },
      { path: 'move/2', component: MoveselectComponent },
      { path: 'move/3', component: MoveselectComponent },
      { path: 'move/4', component: MoveselectComponent },
      { path: 'stats', component: StatselectComponent },
    ],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
