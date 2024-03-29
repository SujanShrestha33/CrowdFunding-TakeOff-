import { Component, OnInit, TemplateRef } from '@angular/core';
import { ProfileService } from '../../Services/profile.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/Services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  // isEditing : boolean = false;
  loading : boolean = false;
  profileData : any = {};
  modalRef?: BsModalRef;
  innerLoading: boolean;

  constructor(
    private profileService : ProfileService,
    private modalService: BsModalService,
    private toastr : ToastrService,
    private authService : AuthService
  ) { }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this.getProfile();
  }

  openModal(template: TemplateRef<void>) {
    this.modalRef = this.modalService.show(template);
  }

  getProfile(){
    this.loading = true;
    this.profileService.getProfile().subscribe({
      next : (res) => {
        this.profileData = res['data'];
        console.log(this.profileData);
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

  submitEdit(){
    console.log(this.profileData);
    this.innerLoading = true;
    this.profileService.editProfile(this.profileData).subscribe({
      next : (res) => {
        console.log(res);
        this.toastr.success('Profile updated successfully.');
        this.innerLoading = false;
        // this.isEditing = false;
        this.getProfile();
      },
      error : (err) => {
        console.log(err);
        this.innerLoading = false;
      },
      complete : () => {
        console.log('completed');
        this.innerLoading = false;
      }
    })
  }

  sendForVerification() {
    const email = this.authService.currentEmail;
    // this.forgotPassError = '';
    this.innerLoading = true;
    this.authService.forgotPassword(email).subscribe({
      next: (respons) => {
        this.toastr.success(
          `An email hase been sent to ${email} with password reset link. Please check your inbox.`
        );
        this.innerLoading = false;
      },
      error: (error) => {
        console.log(error);
        this.innerLoading = false;
      },
      complete: () => {},
    });
  }

}
