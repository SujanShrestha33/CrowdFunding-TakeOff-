import { Component, OnInit } from '@angular/core';
import { faClock, faBookmark } from '@fortawesome/free-solid-svg-icons';
import { Projects } from 'src/app/Models/projects.model';
import { ProductService } from '../../Services/product.service';
import { Router } from '@angular/router';
// import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  loading: boolean = false;
  faClock = faClock;
  faSave = faBookmark;
  projects: Projects[] = [];
  projectCount: number = 0;
  currentFormattedDate: string = '';

  constructor(private projectService: ProductService, private router : Router) {}

  ngOnInit(): void {
    this.getProjects();
  }

  getProjects() {
    this.loading = true;
    this.projectService.getProductsList().subscribe({
      next: (res) => {
        console.log(res);
        this.projects = res['data'] as Projects[];
        console.log(this.projects);
        this.projectCount = this.projects.length;
        console.log(this.projectCount);
        // this.projects.forEach(elem => {
        //   elem.remainingDays = this.currentFormattedDate - elem.endDate
        // })
        this.projectService.getRemDays(this.projects);
        console.log(this.projects);
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
      complete: () => {},
    });
  }

  getSpecificProject(id: string) {
    this.loading = true;
    this.projectService.getSpecificProject(id).subscribe({
      next: (res) => {
        console.log(res);
        this.projects = res as Projects[];
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
      complete: () => {},
    });
  }

  navigate(id : string) {
    this.router.navigate([`project-view/${id}`]);
  }
}
