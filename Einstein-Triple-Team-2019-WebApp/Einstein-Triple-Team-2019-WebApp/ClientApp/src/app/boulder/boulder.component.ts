import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './boulder.component.html',
  styleUrls: ['./boulder.component.css']
})
export class BoulderComponent implements AfterViewInit {
  displayedColumns: string[] = ['index', 'team', 'points', 'flash', 'top'];

  boulder: Array<Boulder>;

  constructor(private http: HttpClient) { }



  getTeams(): Observable<Boulder[]> {
    let url = 'api/boulder/leaderboard';
    return this.http.get<Boulder[]>(url);
  }

  ngAfterViewInit() {
    this.getTeams().subscribe((resp: Array<Boulder>) => {

     this.boulder = resp;
    }, err => {
      console.log(err);
    });
  }
}

export class Boulder {
  team: string;
  points: number;
  flash: number;
  top: number;
}
