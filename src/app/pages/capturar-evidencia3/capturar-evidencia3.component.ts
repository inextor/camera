import { Component, OnInit } from '@angular/core';
import {StringDictionary} from 'src/app/classes/Utils';
//import {SerialNumberInfo} from 'src/app/models/models';
//import {Category, Item, Serial_Number} from 'src/app/models/RestModels';
import {RestService} from 'src/app/services/rest.service';
//import { createWorker, PSM } from 'tesseract.js';

//declare function getImageCapture(track):any;

interface Capabilities{
	name:string;
	min?:number;
	max?:number;
	step?:number;
	list:string[];
	enable:boolean;
	value:any;
	raw_value:any;
};



@Component({
	selector: 'app-capturar-evidencia3',
	templateUrl: './capturar-evidencia3.component.html',
	styleUrls: ['./capturar-evidencia3.component.css']
})

export class CapturarEvidencia3Component  implements OnInit
{
	constructor(public rest:RestService)
	{

	}
	current_constraints:MediaTrackConstraints = {};
	devices:MediaDeviceInfo[] = [];
	track:MediaStreamTrack = null;
	applied_constraints:any = null;
	needs_init:boolean = null;
	camera_id:string = null;

	rect:any = null;
	otherProps:any = null;

	code:string;
	//item:Item = null;
	//category:Category = null;
	//serial_number:Serial_Number = null;
	//serial_number_info:SerialNumberInfo = null;
	cameras_found:boolean = true;
	error_foo:string = '';
	imgString:string = null;

//	worker:any = createWorker();
	original_cam_img:string = null;
	json_data:any = null;

	status_dictionary:StringDictionary<string> = {
		ON_STOCK: 'En almacen',
		SOLD:'Vendido',
		DESTROYED:'Destruido',
		ASIGNED_TO_USER:'Asignado a cliente',
		IN_SHIPPING:'En Envio',
		RETURNED: 'Regresado'
	};


	advanced_constraints:any = { advanced: [

	]};

	all_Tracks:any[] = [];

	video_constraints:any ={

	};

	ngOnInit(): void
	{
		navigator.mediaDevices.enumerateDevices().then((devices)=>
		{
			this.devices = devices

			let device = devices.find((d)=>{return d.label == 'camera2 0, facing back'});

			if( device )
			{
				this.camera_id = device.deviceId;
			}
		},(error)=>this.rest.showError(error));

		//(async () => {
		//	await this.worker.load();
		//	await this.worker.loadLanguage('eng');
		//	await this.worker.initialize('eng');
		//	await this.worker.setParameters({
		//		tessedit_char_whitelist: "Nn-0123456789",
		//		tessedit_pageseg_mode: PSM.SINGLE_LINE //'7' //	see /node_modules/tesseract.js/src/index.d.ts
		//	});
		//	//console.log(text);
		//	//this.error_foo = text;
		//	//this.onNewCodigo( text );
		//})()
	}

	ngOnDestroy()
	{
		this.stopVideo();
	}

	stopVideo()
	{
		let video = document.getElementById('video') as HTMLVideoElement;
		if( video )
		{
			video.pause();
		}

		if( this.track )
		{
			this.track.stop();
		}
	}

	imageCapture:any	= null;
	raw_photo_capabilities:any	= null;
	raw_video_capabilities:any 	= null;
	video_options:StringDictionary<Capabilities> = {};

	onGetUserMediaButtonClick(evt:any)
	{
		this.stopVideo();
		this.initCam();
	}

	nextCam()
	{

	}

	onGrabFrameButtonClick(evt:any)
	{
		//this.imageCapture.grabFrame()
		//.then((imageBitmap:ImageBitmap) => {
		//	const canvas = document.querySelector('#grabFrameCanvas') as HTMLCanvasElement;
		//	this.drawCanvas(canvas, imageBitmap);
		//})
		//.catch(error => this.rest.showError(error));
	}

	onTakePhotoButtonClick(evt:any)
	{
		//this.imageCapture.takePhoto()
		//.then(blob => createImageBitmap(blob))
		//.then((imageBitmap:ImageBitmap) => {
		//	const canvas = document.getElementById('takePhotoCanvas') as HTMLCanvasElement;
		//	this.drawCanvas(canvas, imageBitmap);
		//})
		//.catch(error => this.rest.showError(error));
	}

	/* Utils */

