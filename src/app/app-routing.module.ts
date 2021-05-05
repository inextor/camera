import { NgModule } from '@angular/core';
import {CustomCameraComponent} from './pages/custom-camera/custom-camera.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{ path: '', component: CustomCameraComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
