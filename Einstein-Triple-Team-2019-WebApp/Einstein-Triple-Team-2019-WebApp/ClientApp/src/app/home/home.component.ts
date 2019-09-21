import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit  {
  displayedColumns: string[] = ['place', 'team', 'cf', 'boulder','volleyball', 'score'];
  leaderboard: Array<OC>;

  constructor(private http: HttpClient) { }
  @ViewChild('TABLE') table: ElementRef;
  ExportTOExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'overall.xlsx');

  }


  getTeams(): Observable<OC[]> {
    let url = 'api/Overall';
    return this.http.get<OC[]>(url);
  }

  ngAfterViewInit() {
    this.getTeams().subscribe((resp: Array<OC>) => {

      this.leaderboard = resp;
    }, err => {
      console.log(err);
    });
  }
}

export interface OC {
  team: string;
 cf: number;
  score: number;
  boulder: number;
  volleyball: number;

}
