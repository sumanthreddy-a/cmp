import { Component, OnInit, Inject } from '@angular/core';
import { BeneficiaryService } from '../services/beneficiary.service';
import { SyncrequestService } from '../services/syncrequest.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-beneficiary',
  templateUrl: './beneficiary.component.html',
  styleUrls: ['./beneficiary.component.scss']
})
export class BeneficiaryComponent implements OnInit {
  beniFiciaryList;
  request;


  constructor(public dialog: MatDialog, private beneficiaryService: BeneficiaryService, private syncrequestService: SyncrequestService) { }

  ngOnInit() {
    this.benificiaryData()
  }


  benificiaryData() {
    this.beneficiaryService.beneficiary().subscribe((res: any) => {
      this.beniFiciaryList = res.data;
    })
  }


  sync(request) {
    console.log(request)
    const syncRequest = {
      whom: '',
      who: 'dep2',
      what: request.adhar,
      reason: '',
      status: 'pending',
      personName: request.name
    }
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '500px',
      data: syncRequest

    });
  }
  addBeneficiaryDialog() {
    const dialogRef = this.dialog.open(DialogBeneficiary, {
      width: '500px',
      data: { name: '', adhar: '', gender: '', age: '', address: '', district: '' }

    });
    dialogRef.afterClosed().subscribe(result => {
      this.benificiaryData()
    });
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'sync.request.component.html',
})
export class DialogOverviewExampleDialog {
  beniFiciaryList;
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>, @Inject(MAT_DIALOG_DATA) public data: any,
    private syncrequestService: SyncrequestService,
    private beneficiaryService: BeneficiaryService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  syncRequestSending() {
    console.log(this.data)
    this.syncrequestService.syncRequest(this.data).subscribe((res: any) => {
      console.log(res)
      if (res.success) {
        this.dialogRef.close();
        this.beneficiaryService.beneficiary().subscribe((response: any) => {
          this.beniFiciaryList = response.data;
        })
      }
    })
  }

}


// add beneficiary
@Component({
  selector: 'Dialog-benificiary-example-dialog',
  templateUrl: 'add.beneficiary.component.html',
})
export class DialogBeneficiary {
  beniFiciaryList;
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>, @Inject(MAT_DIALOG_DATA) public data: any,
    private syncrequestService: SyncrequestService,
    private beneficiaryService: BeneficiaryService) { }
  

  onNoClick(): void {
    this.dialogRef.close();
  }
  addBeneficiary() {
    console.log(this.data)
    this.beneficiaryService.addBeneficiary(this.data).subscribe((res: any) => {
      console.log(res)
      if (res.success) {
        this.dialogRef.close();
        this.beneficiaryService.beneficiary().subscribe((response: any) => {
          this.beniFiciaryList = response.data;
        })
      }
    })
  }

}
