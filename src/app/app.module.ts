// Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

// Material Components
import {MatToolbarModule} from '@angular/material/toolbar';

// Components
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { FormComponent } from './form/form.component';

@NgModule({
  declarations: [   
    AppComponent,
    NavbarComponent,
    LoginComponent,
    SignupComponent,
    FormComponent,
  ],
  imports: [
    // Material Components
    MatToolbarModule,
    // NG Components
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
