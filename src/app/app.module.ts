import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// Material Components
import {MatToolbarModule} from '@angular/material/toolbar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [   
    AppComponent,
    NavbarComponent,
  ],
  imports: [
    // Material Components
    MatToolbarModule,
    // End Material Components
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
