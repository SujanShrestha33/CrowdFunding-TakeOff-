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
      projects.forEach(elem => {
        const fundPercent = (elem.currentAmount / elem.goalAmount) * 100; // Calculate fund percentage
        elem.fundPercent = Number(fundPercent.toFixed(2)); // Round off to two decimal places and convert to number
      });
    });


  }

}
