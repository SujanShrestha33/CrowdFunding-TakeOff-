import { Component, OnInit } from '@angular/core';
import { faClock, faBookmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit{
  loading : boolean = true;
  faClock = faClock;
  faSave = faBookmark;

  constructor () {}

  ngOnInit(): void {
    setTimeout(() => {
      this.loading = false;
    }, 5000)
  }




}
