import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/shared/Services/product.service';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss']
})
export class ProjectFormComponent {
  selectedCategory : string = '';
  preForm : boolean = true;
  basicsForm : boolean = false;
  imageForm : boolean = false;
  dateForm : boolean = false;
  storyForm : boolean = false;
  location : string = '';
  title : string = '';
  subTitle : string = '';
  story : string = '';
  endDate : string = '';
  goalAmount : number = 0;
  isImageDragging = false;
  isVideoDragging = false;
  imageFilename: string | null = null;
  videoFilename: string | null = null;
  description : string = '';
  resProj: any;
  minimumInvestment : number = 0;
  update: any;
  comment: any;
  rewardForm : boolean = false;
  mainRewardForm : boolean = false;
  rewardBody = {
    rewardTitle : '',
    rewardDesc : '',
    investmentAmount : 0
  };
  coverImage : File | null = null;
  newProjectid : string = '';
  newProjRewards : any;
  files : FileList;
  video : FileList;
  mediaForm : boolean = false;

  constructor(private projectService : ProductService, private router : Router, private toastr : ToastrService){}

  nextBasics(){
    if(this.selectedCategory != '' || this.location != ''){
      this.preForm = false;
      this.basicsForm = true;
    }else{
      console.log('Please fill all the fields first.');
      this.toastr.warning('Please fill all the fields first.')
    }
  }

  nextImage(){
    if(this.title != '' || this.subTitle != '' || this.story != ''){
      this.preForm = false;
      this.basicsForm = false;
      this.imageForm = true;
    }else{
      console.log('Please fill all the fields first.')
    }
  }

  nextDate(){
    this.preForm = false;
    this.basicsForm = false;
    this.imageForm = false;
    this.dateForm = true;
  }

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
      this.coverImage = file;
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

  toggleForm(){
    this.rewardForm = !this.rewardForm;
  }

  addRewards(){
    const body = {
      rewardTitle : this.rewardBody.rewardTitle,
      rewardDescription : this.rewardBody.rewardDesc,
      rewardAmount : this.rewardBody.investmentAmount

    }
    this.projectService.addRewards(this.newProjectid, body)
    .subscribe({
      next : (res) => {
        console.log(res);
        this.rewardForm = false;
        this.getProjectDetails();
        this.rewardBody = {
          rewardTitle : '',
          rewardDesc : '',
          investmentAmount : 0
        };
        this.toastr.success('Reward added successfully');
        // this.router.navigate(['/project', this.newProjectid]);
      },
      error : err => {
        console.log(err);
        this.toastr.error(err.error.message)
      },
      complete : () => {

      }
    })
  }

  backToStory(){
    this.storyForm = true;
    this.mainRewardForm = false;
  }

  skipStory(){
    this.storyForm = false;
    this.mainRewardForm = true;
  }

  skipReward(){
    this.mainRewardForm = false;
    this.mediaForm = true;
  }

    submit() {
    if (!this.coverImage) {
      this.toastr.warning('Please select an image');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.coverImage);

    // Append each field of the body individually
    formData.append('title', this.title);
    formData.append('subtitle', this.subTitle);
    formData.append('description', this.description);
    formData.append('goalAmount', this.goalAmount.toString());
    formData.append('endDate', this.endDate);
    formData.append('location', this.location);
    formData.append('category', this.selectedCategory);
    formData.append('minimumInvestment', this.minimumInvestment.toString());

    console.log(formData); // Check formData before sending

    this.projectService.createProject(formData)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.resProj = res['data'];
          this.basicsForm = false;
          this.dateForm = false;
          this.preForm = false;
          this.imageForm = false;
          this.storyForm = true;
          this.newProjectid = this.resProj['_id'];
          console.log(this.newProjectid);
          this.toastr.success('Project created successfully');
        },
        error: err => {
          console.log(err);
        },
        complete: () => {}
      });
  }

  submitMedia(){
    console.log('submit media');
    console.log(this.files);
    const formData = new FormData();
    if(this.files.length == 0){
      this.toastr.warning('Please Select Media Files!');
      return;
    }
    if(this.files.length == 1){
      formData.append('imageFileOne', this.files[0]);
    }
    if(this.files.length == 2){
      formData.append('imageFileOne', this.files[0]);
      formData.append('imageFileTwo', this.files[1]);
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

    if(this.video.length == 1){
      formData.append('videoFile', this.video[0]);
    }

    if(this.video.length > 1){
      this.toastr.warning('Only one video is allowed for a project!');
      return;
    }
    console.log(formData);

    if(this.files.length == 0 && this.video.length == 0){
    this.router.navigate(['/project-view', this.newProjectid, 'mycampaign']);
    }else{


      this.projectService.addMedia(formData, this.newProjectid)
      .subscribe({
        next : (res) => {
          console.log(res);
          this.toastr.success('Media added successfully');
          this.router.navigate(['/project-view', this.newProjectid, 'mycampaign']);

        }, error : err => {
          console.log(err);
        },
        complete : () =>{

        }
      })
    }


  }

  getProjectDetails(){
    this.projectService.getSpecificProject(this.newProjectid)
      .subscribe({
        next : (res) => {
          console.log(res);
          // this.resProj = res['data'].project;
          this.newProjRewards = res['data'].rewards;
          console.log(this.newProjRewards);
        },
        error : err => {
          console.log(err);
        },
        complete : () => {

        }
      })
  }

  submitStory(){
    const body = {
      description : this.story
    }
    this.projectService.addStory(this.resProj._id, body)
      .subscribe({
        next : (res) => {
          console.log(res);
          this.toastr.success('Story added successfully');
          // this.router.navigate(['/reward-form', this.resProj['_id']]);
          this.storyForm = false;
          this.mainRewardForm = true;
        },
        error : err => {
          console.log(err);
        },
        complete : () => {

        }
      })

  }

  submitUpdate(){
        const body = {
          content : this.update
        }
        this.projectService.addUpdate(this.resProj._id, body)
        .subscribe({
          next : (res) => {
            console.log(res);
          },
          error : err => {
            console.log(err);
          },
          complete : () => {

          }})

    }


  submitComment(){
    const body = {
      content : this.comment
    }
    this.projectService.addComment(this.resProj._id, body)
    .subscribe({
      next : (res) => {
        console.log(res);
      },
      error : err => {
        console.log(err);
      },
      complete : () => {

      }})

}


  navigateProject(){

  }

  // navigateOut(){

  // }

}
