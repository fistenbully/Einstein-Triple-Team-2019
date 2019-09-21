import { Component, AfterViewInit, ViewChild, ElementRef  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-home',
  templateUrl: './volleyball.component.html',
  styleUrls: ['./volleyball.component.css']
})
export class VolleyballComponent implements AfterViewInit {
  displayedColumns: string[] = ['index', 'name', 'games', 'wins', 'lose'];
  leaderboard: Array<VolleyballGame>;

  constructor(private http: HttpClient) { }
  @ViewChild('TABLE') table: ElementRef;
  ExportTOExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'volleyball.xlsx');

  }


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
