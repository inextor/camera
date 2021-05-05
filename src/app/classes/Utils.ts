import { HttpErrorResponse } from '@angular/common/http';
import { of,Observable } from 'rxjs';

export class ErrorMessage{

	message:string;
	type:string;
	msg_button:string;
	color:string;

	constructor(message:string,type:string)
	{
		this.message = message;
		this.type = type;

		if( type == 'alert-success')
		{
			this.msg_button = '✔️';
			this.color = 'green';
		}
		else
		{
			this.msg_button = '✖';
			this.color = 'red';
		}
	}
}

export interface StringDictionary<T>{
	[key:string]:T;
}
export interface NumberDictionary<T>{
	[key:number]:T;
}
export interface StringKey{
	[key:string]:number;
}

export interface GraphData
{
	view?:[number,number]; //The dimensions of the graphic set undefined for fill container
	results?:any[]; //The chart data
	schemeType?:string; //'ordinal' or 'linear'
	scheme?:any; //ColorScheme
	roundEdges?:boolean; //Rounded edges
	legendPosition?:string;
	xAxis?:any;
	yAxis?:any;
	legend?:boolean;
	labels?:boolean; //Show o hide the labels;
	gradient?:boolean;
	showXAxisLabel?:boolean;
	timeline?:boolean;
	xAxisLabel?:string;
	yAxisLabel?:string;
	showYAxisLabel?:boolean;
	doughnut?:boolean;
	select?:any;
	activate?:any;
	deactivate?:any;
}


export class Utils
{

	public static brownSchema:string[] = ['#3A1302','#601205','#8A2B0D','#C75E24','#C79F59','#A4956A','#868569','#756F61','#617983','#617983'];
	public static defaultSchema: string[] = [ '#E41011','#D80093','#DC67CE','#9500E2','#A367DC','#8067DC','#6794DC', '#22BFD8', '#34E4FE', '#19808E','#608F18','#B8FF3D'];

	static getLocalDateFromMysqlString(str:string):Date
	{
		if (str == null)
			return null;

		let components = str.split(/-|:|\s/g);

		if (components.length == 3)
			components.push('0', '0', '0');

		let d = new Date(parseInt(components[0]), //Year
			parseInt(components[1]) - 1, //Month
			parseInt(components[2]), //Day
			parseInt(components[3]), //Hour
			parseInt(components[4])) //Minutes
		return d;
	}

	static zero(n: number): string
	{
		return n < 10 ? '0' + n : '' + n;
	}

	static getDateFromMysqlString(str:string):Date
	{
		let components = str.split(/-|:|\s/g);

		let f:number[] = [];

		f.push( parseInt(components[0]) );
		f.push( parseInt(components[1])-1 );
		f.push( parseInt(components[2]) );
		f.push( components.length<4?0:parseInt(components[3]))
		f.push( components.length<5?0:parseInt(components[4]))

		let utcTime = Date.UTC(
			f[0],
			f[1]-1,
			f[2],
			f[3],
			f[4]
		);

		let d = new Date();
		d.setTime(utcTime);

		return d;
	}

	static getMysqlStringFromLocalDate(d: Date): string {
		let event_string = d.getFullYear()
			+ '-' + this.zero(d.getMonth() + 1)
			+ '-' + this.zero(d.getDate())
			+ ' ' + this.zero(d.getHours())
			+ ':' + this.zero(d.getMinutes())
			+ ':' + this.zero(d.getSeconds());

		return event_string;
	}

	static getMysqlStringFromDate(d: Date): string {
		let event_string = d.getUTCFullYear()
			+ '-' + this.zero(d.getUTCMonth() + 1)
			+ '-' + this.zero(d.getUTCDate())
			+ ' ' + this.zero(d.getUTCHours())
			+ ':' + this.zero(d.getUTCMinutes())
			+ ':' + this.zero(d.getUTCSeconds());

		return event_string;
	}

	static getErrorString( error:any ):string
	{
		if (error == null || error === undefined)
			return 'Error desconocido';

		if (typeof error === "string")
			return error;

		if( 'error' in error )
		{
			if( typeof(error.error) == 'string' )
			{
				return error.error;
			}

			if( error.error && 'error' in error.error && error.error.error )
			{
				return error.error.error;
			}
		}

		if( 'message' in error  && typeof( error.message ) == 'string' )
		{
			return error.message;
		}

		if( error instanceof HttpErrorResponse )
		{
			return error.statusText;
		}

		return 'Error desconocido';
	}

	static transformJson(response:string):any
	{
		return JSON.parse( response, (key,value)=>
		{
			if( /^\d{4}-\d{2}-\d{2}(T|\s)\d{2}:\d{2}:\d{2}/.test( value ) )
			{
				let components = value.split(/T|-|:|\s/g);
				let utcTime = Date.UTC(
					parseInt( components[0] ),
								parseInt( components[1] )-1,
								parseInt( components[2] ),
								parseInt( components[3] ),
								parseInt( components[4] )
							);
				let localTime = new Date();
				localTime.setTime( utcTime );
				return localTime;
			}
			return value;
		});
	}

