import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastErrorComponent } from './components/toast-error/toast-error.component';
import { CustomCameraComponent } from './pages/custom-camera/custom-camera.component';

@NgModule({
  declarations: [
    AppComponent,
    ToastErrorComponent,
    CustomCameraComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
