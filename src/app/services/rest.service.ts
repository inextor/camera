import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
//import * as XLSX from 'xlsx';
import {Utils, ErrorMessage } from '../classes/Utils';

//import { NgxCsvParser } from 'ngx-csv-parser';
export interface SearchResume
{
	total?:number;
	sum?:number;
	min?:number;
	max?:number;
	remaining?:number;
}


@Injectable({
	providedIn: 'root'
})

export class RestService
{

	public errorBehaviorSubject: BehaviorSubject<ErrorMessage>;
	public errorObservable: Observable<ErrorMessage>;

	vibrate_ok:number[] = [350];
	vibrate_fail:number[] = [100,100,100];

	constructor()
	{
		//Produccion por cambiarx`x
		this.errorBehaviorSubject = new BehaviorSubject<ErrorMessage>(null);
		this.errorObservable = this.errorBehaviorSubject.asObservable();

		window.addEventListener('error', function(error){
			console.error('Error', error);
		});
	}

	showSuccess(msg:string):void
	{
		this.showErrorMessage(new ErrorMessage(msg, 'alert-success'));
	}

	showError(error: any)
	{
		console.log('Error to display is', error);
		if( error instanceof ErrorMessage )
		{
			this.showErrorMessage(error);
			return;
		}

		let str_error = Utils.getErrorString(error);
		this.showErrorMessage(new ErrorMessage(str_error, 'alert-danger'));
	}

	showErrorMessage(error: ErrorMessage)
	{
		this.errorBehaviorSubject.next(error);
	}
}
