import { Component, OnDestroy, OnInit } from '@angular/core';
import {StringDictionary} from 'src/app/classes/Utils';
import {RestService} from 'src/app/services/rest.service';



declare function getImageCapture(track):any;

interface Capabilities{
	name:string;
	min?:number | null;
	max?:number | null;
	step?:number | null;
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

	currentConstraints:MediaTrackConstraints = {};
	devices:MediaDeviceInfo[] = [];
	track:MediaStreamTrack = null;

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
		let constraints:any= {
			video:{
				facingMode:{ ideal: "environment" },
				focusDistance:{ ideal: 0.2 },
				apectRatio:{ ideal:(4/3)},
				zoom:{ideal: 4},
				resizeMode:{ ideal: "none" },
				focusMode:{ ideal: "continuous" }
			}
		};

		navigator.mediaDevices.getUserMedia(constraints).then(mediaStream => {
			let video = document.getElementById('video') as HTMLVideoElement;
			video.srcObject = mediaStream;
			this.track = mediaStream.getVideoTracks()[0];
			this.currentConstraints = this.track.getConstraints();
			this.imageCapture = getImageCapture( this.track );
			this.raw_video_capabilities = this.track.getCapabilities();

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
						min: this.raw_video_capabilities[i].min,
						max: this.raw_video_capabilities[i].max,
						step: this.raw_video_capabilities[i].step,
						name: i,
						list: [],
						value:this.raw_video_capabilities[i].min,
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
		for(let i in this.video_options)
		{
			let c = this.video_options[i];

			if( c.enable )
			{
				this.video_constraints[ c.name ] = c.value;
			}
		}

		this.track.applyConstraints( this.video_constraints )
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

	updateConstraintsValues(mediaTrackConstraints:MediaTrackConstraints)
	{

	}

	//document.querySelector('video').addEventListener('play', function() {
	//		document.querySelector('#grabFrameButton').disabled = false;
	//		document.querySelector('#takePhotoButton').disabled = false;
	//});
}