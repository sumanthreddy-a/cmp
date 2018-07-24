import { Component, OnInit } from '@angular/core';
import { SyncrequestService } from '../services/syncrequest.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  syncRequestedData: any[];
  totalRequest: number;
  approved: any[];
  pending: any[];
  reject: any[];
  approvedCount: number;
  pendingCount: number;
  rejectCount: number;

  constructor(private syncrequestService: SyncrequestService) { }
  startAnimationForLineChart() {

  };

  ngOnInit() {
    this.syncRequests()
  };


  /**
   * Syncs requests
   */
  syncRequests() {
    this.syncrequestService.syncRequestList().subscribe((res: any) => {
      this.syncRequestedData = res.data;
      this.totalRequest = res.data.length;
      this.approved = [];
      this.pending = [];
      this.reject = [];
      this.syncRequestedData.map(requestdata => {

        if (requestdata.status === 'apporved') {
          this.approved.push(requestdata)
          this.approvedCount = this.approved.length
        } if (requestdata.status === 'pending') {
          this.pending.push(requestdata)
          this.pendingCount = this.pending.length

        } if (requestdata.status === 'reject') {
          this.reject.push(requestdata)
          this.rejectCount = this.reject.length
        }
      })

    })
  }


  /**
   * Approved dashboard component
   * @param request 
   */
  Approved(request) {
    const requestData = {
      id: request.what,
      status: 'approved'
    }
    this.syncrequestService.approved(requestData).subscribe((res: any) => {
      this.syncRequestedData = res.data;
      this.syncRequests();
    })
  }


  /**
   * Rejects dashboard component
   * @param request 
   */
  Reject(request) {
    const requestData = {
      id: request.what,
      status: 'reject'
    }
    this.syncrequestService.reject(requestData).subscribe((res: any) => {
      this.syncRequestedData = res.data;
      this.syncRequests();
    })
  }




}
