import { Component } from '@angular/core';
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

  constructor(private projectService : ProductService){}

  nextBasics(){
    if(this.selectedCategory != '' || this.location != ''){
      this.preForm = false;
      this.basicsForm = true;
    }else{
      console.log('Please fill all the fields first.')
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

  submit(){
    const body = {
      title : this.title,
      description : this.subTitle,
      goalAmount : String(this.goalAmount),
      endDate : this.endDate
    }
    console.log(body);
    this.projectService.createProject(body)
      .subscribe({
        next : (res) => {
          console.log(res);
        },
        error : err => {
          console.log(err);
        },
        complete : () => {

        }
      })
  }
}
