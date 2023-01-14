import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor (
    public dataService : DataService
  ){

  }

  prueba() : void {
    this.dataService.claseSidebar = this.dataService.claseSidebar == '' ? 'toggle-sidebar' : '';
  }
}
