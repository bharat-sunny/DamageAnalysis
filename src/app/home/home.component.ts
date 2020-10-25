import { Component, ViewChild, ElementRef  } from '@angular/core';
import { HttpEventType, HttpErrorResponse, HttpClient } from '@angular/common/http';
// import { of } from 'rxjs';  
// import { catchError, map, subscribeOn } from 'rxjs/operators';  
// import { UploadService } from  '../upload.service';
// import { strict } from 'assert';
// import { stringify } from 'querystring';
// import { FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent  {

    isShown: boolean = false ;
    FILE = []
    previewUrl:any = null;
    fileContent: string = '';
    @ViewChild("fileUpload", {static: false}) fileUpload: ElementRef;files  = [];  
    
    constructor( private http : HttpClient) { }
    uploadURL1 = 'https://l960bvgf0i.execute-api.us-east-1.amazonaws.com/dev/upload';
    results:any
    interface: MyInterface

    // TO store the all the images filereader data to PREVIEW
    images = [];
    names = [];


    //For Vgg
    show: boolean = false;
    labels:any = []
    Parts:any = {}

    //For Scratch
    DiagonalLength:any = {}
    ImageUrl: any ;

    // Function tp upload the images to S3 using presigned URL
    uploadFile(file) {  
      // console.log("SECOND FUNCTION FILWE",file.data)
      
      //initialise all variables at once
      this.images= []
      this.names = []
      this.show = false;
      this.labels = []
      this.Parts = {}
      this.FILE = []
      this.ImageUrl = ''
      this.DiagonalLength = {}
      this.isShown = false


      var reader = new FileReader();
      reader.readAsArrayBuffer(file.data)

      // console.log("RRRRRRRRRRRRRRRRRRRRRR",reader)
      var zoneOriginalInstance = (reader as any)["__zone_symbol__originalInstance"]
      var result:any
      zoneOriginalInstance.onloadend = function (e) {
        result = reader.result; 
        return result
      };  

      const headers = { 'Content-Type': 'application/json' };
      
      const body = JSON.stringify({
        name: file.data.name,
        type: file.data.type
      })
      
      this.http.post(this.uploadURL1,body,{headers}).toPromise().then((data:any ) =>{
                      console.log(data)            
 
                      // const myObject  = data.body;                                  
                      
                      console.log("object",JSON.stringify(data.body))                        
                      let obj:any =(data.body) 
                      this.interface = JSON.parse(obj)
                   
                      console.log(this.interface.uploadURL)
                      console.log("FILE NAMEMMME",file.data.name)
                      this.FILE.push(file.data.name);
 
                      
                      return fetch(this.interface.uploadURL, 
                        {
                          method: "PUT",
                          body: new Blob([result], {type: file.data.type})
                        })
                        .then((data) => { 
                          if (data.status == 200){console.log("Put Response successful")}
                          else{console.log("Failed")}
                        })
                      }
                      //Oter method to call PUT function 
                      // this.http.put(this.interface.uploadURL,new Blob([result],{type:file.data.Type})).toPromise().then(()=>
                      // {
                      //   console.log("Entered PUT")
                      // }
                      // )
                      
                    ).then(()=>{
                      console.log("Uploaded all files ");
                      this.isShown = true;
                    })
    }


    private uploadFiles() {  
      this.fileUpload.nativeElement.value = '';  
      this.files.forEach(file => {  
        this.uploadFile(file); 
        var reader = new FileReader();
        reader.onload = ()=>{
        this.images.push(reader.result)
        this.names.push(file.data.name)
      }
      reader.readAsDataURL(file.data)
      });  
      // console.log("NAMES", this.names);
      // console.log("imagessssssssssssssss", this.images);
    }


    onClick() {  
      
      const fileUpload = this.fileUpload.nativeElement;
      fileUpload.onchange = () => {  
      for (let index = 0; index < fileUpload.files.length; index++)  
      {  
       const file = fileUpload.files[index];  
       console.log("Here File ",file)
       console.log("end")
       this.files.push({ data: file, inProgress: false, progress: 0});  
      }  
        this.uploadFiles();  
      };  
      fileUpload.click();  
    }

    //////////////////////////////////////Scratch Model//////////////////////////////////////////
    
    
    
    
    ScratchModel() {
      console.log("Entered Scratch Model")
      const vggURL = 'https://l960bvgf0i.execute-api.us-east-1.amazonaws.com/dev/viaScratchModel'
      const headers = { 'Content-Type': 'application/json'};
      this.show = false;
      const body = JSON.stringify({
        bucket: 'vianalysis1',
        object: this.FILE
      })
      this.ImageUrl =  "https://vianalysis1.s3.amazonaws.com/Incoming/Output/" + this.FILE[0];
      console.log(body)
      this.http.post(vggURL,body,{headers:headers}).toPromise().then((data:any ) =>{ 
        console.log(data);
        this.DiagonalLength = data;
        console.log(this.ImageUrl)
        console.log(this.FILE)
      })
        
    }
      
    


    //////////////////////////////////////VGG MODEL/////////////////////////////////////////////  
    

    damage:string ;

    VGGModel() {
      console.log("Entered VGG Model")
      
      // const vggURL = 'http://0.0.0.0:5000/predict'
      const vggURL = 'https://l960bvgf0i.execute-api.us-east-1.amazonaws.com/dev/process'
      const headers = { 'Content-Type': 'application/json'};

      const body = JSON.stringify({
        bucket: 'vianalysis1',
        object: this.FILE
      })
      console.log(body)
      this.http.post(vggURL,body,{headers:headers}).toPromise().then((data:any ) =>{ 
        console.log(data);
        
        this.labels = data.result
        console.log(this.labels)
        this.show = true;
        console.log(this.Parts)
        if (this.labels.length > 0){
          for (let i=1 ;i < this.labels.length; i++)
          {
            console.log(i)
            
            this.Parts[this.labels[i].label] = this.labels[i].Severity;
            this.show = true;
            this.damage = "Damages"
          }

        }
        else{
          
          // this.Parts.append("NoDamage")
          console.log(this.Parts,"entersddd")
          this.damage = "No Damage"
          }
        
      })
        
    }
}


interface MyInterface {
  uploadURL: string;
}

