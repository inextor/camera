import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastErrorComponent } from './components/toast-error/toast-error.component';
import { CustomCameraComponent } from './pages/custom-camera/custom-camera.component';
import { CapturarEvidencia3Component } from './pages/capturar-evidencia3/capturar-evidencia3.component';

@NgModule({
  declarations: [
    AppComponent,
    ToastErrorComponent,
    CustomCameraComponent,
    CapturarEvidencia3Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
