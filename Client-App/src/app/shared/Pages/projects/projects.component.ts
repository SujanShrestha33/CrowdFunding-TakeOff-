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
  cat : string = "";

  constructor(private projectService: ProductService, private router : Router, private authService : AuthService, private route : ActivatedRoute, private toastr : ToastrService) {}

  ngOnInit(): void {
    this.route.params.subscribe((res) => {
      console.log(res);
      this.pageType = res['type'];
      this.cat = res['cat'];
      if(this.pageType === 'new'){
        this.getProjects();
      }else if (this.pageType === 'mycampaign'){
        this.getUserSpecificProjects();
      }else if (this.pageType === 'saved'){
        this.getSavedProjects();
      }else if(this.pageType === 'myinvestment'){
        this.getinvestedProject();
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
        if(this.cat !== 'All'){
          this.projects = this.projects.filter((elem) => elem['category'] === this.cat);
        }
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
    if(this.authService.loggedIn === false){
      this.toastr.error('Please login to save this campaign');
      return;
    }
    this.projectService.createBookmark(id)
    .subscribe({
      next : (res) => {
        console.log(res);
      this.toastr.success('Campaign saved successfully');
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
        console.log(projs);
        this.projects = [];
        projs.forEach(elem => {
          this.projects.push(elem['projectId']);
        })
        // this.projects.push(projs[0]['projectId']);
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

  getinvestedProject(){
    this.loading = true;
    this.projectService.getInvestedProject()
    .subscribe({
      next : (res) => {
        console.log(res);
        let projs = res['data'] as Projects[];
        console.log(projs);
        this.projects = [];
        projs.forEach(elem => {
          this.projects.push(elem['projectId']);
        })
        // this.projects.push(projs[0]['projectId']);
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