	drawCanvasVideo()
	{
		let video =	document.getElementById('video') as HTMLVideoElement;
		createImageBitmap(video).then((imageBitmap)=>{
			console.log('bitmap');

			let video_container = document.getElementById('video_container');
			let image_ratio = document.getElementById('image_mask');

			let diff	= video_container.clientHeight-video.clientHeight;
			let rect	= image_ratio.getBoundingClientRect();
			let ratio	= imageBitmap.width/rect.width;

			this.otherProps = {bitmap_widht:imageBitmap.width, bitmap_height: imageBitmap.height , ratio,ystart: ratio*rect.y };

			let canvas	= document.createElement('canvas') as HTMLCanvasElement;
			canvas.width = rect.width;
			canvas.height = rect.height;

			canvas.getContext('2d').drawImage(video, rect.x*ratio, (rect.y-diff)*ratio, rect.width*ratio, rect.height*ratio, 0,0,rect.width,rect.height);
			this.imgString = canvas.toDataURL();

		},(error)=>this.rest.showError(error));

		//this.otherProps = { };

		//let pixels_size = window.devicePixelRatio;
		//this.otherProps['video_ClientHidth'] = video.clientWidth;
		//this.otherProps['video_ClientHeight'] = video.clientHeight;
		//this.otherProps['video_height'] = video.height;
		//this.otherProps['video_width'] = video.width;
		//this.otherProps['pixels_size'] = pixels_size;

		//let canvas	= document.createElement('canvas') as HTMLCanvasElement;
		//canvas.width = rect.width
		//canvas.height = rect.height
		//canvas.getContext('2d').drawImage(video, rect.x*pixels_size, rect.y*pixels_size , rect.width*pixels_size, rect.height*pixels_size, 0,0,rect.width,rect.height);

		//// convert it to a usable data URL
		//this.imgString = canvas.toDataURL();
	}

	drawCanvas(img:ImageBitmap)
	{
		let video =	document.getElementById('video') as HTMLVideoElement;

		createImageBitmap(video).then((imageBitmap)=>
		{

		});

		let image_ratio = document.getElementById('image_ratio');
		let rect = image_ratio.getBoundingClientRect();

		let canvas	= document.createElement('canvas') as HTMLCanvasElement;
		canvas.width = rect.width;
		canvas.height = rect.height;

		canvas.getContext('2d').drawImage(video, rect.x, rect.y, rect.width, rect.height, 0,0,rect.width,rect.height);

		// convert it to a usable data URL
		this.imgString = canvas.toDataURL();


		////let ratio	= Math.min(canvas.width / img.width, canvas.height / img.height);
		////let x = (canvas.width - img.width * ratio) / 2;
		////let y = (canvas.height - img.height * ratio) / 2;
		////canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
		////canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height, x, y, img.width * ratio, img.height * ratio);
		//canvas.getContext('2d').drawImage(img, 0, 0, canvas_width,canvas_height);
	}


	applyConstraints()
	{

		let constraints:any= { video:{ } };

		this.applied_constraints = constraints;

		if( this.needs_init )
		{
			this.initCam();
		}
		else
		{
			this.track.applyConstraints( constraints )
			.then(()=>
			{
				this.rest.showSuccess('Constraints applicados');
				this.updateConstraintsValues( this.track.getConstraints() )
			})
			.catch((error)=>
			{
				this.rest.showError(error);
			});
		}
	}

	updateConstraintsValues(mediaTrackConstraints:MediaTrackConstraints)
	{
		//this.current_constraints = mediaTrackConstraints;

		for(let i in mediaTrackConstraints)
		{
			let type = typeof( mediaTrackConstraints[i] );
			if( i in this.video_options && this.video_options[i].enable )
			{
				if( type == "string" || type == "number" || type == "boolean")
				{
					this.video_options.value = mediaTrackConstraints[i];
				}
			}
		}
	}

	updateVideoOption(video_option:Capabilities, evt:any)
	{
		console.log( evt.target.value );
		if( video_option.min !== undefined )
		{
			video_option.value = parseInt( evt.target.value );
			this.current_constraints[ video_option.name ] = video_option.value;
		}
		else
		{
			video_option.value = evt.target.value;
			this.current_constraints[ video_option.name ] = video_option.value;
		}


		if( this.needs_init )
		{
			this.applyConstraints()
		}
		else
		{
			let obj = {};
			obj[ video_option.name ] = video_option.value;

			this.track.applyConstraints({advanced:[ obj ]});
		}

	}

