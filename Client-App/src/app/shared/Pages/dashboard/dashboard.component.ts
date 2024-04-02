import { Component, OnInit } from '@angular/core';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { Projects } from 'src/app/Models/projects.model';
import { ProductService } from '../../Services/product.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/Services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor (
    private projectService : ProductService, private router : Router, private toastr : ToastrService, private authService : AuthService
  ) {}

  ngOnInit(): void {
    this.getTopProjects();
  }

  loading: boolean = false;
  faClock = faClock;
  projects: Projects[] = [];
  topProject : Projects | null = null;
  socialLinks : any[] = [];
  innerLoading : boolean = false;

  getTopProjects(){
    this.loading = true;
    this.projectService.getTopProjects().subscribe({
      next : (res) => {
        console.log(res);
        this.projects = res['data'] as Projects[];
        console.log(this.projects);
        this.projectService.getRemDays(this.projects);
        this.projects = this.projectService.filterProject(this.projects);
        if (this.projects.length > 0) {
          this.topProject = this.projects[0]; // Assigning the top project
          this.projects = this.projects.slice(1); // Assigning the rest of the projects
        }

        this.projects = this.projects.slice(0, 3); // Slicing to get only the top 4 projects
        // console.log(this.topProjects);
        console.log(this.topProject);
        if(this.topProject['socialLinks'] !== null || this.topProject['socialLinks'] !== undefined){
          this.socialLinks = this.topProject['socialLinks'];
        }
        console.log(this.socialLinks);
        console.log(this.projects);
        this.loading = false;
      },
      error : (err) => {
        console.log(err);
        this.loading = false;
      },
      complete : () => {
        console.log('completed');
        this.loading = false;
      }
    })
  }

  getCoverImageUrl(path : string): string {
    // console.log(path);
      return `http://localhost:8080/${path}`;
  }


  openProject(projectId){
    this.router.navigate([`project-view/${projectId}/new`]);
  }


  createBookmark(id : string){
    this.innerLoading = true;
    if(this.authService.loggedIn === false){
      this.toastr.error('Please login to save this campaign');
      return;
    }


    this.projectService.createBookmark(id)
    .subscribe({
      next : (res) => {
        console.log(res);
        this.innerLoading = false;
        this.toastr.success('Campaign saved successfully');
      },
      error : err => {
        this.innerLoading = false;
        console.log(err);
        this.toastr.error('Already Saved, check your saved campaigns');
      },
      complete : () => {
        this.innerLoading = false;
      }
    })
  }

  navigate(){
    this.router.navigate(['/discover/new/All']);
  }

}
