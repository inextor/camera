import { NgModule } from '@angular/core';
import {CustomCameraComponent} from './pages/custom-camera/custom-camera.component';
import { RouterModule, Routes } from '@angular/router';
import {CapturarEvidencia3Component} from './pages/capturar-evidencia3/capturar-evidencia3.component';

const routes: Routes = [
	{ path: '', component: CapturarEvidencia3Component, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
