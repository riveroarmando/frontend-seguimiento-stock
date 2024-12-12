import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { RouterLinkActive } from '@angular/router';

import { SecurityService } from '../services/security.services';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { Global } from '../services/global';
import { RouterModule } from '@angular/router';
/*Para que funcione httpclient */
import { HttpClientModule } from '@angular/common/http';

/*Angular Material */
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list'; 
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterOutlet, MatSidenavModule, MatToolbarModule, MatListModule, MatIconModule, MatButtonModule, MatMenuModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [SecurityService]
})
export class HomeComponent {
  public titulo: string;
  public usuario!: User;
  public url: string;

  constructor(
    private _securitydService: SecurityService,
    private _router: Router
    ){
    this.titulo= "Home component";
    this.usuario=this._securitydService.usuario;
    this.url=Global.url;
  }

  ngOnInit(): void {
    
  }

  ngDoCheck(): void {
    
  }

  ngOnDestroy(): void {
    
  }

  logout(){
    this._securitydService.logout();
    this._router.navigateByUrl("/");
  }

}
