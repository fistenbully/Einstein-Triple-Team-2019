import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Time } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './crossfit.component.html',
  styleUrls: ['./crossfit.component.css']
})
export class CrossfitComponent implements AfterViewInit {
  displayedColumns: string[] = ['place', 'name', 'score'];
  displayedColumnsWod1: string[] = ['place', 'name', 'weight', 'reps', 'score'];
  displayedColumnsWod2: string[] = ['place', 'name', 'time', 'reps', 'score'];

  wod1: Array<Wod1>;
  wod2: Array<Wod2and3>;
  wod3: Array<Wod2and3>;

  leaderboard: Array<leaderboad>;

  constructor(private http: HttpClient) { }

  getWod2(): Observable<Wod2and3[]> {
    let url = 'api/crossfit/wod2';
    return this.http.get<Wod2and3[]>(url);
  }

  getWod3(): Observable<Wod2and3[]> {
    let url = 'api/crossfit/wod3';
    return this.http.get<Wod2and3[]>(url);
  }

  getLeaderboard(): Observable<leaderboad[]> {
    let url = 'api/crossfit/leaderboard';
    return this.http.get<leaderboad[]>(url);
  }

  getWod1(): Observable<Wod1[]> {
    let url = 'api/crossfit/wod1';
    return this.http.get<Wod1[]>(url);
  }

  ngAfterViewInit() {
    this.getLeaderboard().subscribe((resp: Array<leaderboad>) => {
      if (resp.length > 0) {
        this.leaderboard = resp;
      }
    });

    this.getWod2().subscribe((resp: Array<Wod2and3>) => {

      if (resp.length > 0) {
        this.wod2 = resp;
      
      }
    }, err => {
      console.log(err);
      });

    this.getWod3().subscribe((resp: Array<Wod2and3>) => {
      if (resp.length > 0) {
        this.wod3 = resp;
      }
    }, err => {
      console.log(err);
    });

    this.getWod1().subscribe((resp: Array<Wod1>) => {
      if (resp.length > 0) {
        this.wod1 = resp;
      }
    }, err => {
      console.log(err);
    });
  }
}

export class leaderboad {
  name: string;
  details: Array<leaderboardDetails>;
  score: number;
  place: number;
}

export class leaderboardDetails {
  name: string;
  score: string;
  place: number;
}

export class Wod2and3 {
  name: string;
  reps: number;
  time: string;
  place: number;
  score: string;
  sexMultiplier: number;
}

export class Wod1 {
  name: string;
  reps: number;
  weight: number;
  score: number;
  sexMultiplier: number;
  place: number;
}
