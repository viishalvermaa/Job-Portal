import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Employer } from '../Employer.module';
import { Job } from '../Job.module';


@Component({
  selector: 'app-jobseekerdashoard',
  templateUrl: './jobseekerdashoard.component.html',
  styleUrls: ['./jobseekerdashoard.component.css']
})
export class JobseekerdashoardComponent implements OnInit{
  
  queryParams:any;
  
  showApplications: boolean = false;
jobId:number=0
jobseekerId:number=0;
branch:string='';
baseURL:string='';
  constructor(private http: HttpClient,private route: ActivatedRoute) {
    
const start = window.location.href.indexOf('-') + 1;
const end = window.location.href.indexOf('.project');
this.branch = window.location.href.substring(start, end);
this.baseURL = `https://8080-${this.branch}.project.examly.io`;
  }
  ngOnInit() {
  
    this.route.queryParams.subscribe(params => {
      if (params['response']) {
        this.queryParams = JSON.parse(params['response']);
           this.jobseekerId=   this.queryParams;        ;
        console.log(this.jobseekerId);
      } else {
        console.log("Response parameter is missing.");
      }
    });
    this.getJobsByJobSeeker();

  }

 
  getJobsByJobSeeker() {

    this.http.get<Job[]>(`${this.baseURL}/dashboard/jobApplications/JobSeeker/${this.jobseekerId}/appliedJobs`).subscribe(
      (jobs: Job[]) => {
        if (jobs.length !== 0) {
          this.jobs = jobs;
          console.log(jobs);
        } else {
          this.jobs = [];
        }
      },
      error => {
        console.log(error);
      }
    );
  }
 
  jobApplications:any=[];
  employers:Employer[]=[];
  showJobs:boolean=false;
  jobs:any=[];


  withdrawApplication(): void {
    const url = `${this.baseURL}/api/job-applications/withdrawapplication/${this.jobId}/${this.jobseekerId}`;
  
    this.http.delete(url)
      .subscribe(
        () => {
         
           this.jobApplications.splice(this.currentApplicationIndex, 1);
         
           if (this.currentApplicationIndex >= this.jobApplications.length) {
             this.currentApplicationIndex = this.jobApplications.length - 1;
           }
           this.getApplications(this.jobId);
          this.getJobsByJobSeeker();
        },
        (error) => {
     console.log(error);
        }
      );
  }
  
  getApplications(jobId: number): void {
  
    this.http.get<any[]>(`${this.baseURL}/dashboard/jobApplications/${jobId}`).subscribe(
      data => {
        this.jobId=jobId;
        this.jobApplications = data;
        this.showApplications=true;
      },
      error => {
        this.showApplications=true;
        console.log(error);
      }
    );
  }
  
   
    currentApplicationIndex: number = 0; 

    moveToNextApplication(): void {
      if (this.currentApplicationIndex < this.jobApplications.length - 1) {
        this.currentApplicationIndex++;
      }
    }
    moveToPreviousApplication(): void {
      if (this.currentApplicationIndex > 0) {
        this.currentApplicationIndex--;
      }
    }

  }    
  
