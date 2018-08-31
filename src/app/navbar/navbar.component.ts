import { Component } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

import { environment } from '../../environments/environment';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  showLogout: boolean = environment.enableAuth;

  constructor(private auth: OAuthService) { }

  logout(event: Event): void {
    this.auth.logOut();
    event.preventDefault();
  }
}
