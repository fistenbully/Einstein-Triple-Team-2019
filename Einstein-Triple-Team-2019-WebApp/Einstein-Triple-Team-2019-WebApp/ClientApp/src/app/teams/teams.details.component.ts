import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Boulder } from '../boulder/boulder.component'
import {Team} from './teams.component'

@Component({
  selector: 'app-home',
  templateUrl: './teams.details.component.html',
  styleUrls: ['./teams.details.component.css']
})
export class TeamsDetailsComponent implements AfterViewInit {
  teamDetailColumns: string[] = ['name', 'member1', 'member2'];
  boulderDisplayedColumns: string[] = ['boulder', 'points', 'flash', 'top'];

  teams: Array<Team>;
  boulder: Array<BoulderDetails>
  teamId = "6438c23b-3456-47a4-9fce-a57f54d77fe6";
  constructor(private http: HttpClient) { }

  getBoulderByTeamId(): Observable<BoulderDetails[]> {
    let url = 'api/boulder/' + this.teamId;
    return this.http.get<BoulderDetails[]>(url);
  }

  getTeamById(): Observable<Team[]> {
    let url = 'api/teams/'+this.teamId;
    return this.http.get<Team[]>(url);
  }

  ngAfterViewInit() {
    this.getTeamById().subscribe((resp: Array<Team>) => {
     this.teams = resp;
    }, err => {
      console.log(err);
      });

    this.getBoulderByTeamId().subscribe((resp: Array<BoulderDetails>) => {
      this.boulder = resp;
    });
  }
}

export class BoulderDetails {
  boulderName: string;
  flash: number;
  zop: number;
  ponts: number;
}

