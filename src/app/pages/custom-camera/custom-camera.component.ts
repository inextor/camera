import { Component, OnDestroy, OnInit } from '@angular/core';
import {StringDictionary} from 'src/app/classes/Utils';
import {RestService} from 'src/app/services/rest.service';



declare function getImageCapture(track):any;

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
	selector: 'app-custom-camera',
	templateUrl: './custom-camera.component.html',
	styleUrls: ['./custom-camera.component.css']
})
export class CustomCameraComponent  implements OnInit, OnDestroy {

	current_constraints:MediaTrackConstraints = {};
	devices:MediaDeviceInfo[] = [];
	track:MediaStreamTrack = null;
	applied_constraints:any = null;
	needs_init:boolean = null;

	all_Tracks:any[] = [];

	video_constraints:any ={

	};

	constructor(public rest:RestService)
	{

	}

	ngOnInit(): void
	{
		navigator.mediaDevices.enumerateDevices().then((devices)=>this.devices = devices,(error)=>this.rest.showError(error));
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
		this.imageCapture.grabFrame()
		.then((imageBitmap:ImageBitmap) => {
			const canvas = document.querySelector('#grabFrameCanvas') as HTMLCanvasElement;
			this.drawCanvas(canvas, imageBitmap);
		})
		.catch(error => this.rest.showError(error));
	}

	onTakePhotoButtonClick(evt:any)
	{
		this.imageCapture.takePhoto()
		.then(blob => createImageBitmap(blob))
		.then((imageBitmap:ImageBitmap) => {
			const canvas = document.getElementById('takePhotoCanvas') as HTMLCanvasElement;
			this.drawCanvas(canvas, imageBitmap);
		})
		.catch(error => this.rest.showError(error));
	}

	/* Utils */

	drawCanvas(canvas:HTMLCanvasElement, img:ImageBitmap)
	{
		//let canvas_width = 1920;
		//let canvas_height = 1080;
		canvas.width = parseInt(getComputedStyle(canvas).width.split('px')[0]);
		canvas.height = parseInt(getComputedStyle(canvas).height.split('px')[0]);

		let ratio	= Math.min(canvas.width / img.width, canvas.height / img.height);
		let x = (canvas.width - img.width * ratio) / 2;
		let y = (canvas.height - img.height * ratio) / 2;
		canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
		canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height, x, y, img.width * ratio, img.height * ratio);
	}


	applyConstraints()
	{
		let constraints:any= { video:{ } };

		for(let i in this.video_options)
		{
			let c = this.video_options[i];

			if( c.enable && this.current_constraints[ c.name ]  )
			{
				constraints.video[ c.name ] = { ideal: c.value };
			}
		}

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

		this.applyConstraints()
	}


	initCam()
	{
		if( this.applied_constraints  == null )
		{
			this.applied_constraints =  {
				video:{
					facingMode:{ ideal: "environment" },
					focusDistance:{ ideal: 0.2 },
					apectRatio:{ ideal:(4/3)},
					zoom:{ideal: 4},
					resizeMode:{ ideal: "none" },
					focusMode:{ ideal: "continuous" }
				}
			};
		}

		this.applied_constraints.video['facingMode']={ ideal: 'environment' };

		navigator.mediaDevices.getUserMedia( this.applied_constraints ).then( mediaStream => {
			let video = document.getElementById('video') as HTMLVideoElement;
			video.srcObject = mediaStream;
			this.all_Tracks = mediaStream.getVideoTracks();
			this.track = this.all_Tracks[0];
			this.imageCapture = getImageCapture( this.track );
			this.raw_video_capabilities = this.track.getCapabilities();
			this.updateConstraintsValues(this.track.getConstraints());

			let banned:string[] = ['aspectRatio','height','width'];

			for(let i in this.raw_video_capabilities )
			{
				let type = typeof this.raw_video_capabilities[i];

				if( banned.includes( i ) || type == "boolean" || type == "string")
				{
					this.video_options[i] = {
						name: i,
						raw_value: this.raw_video_capabilities[i],
						list:[],
						value: null,
						enable: false
					}
					continue;
				}

				if( Array.isArray(this.raw_video_capabilities[i]) )
				{
					if( this.raw_video_capabilities[i].length == 0 )
					{
						this.video_options[i] = {
							name: i,
							raw_value: this.raw_video_capabilities[i],
							list:[],
							value: null,
							enable: false
						}
						continue;
					}

					this.video_options[i] ={
						name: i,
						list: this.raw_video_capabilities[i],
						value: this.raw_video_capabilities[i][0],
						enable: true,
						raw_value: this.raw_video_capabilities[i]
					};
				}
				else if( typeof this.raw_video_capabilities[i] == "object" )
				{
					this.video_options[i] ={
						min: this.raw_video_capabilities[i]?.min,
						max: this.raw_video_capabilities[i]?.max,
						step: this.raw_video_capabilities[i]?.step,
						name: i,
						list: [],
						value:this.raw_video_capabilities[i]?.min,
						enable: true,
						raw_value: this.raw_video_capabilities[i]
					};
				}
			}

			return this.imageCapture.getPhotoCapabilities();
		})
		.then((photoCapabilities)=>{
			this.raw_photo_capabilities = photoCapabilities;
		})
		.catch(error => this.rest.showError(error));
	}


	changeNeedsInit(evt:any)
	{
		this.needs_init = evt.target.checked;
	}
	//document.querySelector('video').addEventListener('play', function() {
	//		document.querySelector('#grabFrameButton').disabled = false;
	//		document.querySelector('#takePhotoButton').disabled = false;
	//});
}
