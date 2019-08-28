import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './crossfit.component.html',
  styleUrls: ['./crossfit.component.css']
})
export class CrossfitComponent implements AfterViewInit {
  displayedColumns: string[] = ['index', 'name', 'reps', 'weight', 'score'];

  wod1: Array<Wod1>;

  constructor(private http: HttpClient) { }



  getTeams(): Observable<Wod1[]> {
    let url = 'api/crossfit/wod1';
    return this.http.get<Wod1[]>(url);
  }

  ngAfterViewInit() {
    this.getTeams().subscribe((resp: Array<Wod1>) => {

     this.wod1 = resp;
    }, err => {
      console.log(err);
    });
  }
}

export class Wod1 {
  name: string;
  reps: number;
  weight: number;
  score: number;
  sexMultiplier: number;
}
