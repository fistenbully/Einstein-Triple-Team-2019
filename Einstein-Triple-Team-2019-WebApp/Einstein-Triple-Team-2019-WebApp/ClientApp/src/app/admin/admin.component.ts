import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Team } from '../teams/teams.component';


@Component({
  selector: 'app-home',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements AfterViewInit {
  displayedColumns: string[] = ['index', 'team', 'points', 'flash', 'top'];

  selectedTeam: Team;
  teams: Array<Team>;
  boulder: Array<B>;

  constructor(private http: HttpClient) { }

  getBoulder(): Observable<B[]> {
    let url = 'api/boulder';
    return this.http.get<B[]>(url);
  }

  getTeams(): Observable<Team[]> {
    let url = 'api/teams';
    return this.http.get<Team[]>(url);
  }

  ngAfterViewInit() {
    this.getTeams().subscribe((resp: Array<Team>) => {
      this.teams = resp;
    }, err => {
      console.log(err);
      });

    this.getBoulder().subscribe((resp: Array<B>) => {
      this.boulder = resp;
    }, err => {
      console.log(err);
    });
  }
}

export class B {
  Id: string;
  Name: string;
}
