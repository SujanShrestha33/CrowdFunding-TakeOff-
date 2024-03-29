import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Projects } from 'src/app/Models/projects.model';
import { AuthService } from 'src/app/auth/Services/auth.service';
import { ProductService } from 'src/app/shared/Services/product.service';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.scss']
})
export class ProjectViewComponent implements OnInit {
  loading : boolean = false;
  productId : string = '';
  project : Projects[] = [];
  totalInvestors : number = 0;
  remDays : number = 0;
  projectStory : string = '';
  projectUpdates : any[] = [];
  comments : any[] = [];
  updateForm : boolean = false;
  updateTitle : string = '';
  updateDescription : string = '';
  commentForm : boolean = false;
  content : string = '';
  rewards : any[] = [];
  currentUser = this.authService.userId;
  canUpdate : boolean = false;
  pageType : string = '';

  constructor (private projectService : ProductService, private route : ActivatedRoute, public authService : AuthService, private router : Router) {}

  ngOnInit(): void {
    this.route.params.subscribe((res) => {
      console.log(res);
      this.productId = res['id'];
      this.pageType = res['type'];
    })
    if(this.authService.loggedIn){
      this.authService.currentUser.subscribe({
        next : (res) => {
          console.log(res);
        },
        error : (err) => {
          console.log(err);
        },
        complete : () => {
          console.log('completed');
        }
      })
    }
    this.getProjectDetails();
    }

    toggleUpdate(){
      this.updateForm = !this.updateForm;
    }

  getProjectDetails(){
    this.loading = true;
    this.projectService.getSpecificProject(this.productId)
      .subscribe({
        next : (res) => {
          console.log(res);
          this.project = res['data'].project;
          if(this.project['author'] === this.currentUser){
            this.canUpdate = true;
          }
          console.log(this.canUpdate, this.currentUser, this.project['author']);
          if(this.project['author'] !== this.currentUser){
            this.router.navigate(['/project-view', this.productId, 'new']);
          }
          if(this.project['investors']){
            this.totalInvestors = this.project['investors'].length;
          }
          if(this.project['story']){
            this.projectStory = res['data'].story[0].description;
          }
          // this.projectStory = res['data'].story[0].description;
          this.projectUpdates = res['data'].update;
          this.comments = res['data'].comments;
          this.rewards = res['data'].rewards;
          console.log(res['data'].rewards)
          console.log(this.rewards);
          console.log(this.rewards.length);

          // this.totalInvestors = this.project['investors'].length;
          console.log(this.comments)
          console.log(this.projectStory)
          console.log(this.project);
          // this.remDays=this.projectService.getRemDays(this.project)
          const endDate = new Date(this.project['endDate']);
          const currentDate = new Date();
          const timeDiff = endDate.getTime() - currentDate.getTime(); // Difference in milliseconds
          this.remDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
          console.log(this.remDays);
          this.loading = false;
        },
        error : err => {
          console.log(err);
          this.loading = false;
        },
        complete : () => {

        }
      })
  }

  submitComment(){
    const body = {
      content : this.content
    }
    this.projectService.addComment(this.productId, body)
    .subscribe({
      next : (res) => {
        console.log(res);
        this.getProjectDetails();
        this.commentForm = false;
      },
      error : err => {
        console.log(err);
      },
      complete : () => {

      }})

}

  getCoverImageUrl(path : string): string {
    // console.log(path);
      return `http://localhost:8080/${path}`;
      // console.log()
  }

  toggleComment(){
    this.commentForm = !this.commentForm;
  }

  submitUpdate(){
    const body = {
      title : this.updateTitle,
      description : this.updateDescription
    }
    this.projectService.addUpdate(this.productId, body)
    .subscribe({
      next : (res) => {
        console.log(res);
        this.getProjectDetails();
        this.toggleUpdate();
      },
      error : err => {
        console.log(err);
      },
      complete : () => {

      }})

}


}
