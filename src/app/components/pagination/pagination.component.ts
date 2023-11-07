import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit {
  currentPage = 1;
  totalPages = 10;
  visiblePages: Array<any> = [];
  constructor() {}

  ngOnInit(): void {
    for (let i = 1; i <= 10; i++) {
      if (i < 4 || i > 7) {
        this.visiblePages.push(i);
      } else if (i > 4 && i < 7 && !this.visiblePages.includes('...')) {
        this.visiblePages.push('...')
      }
    }
  }
}
