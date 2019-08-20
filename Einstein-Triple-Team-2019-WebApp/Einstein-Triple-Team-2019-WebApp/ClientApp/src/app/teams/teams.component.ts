import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements AfterViewInit {
  displayedColumns: string[] = ['name', 'member1', 'member2'];

  teams: Array<Team>;

  constructor(private http: HttpClient) { }



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
  }
}

export class Team {
  Id: string;
  Name: string;
  Member1: string;
  Member2: string;
  SexMultiplier: number;
}
