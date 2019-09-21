import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as XLSX from 'xlsx';
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

  @ViewChild('TABLE') table: ElementRef;
  ExportTOExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'boulder.xlsx');

  }

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