	initCam()
	{
		if( this.applied_constraints	== null )
		{
			//Este no
			this.applied_constraints =	{
				video:{
					facingMode:{ ideal: "environment" },
					focusDistance:{ ideal: 0.2 },
					//width: {ideal: 3840},
					//height: {ideal: 2160},
					width: {ideal: 2160},
					height: {ideal: 1620},
					zoom:{ideal: 4},
					resizeMode:{ ideal: "none" },
					focusMode:{ ideal: "continuous" }
				}
			};
		}

		if( this.camera_id )
		{
			this.applied_constraints = {
				video:{
					deviceId: this.camera_id,
					//width: {ideal: 2160},
					//height: {ideal: 800},
					//apectRatio:{ ideal:(4/3)},
					width: {ideal: 1620},
					height: {ideal: 2160},
					zoom: { ideal: 4 },
					focusDistance: { ideal: 0.1 },
					focusMode:{ ideal: "single-shot" }
				}
			};
		}
		else
		{
			this.applied_constraints.video['facingMode']={ ideal: 'environment' };
		}

		navigator.mediaDevices.getUserMedia( this.applied_constraints ).then( mediaStream =>
		{
			let video = document.getElementById('video') as HTMLVideoElement;
			video.srcObject = mediaStream;
			this.all_Tracks = mediaStream.getVideoTracks();
			this.track = this.all_Tracks[0];
		//this.imageCapture = getImageCapture( this.track );
			//this.raw_video_capabilities = this.track.getCapabilities();
			//this.updateConstraintsValues(this.track.getConstraints());
			return true;
			//'return this.imageCapture.getPhotoCapabilities();
		})
		.then((photoCapabilities)=>{
			this.raw_photo_capabilities = photoCapabilities;
		})
		.catch(error => this.rest.showError(error));
	}


	onCameraChange(evt:any)
	{
		this.camera_id = evt.target.value;
		this.stopVideo();
		setTimeout(()=>{
			this.initCam();
		},500);
	}

	changeNeedsInit(evt:any)
	{
		this.needs_init = evt.target.checked;
	}

	onNewCodigo(code:string)
	{
		if( code == this.code	|| !code || code.trim() == "")
		{
			this.rest.showError('El codigo a buscar esta vacio');
			return;
		}

		this.error_foo = code;

		this.code = code;
		//this.subs.sink = this.rest.serial_number_info.search({eq:{code: code.trim()},limit:1}).subscribe(response=>{
		//	if( response.data.length )
		//	{
		//		this.serial_number_info = response.data[0];
		//	}
		//	//this.error_foo = 'Serial encontrado';
		//},(error)=>this.rest.showError(error));
	}

	codigoLlego(codigo:string)
	{
		this.onNewCodigo(codigo);
	}

	onQrCodeArrived(code:string)
	{
		this.error_foo = code;
		let marbeteRegex=/^https:\/\/siat\.sat\.gob\.mx.*=N.\d+$/;

		if( marbeteRegex.test( code ) )
		{
			let codigo = code.replace(/.*=Nn(\d+)/,'$1');
			this.onNewCodigo(codigo);

		}
		else
		{
			this.error_foo = code;
		}
	}

	guardarEvidencia(evt:any)
	{
		//this.subs.sink = this.rest.update('addDestructionEvidence',{
		//	evidence_image_id: this.serial_number.evidence_image_id,
		//	code: this.code
		//})
		//.subscribe((response)=>
		//{
		//	this.rest.showSuccess('La evidencia se guardo exitosamente');
		//},(error)=>this.rest.showError(error));
	}

	scanOcr(base64Url:string)
	{
		//(async () => {
		//	//console.log('Try To recognize img',base64Url);
		//	const { data: { text } } = await this.worker.recognize( base64Url );
		//	let new_text = text.replace(/[nN-\s]/g,"");
		//	if( new_text )
		//	{
		//		this.error_foo = new_text;
		//		this.onNewCodigo( new_text	);
		//	}
		//	else
		//	{
		//		this.rest.showError('Fallo al descifrar la imagen');
		//	}
		//})();
	}

	marcarComoRegresado()
	{
		//this.subs.sink = this.rest.markSerialNumbMarkederAsReturned( this.serial_number_info.serial_number.id ).subscribe(()=>{
		//	this.showSuccess('Se marco exitosamente');
		//},(error)=>this.rest.showError(error));
	}

}
