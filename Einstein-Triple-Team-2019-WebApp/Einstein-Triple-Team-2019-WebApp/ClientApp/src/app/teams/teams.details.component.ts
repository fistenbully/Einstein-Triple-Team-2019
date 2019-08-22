import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {  ActivatedRoute } from '@angular/router';
import {Team} from './teams.component'

@Component({
  selector: 'app-home',
  templateUrl: './teams.details.component.html',
  styleUrls: ['./teams.details.component.css']
})
export class TeamsDetailsComponent implements AfterViewInit {
  teamDetailColumns: string[] = ['name', 'member1', 'member2'];
  boulderDisplayedColumns: string[] = ['boulder', 'points', 'flash', 'top'];
  volleyballDisplayedColumns: string[] = ['home', 'guest', 'setOne', 'setTwo'];

  vbgs : Array<VBG>;
  teams: Array<Team>;
  boulder: Array<BoulderDetails>;
  teamId: string;
  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.route.paramMap.subscribe(result => {
      this.teamId = result.get('teamId');
    })
  }

  getBoulderByTeamId(): Observable<BoulderDetails[]> {
    let url = 'api/boulder/' + this.teamId;
    return this.http.get<BoulderDetails[]>(url);
  }

  getTeamById(): Observable<Team[]> {
    let url = 'api/teams/'+this.teamId;
    return this.http.get<Team[]>(url);
  }

  getVolleyBallGames(): Observable<Array<VBG>> {
    let url = 'api/volleyball/' + this.teamId;
    return this.http.get<VBG[]>(url);
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

    this.getVolleyBallGames().subscribe((resp: Array<VBG>) => {
      this.vbgs = resp;
    })
  }
}

export class VBG {
  Home: string;
  Guest: string;
  SetOne: string;
  SetTwo: string;
}

export class BoulderDetails {
  boulderName: string;
  flash: number;
  zop: number;
  ponts: number;
}

