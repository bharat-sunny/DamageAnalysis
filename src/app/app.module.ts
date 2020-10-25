import { HomeComponent } from './home/home.component';  
import { AboutComponent } from './about/about.component';

import { BrowserModule } from '@angular/platform-browser';  
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';  
import { AppComponent } from './app.component';  
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule  } from '@angular/material/toolbar';  
import { MatIconModule} from '@angular/material/icon';    
import { MatCardModule} from '@angular/material/card';    
import { MatButtonModule} from '@angular/material/button';    
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DemoMaterialModule } from './demo-material-module';

import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({  
  declarations: [  
    AppComponent,
    HomeComponent,  
    AboutComponent   
  ],  
  imports: [  
    BrowserModule,  
    FlexLayoutModule,
    AppRoutingModule,  
    HttpClientModule,  
    MatToolbarModule,  
    MatIconModule,  
    MatButtonModule,  
    MatCardModule,  
    DemoMaterialModule,
    MatProgressBarModule, NgbModule  
  ],  
  providers: [],  
  bootstrap: [AppComponent]  
})  
export class AppModule { }