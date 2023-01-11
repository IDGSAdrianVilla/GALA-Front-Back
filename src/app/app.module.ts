import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './gala/home/home.component';
import { FooterComponent } from './gala/components/footer/footer.component';
import { SidebarComponent } from './gala/components/sidebar/sidebar.component';
import { NavbarComponent } from './gala/components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { AppRoutes } from './app.routing';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    FooterComponent,
    SidebarComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(AppRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [
    RouterModule
  ]
})
export class AppModule { }
