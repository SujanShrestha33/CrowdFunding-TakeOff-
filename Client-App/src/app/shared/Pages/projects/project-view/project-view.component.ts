import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Projects } from 'src/app/Models/projects.model';
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

  constructor (private projectService : ProductService, private route : ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((res) => {
      console.log(res);
      this.productId = res['id'];
    })
    this.getProjectDetails();
    }

  getProjectDetails(){
    this.loading = true;
    this.projectService.getSpecificProject(this.productId)
      .subscribe({
        next : (res) => {
          console.log(res);
          this.project = res['data'].project;
          if(this.project['investors']){
            this.totalInvestors = this.project['investors'].length;
          }
          this.projectStory = res['data'].story[0].description;
          this.projectUpdates = res['data'].update;
          this.comments = res['data'].comments;
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

  test(event){
    console.log('tesasd')
    console.log(event);
  }

}
