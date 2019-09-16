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
  displayedColumns: string[] = ['place', 'name', 'score'];
  displayedColumnsWod1: string[] = ['place', 'name', 'weight', 'reps', 'score'];
  displayedColumnsWod2: string[] = ['place', 'name', 'time', 'reps', 'score'];



  wod1: Array<CF>;
  wod2:Array< CF>;
  wod3: Array<CF>;
  cf: Array<CF>;
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

  getCrossfitByTeamId(): Observable<Array<CF>> {
    let url = 'api/Crossfit/wod/' + this.teamId;
    return this.http.get<Array<CF>>(url);
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

      if (resp.length > 0) {
        this.boulder = resp;
      }
    });

    this.getVolleyBallGames().subscribe((resp: Array<VBG>) => {
      if (resp.length > 0) {
        this.vbgs = resp;
      }
    });

    this.getCrossfitByTeamId().subscribe((resp: Array<CF>) => {
      resp.forEach((v,i) => {
        if (v.wod == '1') {
          this.wod1 = new Array<CF>();
          this.wod1.push(v);
        }
        else if (v.wod == '2') {
          this.wod2 = new Array<CF>();
          this.wod2.push(v);
        }
        else if (v.wod == '3') {
          this.wod3 = new Array<CF>();
          this.wod3.push(v);
        }
      })
    });
  }
}

export class CF {
  name: string;
  reps: number;
  score: string;
  sexMultiplier: number;
  place: number;
  weight: number;
  time: string;
  wod: string;
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

