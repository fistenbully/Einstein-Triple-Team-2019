import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './volleyball.component.html',
})
export class VolleyballComponent implements AfterViewInit {


  leaderboard: Array<VolleyballGame>;

  constructor(private http: HttpClient) { }



  getTeams(): Observable<VolleyballGame[]> {
    let url = 'api/volleyball/leaderboard';
    return this.http.get<VolleyballGame[]>(url);
  }

  ngAfterViewInit() {
    this.getTeams().subscribe((resp: Array<VolleyballGame>) => {

      this.leaderboard = resp;
    }, err => {
      console.log(err);
    });
  }
}

export interface VolleyballGame {
  team: string;
  games: number;
  wins: number;
  lose: number;
  OwnPoints: number;
  OtherPoints: number;
}
