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
import { AdminComponent } from './admin/admin.component'
import { CrossfitComponent } from'./crossfit/crossfit.component'
import { MatExpansionModule, MatTabsModule, MatSelectModule, MatInputModule, MatButtonModule } from '@angular/material';


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    AdminComponent,
    TeamsComponent,
    VolleyballComponent,
    CrossfitComponent,
    TeamsDetailsComponent,
    BoulderComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatExpansionModule,
    FormsModule,
    MatTabsModule,
    RouterModule.forRoot([
      { path: '', component: TeamsComponent, pathMatch: 'full' },
      { path: 'admin', component: AdminComponent, pathMatch: 'full' },
      { path: 'crossfit', component: CrossfitComponent, pathMatch: 'full'},
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
