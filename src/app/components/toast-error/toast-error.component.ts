import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';
import { ErrorMessage } from 'src/app/classes/Utils';



interface Msg_Class{
	[key:string]:boolean;
}


@Component({
  selector: 'app-toast-error',
  templateUrl: './toast-error.component.html',
  styleUrls: ['./toast-error.component.css']
})


export class ToastErrorComponent implements OnInit {

	error_list:ErrorMessage[] = [];

	constructor(private restService:RestService)
	{

	}

	ngOnInit()
	{
		this.restService.errorObservable.subscribe((error)=>
		{
			if( error == null )
				return;

			console.log("error",error);
			this.error_list.push( error );

			setTimeout(() => {
				this.clicked(error);
			}, 10000);
		});
	}

	clicked(error:ErrorMessage)
	{
		let index = this.error_list.findIndex(i=>i===error);
		if( index > -1 )
			this.error_list.splice(index,1);
	}
	// clicked()
	// {
	// 	this.message = null;
	// 	this.show = false;
	// 	this.hightlight = false;
	// }
}
