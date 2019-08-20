import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { TeamsComponent } from './teams/teams.component';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { VolleyballComponent} from './volleyball/volleyball.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material';
import { BoulderComponent } from './boulder/boulder.component'
import { TeamsDetailsComponent } from './teams/teams.details.component'
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    TeamsComponent,
    VolleyballComponent,
    TeamsDetailsComponent,
    BoulderComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatExpansionModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'teams', component: TeamsComponent, pathMatch: 'full' },
      { path: 'teams/:teamId', component: TeamsDetailsComponent, pathMatch: 'full'},
      { path: 'volleyball', component: VolleyballComponent, pathMatch: 'full' },
      { path: 'boulder', component: BoulderComponent, pathMatch: 'full'}
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
