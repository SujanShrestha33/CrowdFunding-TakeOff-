import { Component, OnInit } from '@angular/core';
import { faClock, faBookmark } from '@fortawesome/free-solid-svg-icons';
import { Projects } from 'src/app/Models/projects.model';
import { ProductService } from '../../Services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/Services/auth.service';
import { ToastrService } from 'ngx-toastr';
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
  currentUser = this.authService.userId;
  pageType : string = '';

  constructor(private projectService: ProductService, private router : Router, private authService : AuthService, private route : ActivatedRoute, private toastr : ToastrService) {}

  ngOnInit(): void {
    this.route.params.subscribe((res) => {
      console.log(res);
      this.pageType = res['type'];
      if(this.pageType === 'new'){
        this.getProjects();
      }else if (this.pageType === 'mycampaign'){
        this.getUserSpecificProjects();
      }else if (this.pageType === 'saved'){
        this.getSavedProjects();
      }
    });


  }

  getUserSpecificProjects() {
    this.loading = true;
    this.projectService.getProductsList().subscribe({
      next: (res) => {
        console.log(res);
        this.projects = res['data'] as Projects[];
        console.log(this.projects);
        console.log(this.projectCount);
        console.log(this.currentUser);
        this.projects = this.projects.filter((elem) => elem['author'] === this.currentUser);
        // this.projects.forEach(elem => {
          //   elem.remainingDays = this.currentFormattedDate - elem.endDate
          // })
          this.projectCount = this.projects.length;
        console.log(this.projects);
        this.loading = false;
        this.projectService.getRemDays(this.projects);
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
      complete: () => {},
    });
  }

  getProjects() {
    this.loading = true;
    this.projectService.getProductsList().subscribe({
      next: (res) => {
        console.log(res);
        this.projects = res['data'] as Projects[];
        console.log(this.projects);
        console.log(this.projectCount);
        console.log(this.currentUser);
        this.projects = this.projects.filter((elem) => elem['author'] !== this.currentUser);
        // this.projects.forEach(elem => {
          //   elem.remainingDays = this.currentFormattedDate - elem.endDate
          // })
          this.projectCount = this.projects.length;
        console.log(this.projects);
        this.loading = false;
        this.projectService.getRemDays(this.projects);
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
      complete: () => {},
    });
  }

  getCoverImageUrl(path : string): string {
    // console.log(path);
      return `http://localhost:8080/${path}`;
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
    this.router.navigate([`project-view/${id}/${this.pageType}`]);
  }

  createBookmark(id : string){
    this.projectService.createBookmark(id)
    .subscribe({
      next : (res) => {
        console.log(res);
      },
      error : err => {
        console.log(err);
        this.toastr.error('Already Saved, check your saved campaigns');
      },
      complete : () => {

      }
    })
  }

  getSavedProjects(){
    this.loading = true;
    this.projectService.getBookmarks()
    .subscribe({
      next : (res) => {
        console.log(res);
        let projs = res['data'] as Projects[];
        this.projects = [];
        this.projects.push(projs[0]['projectId']);
        // console.log(proj);
        // this.projects = this.projects.filter((elem) => elem['author'] !== this.currentUser);
        // this.projects.forEach(elem => {
          //   elem.remainingDays = this.currentFormattedDate - elem.endDate
          // })
          this.projectCount = this.projects.length;
        console.log(this.projects);
        this.loading = false;
        this.projectService.getRemDays(this.projects);
      },
      error : err => {
        console.log(err);
        this.loading = false;
      },
      complete : () => {

      }
    })
  }
}
