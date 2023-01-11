import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './gala/home/home.component';
import { FooterComponent } from './gala/components/footer/footer.component';
import { SidebarComponent } from './gala/components/sidebar/sidebar.component';
import { NavbarComponent } from './gala/components/navbar/navbar.component';
import { GalaComponent } from './gala/gala.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    FooterComponent,
    SidebarComponent,
    NavbarComponent,
    GalaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
