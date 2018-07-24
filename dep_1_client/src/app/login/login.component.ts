import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  authentication = {
    userName: '',
    password: ''
  };

  constructor(private router: Router) { }

  ngOnInit() {
  }

  /**
   * Logins login component
   */
  login() {
    if (this.authentication.userName === 'admin@admin.com' && this.authentication.password === 'admin') {
      this.router.navigate(['dashboard']);
    } else {
      this.router.navigate(['login']);
    }



  }
}
