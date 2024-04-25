import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { Projects } from 'src/app/Models/projects.model';
import { ProductService } from '../../Services/product.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/Services/auth.service';
import { Chart, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit{
  public chart: any;
  chartData: any =[];
  artData: number[];
  techData: number[];
  othersData: number[];
  fashionData: number[];
  miscData: number[];
  gamesData: number[];
  booksData: number[];
  totalSuccess: number;
  totalFailed: number;
  totalOngoing: number;
  artProjects: Projects[] = [];
  techProjects: Projects[] = [];
  othersProjects: Projects[] = [];
  fashionProjects: Projects[] = [];
  miscProjects: Projects[] = [];
  gamesProjects: Projects[] = [];
  booksProjects: Projects[] = [];


  constructor (
    private projectService : ProductService, private router : Router, private toastr : ToastrService, public authService : AuthService
  ) {}

  ngOnInit(): void {
    // this.getTopProjects();
    // this.showChartData();
    if(this.authService.userRole === 'admin'){
      this.getProjects();
    }else{
      this.getTopProjects();
      this.getProjectsForUser();
    }

  }



  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createBarChart();
      // this.createLineChart();
      this.createLineChart();
      this.createDoughnutChart();
    }, 1000)
  }


  getProjects(){
    this.loading = true;

    this.projectService.getProductsList().subscribe({
      next : (res) => {
        console.log(res);
        this.projects = res['data'] as Projects[];
        const artProjs = this.projects.filter((elem) => elem['category'] === 'Art');
        const techProjs = this.projects.filter((elem) => elem['category'] === 'Technology');
        const othersProjs = this.projects.filter((elem) => elem['category'] === 'Others');
        const fashionProjs = this.projects.filter((elem) => elem['category'] === 'Fashion');
        const miscProjs = this.projects.filter((elem) => elem['category'] === 'Music');
        const gamesProjs = this.projects.filter((elem) => elem['category'] === 'Games');
        const booksProjs = this.projects.filter((elem) => elem['category'] === 'Books');
        const artProjsSuccess = artProjs.filter((elem) => elem['status'] === 'completed');
        const artProjsFailed = artProjs.filter((elem) => elem['status'] === 'failed');
        const artProjsOngoing = artProjs.filter((elem) => elem['status'] === 'active');
        const techProjsSuccess = techProjs.filter((elem) => elem['status'] === 'completed');
        const techProjsFailed = techProjs.filter((elem) => elem['status'] === 'failed');
        const techProjsOngoing = techProjs.filter((elem) => elem['status'] === 'active');
        const othersProjsSuccess = othersProjs.filter((elem) => elem['status'] === 'completed');
        const othersProjsFailed = othersProjs.filter((elem) => elem['status'] === 'failed');
        const othersProjsOngoing = othersProjs.filter((elem) => elem['status'] === 'active');
        const fashionProjsSuccess = fashionProjs.filter((elem) => elem['status'] === 'completed');
        const fashionProjsFailed = fashionProjs.filter((elem) => elem['status'] === 'failed');
        const fashionProjsOngoing = fashionProjs.filter((elem) => elem['status'] === 'active');
        const miscProjsSuccess = miscProjs.filter((elem) => elem['status'] === 'completed');
        const miscProjsFailed = miscProjs.filter((elem) => elem['status'] === 'failed');
        const miscProjsOngoing = miscProjs.filter((elem) => elem['status'] === 'active');
        const gamesProjsSuccess = gamesProjs.filter((elem) => elem['status'] === 'completed');
        const gamesProjsFailed = gamesProjs.filter((elem) => elem['status'] === 'failed');
        const gamesProjsOngoing = gamesProjs.filter((elem) => elem['status'] === 'active');
        const booksProjsSuccess = booksProjs.filter((elem) => elem['status'] === 'completed');
        const booksProjsFailed = booksProjs.filter((elem) => elem['status'] === 'failed');
        const booksProjsOngoing = booksProjs.filter((elem) => elem['status'] === 'active');
        const totalSuccess = artProjsSuccess.length + techProjsSuccess.length + othersProjsSuccess.length + fashionProjsSuccess.length + miscProjsSuccess.length + gamesProjsSuccess.length + booksProjsSuccess.length;
        const totalFailed = artProjsFailed.length + techProjsFailed.length + othersProjsFailed.length + fashionProjsFailed.length + miscProjsFailed.length + gamesProjsFailed.length + booksProjsFailed.length;
        const totalOngoing = artProjsOngoing.length + techProjsOngoing.length + othersProjsOngoing.length + fashionProjsOngoing.length + miscProjsOngoing.length + gamesProjsOngoing.length + booksProjsOngoing.length;


        console.log(artProjsSuccess);
        console.log(artProjsFailed);
        console.log(artProjsOngoing);
        this.chartData = [
          artProjs.length,
          techProjs.length,
          othersProjs.length,
          fashionProjs.length,
          miscProjs.length,
          gamesProjs.length,
          booksProjs.length
        ]
        this.artData = [
          artProjsSuccess.length,
          artProjsFailed.length,
          artProjsOngoing.length
        ]
        this.techData = [
          techProjsSuccess.length,
          techProjsFailed.length,
          techProjsOngoing.length
        ]
        this.othersData = [
          othersProjsSuccess.length,
          othersProjsFailed.length,
          othersProjsOngoing.length
        ]
        this.fashionData = [
          fashionProjsSuccess.length,
          fashionProjsFailed.length,
          fashionProjsOngoing.length
        ]
        this.miscData = [
          miscProjsSuccess.length,
          miscProjsFailed.length,
          miscProjsOngoing.length
        ]
        this.gamesData = [
          gamesProjsSuccess.length,
          gamesProjsFailed.length,
          gamesProjsOngoing.length
        ]
        this.booksData = [
          booksProjsSuccess.length,
          booksProjsFailed.length,
          booksProjsOngoing.length
        ]
        this.totalSuccess = totalSuccess;
        this.totalFailed = totalFailed;
        this.totalOngoing = totalOngoing;
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

  createBarChart() {
    this.chart = new Chart("BarChart", {
      type: 'bar', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ['Success', 'Failed', 'On-Going'],
        datasets: [
          {
            label: "Arts",
            data: this.artData, // values on Y-Axis
            backgroundColor: 'red'
          },
          {
            label: "Technology",
            data: this.techData,
            backgroundColor: 'blue'
          },
          {
            label: "others",
            data: this.othersData,
            backgroundColor: 'yellow'
          },
          {
            label: "Fashion",
            data: this.fashionData,
            backgroundColor: 'green'
          },
          {
            label: "Music",
            data: this.miscData,
            backgroundColor: 'purple'
          },
          {
            label: "Games",
            data: this.gamesData,
            backgroundColor: 'orange'
          },
          {
            label: "Books",
            data: this.booksData,
            backgroundColor: 'brown'
          }
        ]
      },
      options: {
        aspectRatio: 1.1
      }
    });
  }

  createDoughnutChart() {
    console.log(this.chartData);
    var options = {
      cutoutPercentage: 40,
      radius: '60%', // Set the radius of the doughnut chart
    };
    this.chart = new Chart("DoughnutChart", {
      type: 'doughnut',

      data: {
        labels: [
          'Art',
          'Technology',
          'others',
          'Fashion',
          'Music',
          'Games',
          'Books'
        ],
        datasets: [{
          label: '',
          data: this.chartData,
          backgroundColor: [
            'red',
            'blue',
            'yellow',
            'green',
            'purple',
            'orange',
            'brown'
          ],
          hoverOffset: 4
        }]
      },
      options: options
    });
  }

  createLineChart() {
    this.chart = new Chart("LineChart", {
      type: 'line', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ['Successful', 'Failed', 'On-Going'],
        datasets: [
          {
            label: "Total Projects Status",
            data: [this.totalSuccess, this.totalFailed, this.totalOngoing], // values on Y-Axis
            backgroundColor: 'blue'
          },
        ]
      },
      options: {
        aspectRatio: 2.5
      }

    });
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

  getProjectsForUser(){
    this.loading = true;

    this.projectService.getProductsList().subscribe({
      next : (res) => {
        console.log(res);
        let projects = res['data'] as Projects[];
        projects = res['data'] as Projects[];
        const artProjs = projects.filter((elem) => elem['category'] === 'Art');
        const techProjs = projects.filter((elem) => elem['category'] === 'Technology');
        const othersProjs = projects.filter((elem) => elem['category'] === 'Others');
        const fashionProjs = projects.filter((elem) => elem['category'] === 'Fashion');
        const miscProjs = projects.filter((elem) => elem['category'] === 'Music');
        const gamesProjs = projects.filter((elem) => elem['category'] === 'Games');
        const booksProjs = projects.filter((elem) => elem['category'] === 'Books');

        this.artProjects = artProjs;
        this.techProjects = techProjs;
        this.othersProjects = othersProjs;
        this.fashionProjects = fashionProjs;
        this.miscProjects = miscProjs;
        this.gamesProjects = gamesProjs;
        this.booksProjects = booksProjs;
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
}
