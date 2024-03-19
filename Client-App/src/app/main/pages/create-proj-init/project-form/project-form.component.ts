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
    rewardDesc : ''
  };

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
  }

  onImageDrop(event: any) {
    event.preventDefault();
    this.isImageDragging = false;
    const files: FileList = event.dataTransfer.files;
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
    if (files.length > 0) {
      const file = files[0];
      this.imageFilename = file.name;
      console.log('Image file selected:', this.imageFilename);
    }
  }

  onVideoSelected(event: any) {
    const files: FileList = event.target.files;
    this.handleVideoFiles(files);
  }

  onVideoDrop(event: any) {
    event.preventDefault();
    this.isVideoDragging = false;
    const files: FileList = event.dataTransfer.files;
    this.handleVideoFiles(files);
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

  submit(){
    const body = {
      title : this.title,
      subtitle:this.subTitle,
      description : this.subTitle,
      goalAmount : String(this.goalAmount),
      endDate : this.endDate,
      location: this.location,
      category : this.selectedCategory,
      minimumInvestement : this.minimumInvestment,
      rewards : []
    }
    console.log(body);
    this.projectService.createProject(body)
      .subscribe({
        next : (res) => {
          console.log(res);
          this.resProj = res['data'];
          this.basicsForm = false;
          this.dateForm = false;
          this.preForm = false;
          this.imageForm = false;
          this.storyForm = true;
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
          this.router.navigate(['/reward-form', this.resProj['_id']]);
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

submitReward(){
  ;
}

  navigateProject(){

  }
}
