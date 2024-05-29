import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Projects } from 'src/app/Models/projects.model';
import { AuthService } from 'src/app/auth/Services/auth.service';
import { ProductService } from 'src/app/shared/Services/product.service';
import { Chart, ChartOptions, ChartType } from 'chart.js';


@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.scss'],
})
export class ProjectViewComponent implements OnInit, AfterViewInit {
  loading: boolean = false;
  public chart: any;
  chartData: any =[];
  productId: string = '';
  project: Projects[] = [];
  totalInvestors: number = 0;
  remDays: number = 0;
  projectStory: string = '';
  projectUpdates: any[] = [];
  comments: any[] = [];
  updateForm: boolean = false;
  updateTitle: string = '';
  updateDescription: string = '';
  commentForm: boolean = false;
  content: string = '';
  rewards: any[] = [];
  currentUser = this.authService.userId;
  canUpdate: boolean = false;
  pageType: string = '';
  currentMediaIndex = 0;
  medias: any[] = [];
  modalRef?: BsModalRef;
  investmentAmount: number = 0;
  investmentFormData: any;
  innerloading: boolean;
  token: any;
  profileData: any;
  investors: any[] = [];
  currentEmail = this.authService.currentEmail;
  invested: boolean = false;
  reportCount: number;
  selectedStatus: string = '';
  socialLinks: any[] = [];
  storyForm = false;
  story = '';
  mediaForm = false;
  isImageDragging = false;
  isVideoDragging = false;
  imageFilename: string | null = null;
  videoFilename: string | null = null;
  files : FileList;
  video : FileList;

