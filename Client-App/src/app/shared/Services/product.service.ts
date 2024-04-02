import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { elementAt } from 'rxjs';
import { Projects } from 'src/app/Models/projects.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  baseUrl: string = environment.baseUrl;
  projectList : Projects[] = [];
  formattedDate : string = '';
  currentDate = new Date();

  constructor(private http: HttpClient, private datePipe : DatePipe) {

  }

  getFormattedDate(){
    this.formattedDate  = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
    console.log(this.currentDate);
  }

  getProductsList(){
    return this.http.get<Projects[]>(`${this.baseUrl}projects`);
  }

  getSpecificProject(id : string){
    return this.http.get<Projects[]>(`${this.baseUrl}projects/${id}`);
  }

  getRemDays(projects: Projects[]) {
    const currentDate = new Date(); // Get the current date

    projects.forEach(elem => {
      const endDate = new Date(elem.endDate);
      const timeDiff = endDate.getTime() - currentDate.getTime(); // Difference in milliseconds
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days
      elem.remainingDays = diffDays;
      // console.log(elem.remainingDays);
      projects.forEach(elem => {
        const fundPercent = (elem.currentAmount / elem.goalAmount) * 100; // Calculate fund percentage
        // console.log(fundPercent);
        elem.fundPercent = Number(fundPercent.toFixed(2)); // Round off to two decimal places and convert to number
      });
    });

    // projects.forEach(elem => {
    //   elem.remainingDays = elem.remainingDays < 0 ? 0 : elem.remainingDays; // If remaining days is less than 0, set it to 0
    // });

   // Filter out projects with remaining days less than 0

  }

  filterProject(projects: Projects[]){
    projects = projects.filter((elem) => elem.remainingDays >= 0);
    return projects;
  }



  createProject(body : FormData){
    return this.http.post(`${this.baseUrl}create-project`, body);
  }

  addStory(id : string, body : any){
    return this.http.post(`${this.baseUrl}projects/${id}/story`, body);
  }

  addUpdate(id : string, body : any){
    return this.http.post(`${this.baseUrl}projects/${id}/update`, body);
  }

  addComment(id : string, body : any){
    return this.http.post(`${this.baseUrl}projects/${id}/comment`, body);
  }

  addRewards(id : string, body : any){
    return this.http.post(`${this.baseUrl}projects/${id}/reward`, body);
  }

  createBookmark(id : string){
    return this.http.post(`${this.baseUrl}projects/createBookmark/${id}`, {});
  }

  getBookmarks(){
    return this.http.get(`${this.baseUrl}projects/bookmarks/myBookmarks`);
  }

  addMedia(formData : FormData, projectId : string){
    return this.http.post(`${this.baseUrl}projects/${projectId}/addMedia`, formData);
  }

  getTopProjects(){
    return this.http.get(`${this.baseUrl}trendingProjects`);
  }

  investInProject(id : string, body : any){
    return this.http.post(`${this.baseUrl}projects/esewa/${id}/invest`, body);
  }

  reportProject(id : string){
    return this.http.post(`${this.baseUrl}flagProject/${id}`, {});
  }

  getMyToken(){
   return this.http.get(`${this.baseUrl}profile/myToken`)
  }

  getInvestedProject(){
    return this.http.get(`${this.baseUrl}user/investments`);
  }

  getMyProjects(){
    return this.http.get(`${this.baseUrl}users/myProjects`);
  }

  deleteProject(projectId : string){
    return this.http.post(`${this.baseUrl}admin/delete/${projectId}`, {});
  }

  changeStatus(projectId : string, body : any){
    return this.http.post(`${this.baseUrl}admin/project/status/${projectId}`, body);
  }
}