	static getEmptyPieData(): GraphData {
		let select = () => { console.log('select') };
		return {
			results: [{ name: 'a', value: 0 }, { name: 'b', value: 0 }, { name: 'c', value: 0 }, { name: 'd', value: 0 }],
			scheme: {
				domain:
				[
					'#E41011', '#D80093', '#9500E2', '#B8FF3D', '#608F18', '#22BFD8',
					'#34E4FE', '#19808E', '#6794DC', '#8067DC' ,'#A367DC', '#DC67CE'
				]
			},
			gradient: true,
			doughnut: false,
			legend: true,
			labels: true,
			legendPosition: 'below',
			select: select,
			activate: select,
			deactivate: select
		};
	}

	static getEmptyStackAreaChart():GraphData
	{
		return {
			scheme: { domain: ['#E41011', '#EE0034', '#D80093', '#9500E2', '#B8FF3D', '#608F18', '#22BFD8', '#34E4FE', '#19808E'] },
			results: [],//[]{ name: 'a', value: 0 }, { name: 'b', value: 0 }, { name: 'c', value: 0 }, { name: 'd', value: 0 }],
			xAxis: true,
			yAxis: true,
			xAxisLabel: '',
			yAxisLabel: '',
			showXAxisLabel: true,
			showYAxisLabel: true,
			timeline: false,
			legend: true,
			select: ()=>{}
		}
	}


	static getEmptyBarChart(): GraphData {
		let select = () => { console.log('select') };
		return {
			results: [{ name: 'a', value: 0 }, { name: 'b', value: 0 }, { name: 'c', value: 0 }, { name: 'd', value: 0 }],
			scheme: { domain:
				[
					'#E41011', '#D80093', '#9500E2', '#B8FF3D', '#608F18', '#22BFD8',
					'#34E4FE', '#19808E','#6794DC' ,'#8067DC' ,'#A367DC' ,'#DC67CE'
				]
			},
			gradient: true,

			xAxis: true,
			yAxis: true,
			xAxisLabel: '',
			yAxisLabel: '',
			roundEdges: true,
			select: select,
			activate: select,
			deactivate: select,
		};
	}

	xlsx2json(file:File,headers:string[]):Promise<any>
	{
		return Promise.resolve([]);
		//if( file == null )
		//	return Promise.reject();

		//return new Promise((resolve,reject)=>
		//{
		//	const reader: FileReader = new FileReader();

		//	reader.onload = (e: any) => {
		//		/* read workbook */
		//		const bstr: string = e.target.result;
		//		const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary',cellDates:true});

		//		console.log('Names are',wb.SheetNames );

		//		/* grab first sheet */
		//		const wsname: string = wb.SheetNames[0];
		//		const ws: XLSX.WorkSheet = wb.Sheets[wsname];

		//		//console.log( ws );
		//		/* save data */
		//		let data = XLSX.utils.sheet_to_json(ws, {header: headers});
		//		data.splice(0,1);
		//		//console.log( data );
		//		resolve(data);
		//	};
		//	reader.readAsBinaryString( file );
		//});
	}

	xlsx2RawRows(file:File):Promise<any[]>
	{
		return Promise.resolve([]);
		//if( file == null )
		//	return Promise.reject();

		//return new Promise((resolve,reject)=>
		//{
		//	const reader: FileReader = new FileReader();

		//	reader.onload = (e: any) => {
		//		/* read workbook */
		//		const bstr: string = e.target.result;
		//		const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary',cellDates:true});

		//		/* grab first sheet */
		//		const wsname: string = wb.SheetNames[0];
		//		const ws: XLSX.WorkSheet = wb.Sheets[wsname];

		//		//console.log( ws );
		//		let data = XLSX.utils.sheet_to_json(ws, {header: 1, blankrows:false});
		//		resolve(data);
		//	};
		//	reader.readAsBinaryString( file );
		//});
	}

	array2xlsx(array:any[],filename:string,headers:string[])
	{
		//let ws = XLSX.utils.json_to_sheet(array, {header: headers });
		//let wb = XLSX.utils.book_new();
		//XLSX.utils.book_append_sheet(wb, ws, filename );
		//let x = XLSX.writeFile( wb, filename );
		//console.log( x );
	}

	csv2json(file: File, header: boolean, delimiter: string): Observable<any> {
		return of({});
		//return this.ngxCsvParser.parse(file, { header, delimiter });
	}

	static createDictionary(obj_list:any[],index:string):StringDictionary<any>
	{
		let dictionary:StringDictionary<any> = {};
		obj_list.forEach(i=>{
			if( index in i )
			{
				dictionary[ i[index] ] = i;
			}
		});

		return dictionary;
	}
}