  constructor(
    private projectService: ProductService,
    private route: ActivatedRoute,
    public authService: AuthService,
    private router: Router,
    private modalService: BsModalService,
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((res) => {
      console.log(res);
      this.productId = res['id'];
      this.pageType = res['type'];
    });
    if (this.authService.loggedIn) {
      this.authService.currentUser.subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          console.log('completed');
        },
      });
    }
    this.getProjectDetails();
    this.getToken();
  }


  ngAfterViewInit(): void {

  }

  runDoughnut(){
    setTimeout(() => {
      this.createBarChart();
      this.createLineChart();
      // this.createLineChart();
      this.createDoughnutChart();

    }, 1000)
  }

  onTabChange(event: any): void {
    console.log(event);
    if (event === 8) { // Assuming the index of the Campaign Analytics tab is 1
      this.runDoughnut();
    }else{
      // this.chart.destroy();
      const canvas = document.getElementById('DoughnutChart');
    if (canvas) {
      // Remove the canvas element
      canvas.parentNode.removeChild(canvas);
    }
    const canvas2 = document.getElementById('LineChart');
    if (canvas2) {
      // Remove the canvas element
      canvas2.parentNode.removeChild(canvas2);
    }
    const canvas3 = document.getElementById('BarChart');
    if (canvas3) {
      // Remove the canvas element
      canvas3.parentNode.removeChild(canvas3);
    }
  }
}


  createBarChart(): void {
    const labels = this.investors.map(investor => investor.investorId['username']);
    const investments = this.investors.map(investor => investor.investedAmount);
    const doughnutChartContainer = document.getElementById('bar');
   if (!doughnutChartContainer) {
     console.error('BarChartContainer is undefined');
     return;
   }

   // Create canvas element
   const canvas = document.createElement('canvas');
   canvas.id = 'BarChart';

   // Append canvas element to container
   doughnutChartContainer.appendChild(canvas);

   const ctx = canvas.getContext('2d');

   if (!ctx) {
     console.error('Failed to acquire 2D context');
     return;
   }

   this.chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Investments',
        data: investments,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Investment Amount'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Investor Name'
          }
        }
      }
    }
  });

 }



  createDoughnutChart(): void {
     const doughnutChartContainer = document.getElementById('doughnutChartContainer');
    if (!doughnutChartContainer) {
      console.error('doughnutChartContainer is undefined');
      return;
    }

    this.chartData = [this.project['goalAmount'], this.project['currentAmount']];
    console.log(this.chartData);

    const options = {
      cutoutPercentage: 40,
      radius: '60%', // Set the radius of the doughnut chart
    };

    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.id = 'DoughnutChart';

    // Append canvas element to container
    doughnutChartContainer.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Failed to acquire 2D context');
      return;
    }

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Goal Amount', 'Raised Amount'],
        datasets: [{
          label: '',
          data: this.chartData,
          backgroundColor: ['red', 'green'],
          hoverOffset: 4
        }]
      },
      options: options
    });

  }



  createLineChart() {
    let investmentRawData = this.investors.map(investor => ({
      date: new Date(investor.createdAt),
      investedAmount: investor.investedAmount,
      investorName: investor.investorId['username']
    }));


    const doughnutChartContainer = document.getElementById('line');
  if (!doughnutChartContainer) {
    console.error('doughnutChartContainer is undefined');
    return;
  }

  const startDate = new Date(this.project['startDate']);
  const endDate = new Date(this.project['endDate']);

  // Initialize investment data as an empty object
  let investmentData = {};

  // Loop through the investment data to calculate investments made on each date
  investmentRawData.forEach(investment => {
    const date = new Date(investment.date);
    // Check if the investment date is within the project start and end date range
    if (date >= startDate && date <= endDate) {
      // Convert date to string in YYYY-MM-DD format
      const dateString = date.toISOString().split('T')[0];
      // Add or update the investment amount for the corresponding date
      investmentData[dateString] = (investmentData[dateString] || 0) + investment.investedAmount;
    }
  });
  console.log(investmentData);

  // Extract labels (dates) and data (investments) from the investmentData object
  const labels = Object.keys(investmentData);
  const data = Object.values(investmentData);


  console.log(labels);
  console.log(data);

  const canvas = document.createElement('canvas');
  canvas.id = 'LineChart';

  // Append canvas element to container
  doughnutChartContainer.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    console.error('Failed to acquire 2D context');
    return;
  }

  // Create the line chart using Chart.js
  this.chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: "Investments",
          data: data,
          borderColor: 'blue',
          fill: false
        }
      ]
    },
    options: {
      aspectRatio: 2.5
    }
  });
}



  // renderLineChart(): void {
  //   const labels = this.data.map(entry => entry.date.toLocaleDateString());
  //   const investments = this.data.map(entry => entry.totalInvestments);

  //   const ctx = document.getElementById('investmentLineChart');

  //   if (ctx) {
  //     this.chart = new Chart(ctx, {
  //       type: 'line',
  //       data: {
  //         labels: labels,
  //         datasets: [{
  //           label: 'Investments Over Time',
  //           data: investments,
  //           fill: false,
  //           borderColor: 'rgb(75, 192, 192)',
  //           tension: 0.1
  //         }]
  //       },
  //       options: {
  //         scales: {
  //           x: {
  //             type: 'time',
  //             time: {
  //               unit: 'day' // Adjust time unit as needed (e.g., 'week', 'month')
  //             },
  //             title: {
  //               display: true,
  //               text: 'Date'
  //             }
  //           },
  //           y: {
  //             title: {
  //               display: true,
  //               text: 'Total Investments'
  //             }
  //           }
  //         }
  //       }
  //     });
  //   }
  // }
  onImageSelected(event: any) {
    const files: FileList = event.target.files;
    this.handleImageFiles(files);
    this.files = files;
  }

  onImageDrop(event: any) {
    event.preventDefault();
    this.isImageDragging = false;
    const files: FileList = event.dataTransfer.files;
    this.files = files;
    this.handleImageFiles(files);
  }

  onImageDragOver(event: any) {
    event.preventDefault();
    this.isImageDragging = true;
  }

  onImageDragLeave(event: any) {
    event.preventDefault();
    this.isImageDragging = false;
  }

  handleImageFiles(files: FileList) {
    console.log(files);
    if (files.length > 0) {
      const file = files[0];
      // this.coverImage = file;
      this.imageFilename = file.name;
      console.log('Image file selected:', this.imageFilename);
    }
  }

  onVideoSelected(event: any) {
    const files: FileList = event.target.files;
    this.handleVideoFiles(files);
    this.video = files;
  }

  onVideoDrop(event: any) {
    event.preventDefault();
    this.isVideoDragging = false;
    const files: FileList = event.dataTransfer.files;
    this.handleVideoFiles(files);
    this.video = files;
  }

  onVideoDragOver(event: any) {
    event.preventDefault();
    this.isVideoDragging = true;
  }

  onVideoDragLeave(event: any) {
    event.preventDefault();
    this.isVideoDragging = false;
  }

  handleVideoFiles(files: FileList) {
    if (files.length > 0) {
      const file = files[0];
      this.videoFilename = file.name;
      console.log('Video file selected:', this.videoFilename);
    }
  }

  submitMedia(){
    console.log('submit media');
    if(this.files == null || this.files == undefined){
      this.toastr.warning('Please Select Media Files Fro All Fields!');
      return;
    }
    console.log(this.files);

    const formData = new FormData();
    if(this.files != null){

      if(this.files.length == 0 || this.files.length < 3){
        this.toastr.warning('Please Select Atleast 3 Image Files!');
        return;
      }


      if(this.files.length == 3){
        formData.append('imageFileOne', this.files[0]);
        formData.append('imageFileTwo', this.files[1]);
        formData.append('imageFileThree', this.files[2]);
      }

      if(this.files.length > 3){
        this.toastr.warning('Only three images except cover image is allowed for an projecrt!');
        return;
      }
      if(this.video == null || this.video == undefined){
        this.toastr.warning('Please Select Video File!');
        return;
      }
      if(this.video.length == 1){
        formData.append('videoFile', this.video[0]);
      }

      if(this.video.length > 1){
        this.toastr.warning('Only one video is allowed for a project!');
        return;
      }
      console.log(formData);

      if(this.files.length == 0 && this.video.length == 0){
        this.toastr.warning('Please Select Media Files!');
        return;
      }else{


        this.projectService.updateMedia(formData, this.productId)
        .subscribe({
          next : (res) => {
            console.log(res);
            this.toastr.success('Media added successfully');
            this.getProjectDetails();
            this.toggleMedia();
            // this.router.navigate(['/project-view', this.productId, 'mycampaign']);

          }, error : err => {
            console.log(err);
            this.toggleMedia();
            this.toastr.error('Media could not be added');
          },
          complete : () =>{

          }
        })
      }

    }

  }

  toggleStory(){
    this.storyForm = !this.storyForm;
  }

  toggleMedia(){
    this.mediaForm = !this.mediaForm;
  }

  submitStory(){
    if(this.story === ''){
      this.toastr.error('Please fill the story field');
      return;
    }
    const body = {
      description: this.story
    }
    this.projectService.updateStory(this.productId, body).subscribe({
      next: (res) => {
        console.log(res);
        this.getProjectDetails();
        this.toastr.success('Story Updated Successfully');
        this.toggleStory();
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {}
    })
  }

  openModal(template: TemplateRef<void>) {
    this.modalRef = this.modalService.show(template);
  }

  prevMedia() {
    if (this.currentMediaIndex > 0) {
      this.currentMediaIndex--;
    } else {
      this.currentMediaIndex = this.medias.length - 1;
    }
  }

  nextMedia() {
    console.log(this.medias);
    if (this.currentMediaIndex < this.medias.length - 1) {
      this.currentMediaIndex++;
    } else {
      this.currentMediaIndex = 0;
    }
  }

  isImage(asset: string): boolean {
    if (asset) {
      return (
        asset.endsWith('.png') ||
        asset.endsWith('.jpg') ||
        asset.endsWith('.jpeg')
      );
    } else {
      return false;
    }
  }

  isVideo(asset: string): boolean {
    // console.log(asset);
    if (asset) {
      // console.log('here')
      // console.log(asset.endsWith('.mp4') || asset.endsWith('.webm') || asset.endsWith('.ogg'));
      return (
        asset.endsWith('.mp4') ||
        asset.endsWith('.webm') ||
        asset.endsWith('.ogg')
      );
    } else {
      return false;
    }
  }

  toggleUpdate() {
    this.updateForm = !this.updateForm;
  }

  getProjectDetails() {
    this.loading = true;
    this.projectService.getSpecificProject(this.productId).subscribe({
      next: (res) => {
        console.log(res);
        this.project = res['data'].project;
        this.reportCount = this.project['flagCount'];
        // console.log(this.reportCount);
        if (this.project['author']['email'] === this.currentEmail) {
          this.canUpdate = true;
        }
        console.log(this.canUpdate, this.currentUser, this.project['author']);
        // if(this.project['author'] !== this.currentUser){
        //   this.router.navigate(['/project-view', this.productId, 'new']);
        // }
        // console.log(this.project['story']);
        // if(this.project['story']){
        //   this.projectStory = res['data'].story[0].description;
        // }
        if (res['data'].story.length > 0) {
          this.projectStory = res['data'].story[0].description;
        }
        console.log(this.projectStory);
        // this.projectStory = res['data'].story[0].description;
        this.projectUpdates = res['data'].update;
        this.comments = res['data'].comments;
        this.rewards = res['data'].rewards;
        this.investors = res['data'].investors;
        if (this.investors.length > 0) {
          this.totalInvestors = this.investors.length;
        }
        console.log(this.investors);
        this.invested = this.investors.some(
          (elem) => elem['investorId']['_id'] === this.currentUser
        );
        console.log(this.invested);
        console.log(this.totalInvestors);
        console.log(this.profileData);
        console.log(res['data'].rewards);
        console.log(this.rewards);
        console.log(this.rewards.length);
        this.medias.push(this.project['coverImage']);
        // this.reportCount = res['data'].reportCount;
        console.log(this.medias);
        console.log(this.comments);
        console.log(this.project['mediaAssets']);
        if (this.project['mediaAssets']) {
          this.project['mediaAssets'].forEach((elem: any) => {
            this.medias.push(elem);
          });
        }
        console.log(this.medias);
        // this.totalInvestors = this.project['investors'].length;
        console.log(this.comments);
        console.log(this.projectStory);
        console.log(this.project);
        this.socialLinks = this.project['socialLinks'];
        console.log(this.socialLinks);
        this.profileData = this.project['author'];
        console.log(this.profileData);
        // this.remDays=this.projectService.getRemDays(this.project)
        const endDate = new Date(this.project['endDate']);
        const currentDate = new Date();
        const timeDiff = endDate.getTime() - currentDate.getTime(); // Difference in milliseconds
        this.remDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        console.log(this.remDays);
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
      complete: () => {},
    });
  }

  removeBookmark() {
    this.projectService.removeBookmark(this.productId).subscribe({
      next: (res) => {
        console.log(res);
        this.toastr.success(
          'Campaign removed from saved campaigns successfully'
        );
        this.router.navigate(['/project-view', this.productId, 'new']);
      },
      error: (err) => {
        console.log(err);
        this.toastr.error('Campaign not saved');
      },
      complete: () => {},
    });
  }

  submitComment() {
    if (this.content === '') {
      this.toastr.error('Please fill the comment field');
      return;
    }
    const body = {
      content: this.content,
    };
    this.projectService.addComment(this.productId, body).subscribe({
      next: (res) => {
        console.log(res);
        this.getProjectDetails();
        this.toastr.success('Comment added successfully');
        this.content = '';
        this.commentForm = false;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {},
    });
  }

  getCoverImageUrl(path: string): string {
    // console.log(path);
    return `http://localhost:8080/${path}`;
    // console.log()
  }

  toggleComment() {
    this.commentForm = !this.commentForm;
  }

  submitUpdate() {
    if (this.updateTitle === '' || this.updateDescription === '') {
      this.toastr.error('Please fill all the fields');
      return;
    }
    const body = {
      title: this.updateTitle,
      description: this.updateDescription,
    };
    this.projectService.addUpdate(this.productId, body).subscribe({
      next: (res) => {
        console.log(res);
        this.toastr.success('Update added successfully');
        this.getProjectDetails();
        this.toggleUpdate();
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {},
    });
  }

  navigateInvest() {
    this.router.navigate(['/main/invest', this.productId]);
  }

  investInProj() {
    if (this.investmentAmount === 0) {
      this.toastr.error('Please enter the amount to invest');
      return;
    }
    let formdatatest: InvestmentFormData;
    const body = {
      investmentAmount: this.investmentAmount,
    };
    this.projectService.investInProject(this.productId, body).subscribe({
      next: (res) => {
        console.log(res);
        formdatatest = res['formData'];
        console.log(formdatatest);

        this.esewaCall(formdatatest);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {},
    });
  }

  esewaCall = (formData: any) => {
    console.log(formData);
    var path = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';

    var form = document.createElement('form');
    form.setAttribute('method', 'POST');
    form.setAttribute('action', path);

    for (var key in formData) {
      var hiddenField = document.createElement('input');
      hiddenField.setAttribute('type', 'hidden');
      hiddenField.setAttribute('name', key);
      hiddenField.setAttribute('value', formData[key]);
      form.appendChild(hiddenField);
    }

    document.body.appendChild(form);
    // console.log(form.);
    form.submit();
  };

  investAmount(amount: number) {
    this.investmentAmount = amount;
  }

  createBookmark() {
    console.log(this.authService.loggedIn);
    if (this.authService.loggedIn === false) {
      this.toastr.error('Please login to save this campaign');
      return;
    }
    this.projectService.createBookmark(this.productId).subscribe({
      next: (res) => {
        console.log(res);
        this.toastr.success('Campaign saved successfully');
            this.router.navigate(['/project-view', this.productId, 'saved']);

      },
      error: (err) => {
        console.log(err);
        this.toastr.error('Already Saved, check your saved campaigns');
      },
      complete: () => {},
    });
  }

  reportProject() {
    this.innerloading = true;
    this.projectService.reportProject(this.productId).subscribe({
      next: (res) => {
        console.log(res);
        this.toastr.success('Campaign reported successfully');
        this.innerloading = false;
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.message);
        this.innerloading = false;
      },
      complete: () => {},
    });
  }

  getToken() {
    this.projectService.getMyToken().subscribe({
      next: (res) => {
        console.log(res);
        this.token = res['data'].token;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {},
    });
  }

  deleteProject() {
    this.innerloading = true;
    this.projectService.deleteProject(this.productId).subscribe({
      next: (res) => {
        console.log(res);
        this.toastr.success('Campaign deleted successfully');
        this.router.navigate(['/discover/new/All']);
        this.innerloading = false;
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.message);
        this.innerloading = false;
      },
      complete: () => {},
    });
  }

  changeStatus() {
    console.log(this.selectedStatus);
    if (this.selectedStatus === '') {
      this.toastr.error('Please select a status');
      return;
    }

    const body = {
      status: this.selectedStatus,
    };
    this.projectService.changeStatus(this.productId, body).subscribe({
      next: (res) => {
        console.log(res);
        this.toastr.success('Status changed successfully');
        this.getProjectDetails();
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.message);
      },
      complete: () => {},
    });
  }
}
interface InvestmentFormData {
  amount: number;
  failure_url: string;
  product_delivery_charge: string;
  product_service_charge: string;
  product_code: string;
  signature: string;
  signed_field_names: string;
  success_url: string;
  tax_amount: string;
  total_amount: number;
  transaction_uuid: string;
  // Add any additional properties if present in the response
}
