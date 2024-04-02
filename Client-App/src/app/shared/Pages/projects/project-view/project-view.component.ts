import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
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
  currentMediaIndex = 0;
  medias : any[] = [];
  modalRef?: BsModalRef;
  investmentAmount : number = 0;
  investmentFormData : any;
  innerloading: boolean;
  token: any;
  profileData : any;
  investors : any[] = [];
  currentEmail = this.authService.currentEmail;
  invested : boolean = false;
  reportCount : number;
  selectedStatus : string = '';
  socialLinks : any[] = [];


    constructor (private projectService : ProductService, private route : ActivatedRoute, public authService : AuthService, private router : Router, private modalService : BsModalService, private http : HttpClient, private toastr : ToastrService) {}

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
      if(asset){
        return asset.endsWith('.png') || asset.endsWith('.jpg') || asset.endsWith('.jpeg');
      }else{
        return false;
      }
    }

    isVideo(asset: string): boolean {
      // console.log(asset);
      if(asset){
        // console.log('here')
        // console.log(asset.endsWith('.mp4') || asset.endsWith('.webm') || asset.endsWith('.ogg'));
        return asset.endsWith('.mp4') || asset.endsWith('.webm') || asset.endsWith('.ogg');
      }else{
        return false;
      }
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
          this.reportCount = this.project['flagCount'];
          // console.log(this.reportCount);
          if(this.project['author']['email'] === this.currentEmail){
            this.canUpdate = true;
          }
          console.log(this.canUpdate, this.currentUser, this.project['author']);
          if(this.project['author'] !== this.currentUser){
            this.router.navigate(['/project-view', this.productId, 'new']);
          }
          // console.log(this.project['story']);
          // if(this.project['story']){
          //   this.projectStory = res['data'].story[0].description;
          // }
          if(res['data'].story.length > 0){
            this.projectStory = res['data'].story[0].description;
          }
          console.log(this.projectStory);
          // this.projectStory = res['data'].story[0].description;
          this.projectUpdates = res['data'].update;
          this.comments = res['data'].comments;
          this.rewards = res['data'].rewards;
          this.investors = res['data'].investors;
          if(this.investors.length > 0){
            this.totalInvestors = this.investors.length;
          }
          console.log(this.investors);
          this.invested = this.investors.some((elem) => elem['investorId']['_id'] === this.currentUser);
          console.log(this.invested);
          console.log(this.totalInvestors)
          console.log(this.profileData);
          console.log(res['data'].rewards)
          console.log(this.rewards);
          console.log(this.rewards.length);
          this.medias.push(this.project['coverImage']);
          // this.reportCount = res['data'].reportCount;
          console.log(this.medias);
          console.log(this.project['mediaAssets']);
          if(this.project['mediaAssets']){
            this.project['mediaAssets'].forEach((elem : any) => {
              this.medias.push(elem);
            })
          }
          console.log(this.medias);
          // this.totalInvestors = this.project['investors'].length;
          console.log(this.comments)
          console.log(this.projectStory)
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
        error : err => {
          console.log(err);
          this.loading = false;
        },
        complete : () => {

        }
      })
  }

  submitComment(){
    if(this.content === ''){
      this.toastr.error('Please fill the comment field');
      return;
    }
    const body = {
      content : this.content
    }
    this.projectService.addComment(this.productId, body)
    .subscribe({
      next : (res) => {
        console.log(res);
        this.getProjectDetails();
        this.content = '';
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
    if(this.updateTitle === '' || this.updateDescription === ''){
      this.toastr.error('Please fill all the fields');
      return;
    }
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

navigateInvest(){
  this.router.navigate(['/main/invest', this.productId]);
}

investInProj(){
  if(this.investmentAmount === 0){
    this.toastr.error('Please enter the amount to invest');
    return;
  }
  let formdatatest : InvestmentFormData;
  const body = {
    investmentAmount : this.investmentAmount
  }
  this.projectService.investInProject(this.productId, body)
  .subscribe({
    next : (res) => {
      console.log(res);
      formdatatest = res['formData'];
      console.log(formdatatest);

      this.esewaCall(formdatatest);
    },
    error : err => {
      console.log(err);
    },
    complete : () => {

    }})
}

esewaCall = (formData: any) => {
  console.log(formData);
  var path = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

  var form = document.createElement("form");
  form.setAttribute("method", "POST");
  form.setAttribute("action", path);

  for (var key in formData) {
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", key);
    hiddenField.setAttribute("value", formData[key]);
    form.appendChild(hiddenField);
  }

  document.body.appendChild(form);
  // console.log(form.);
  form.submit();
};

investAmount(amount : number){
  this.investmentAmount = amount;
}

createBookmark(){
  console.log(this.authService.loggedIn)
  if(this.authService.loggedIn === false){
    this.toastr.error('Please login to save this campaign');
    return;
  }
  this.projectService.createBookmark(this.productId)
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

reportProject(){
  this.innerloading = true;
  this.projectService.reportProject(this.productId)
  .subscribe({
    next : (res) => {
      console.log(res);
      this.toastr.success('Campaign reported successfully');
      this.innerloading = false;
    },
    error : err => {
      console.log(err);
      this.toastr.error(err.error.message);
      this.innerloading = false;
    },
    complete : () => {

    }
  })

}

getToken(){
  this.projectService.getMyToken()
  .subscribe({
    next : (res) => {
      console.log(res);
      this.token = res['data'].token;
    },
    error : err => {
      console.log(err);
    },
    complete : () => {

    }
  })
}

  deleteProject(){
    this.innerloading = true;
    this.projectService.deleteProject(this.productId)
    .subscribe({
      next : (res) => {
        console.log(res);
        this.toastr.success('Campaign deleted successfully');
        this.router.navigate(['/discover/new/All']);
        this.innerloading = false;
      },
      error : err => {
        console.log(err);
        this.toastr.error(err.error.message);
        this.innerloading = false;
      },
      complete : () => {

      }
    })
  }

  changeStatus(){
    console.log(this.selectedStatus);
    if(this.selectedStatus === ''){
      this.toastr.error('Please select a status');
      return;
    }

    const body = {
      status : this.selectedStatus
    }
    this.projectService.changeStatus(this.productId, body)
    .subscribe({
      next : (res) => {
        console.log(res);
        this.toastr.success('Status changed successfully');
        this.getProjectDetails();
      },
      error : err => {
        console.log(err);
        this.toastr.error(err.error.message);
      },
      complete : () => {

      }
    })

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

