import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import {FormsModule} from '@angular/forms';
import { RepoService } from "./repo.service";
import { AppComponent } from "./app.component";
import { HttpClient } from "@angular/common/http";

@NgModule({
    declarations: [
        AppComponent,
        RepoService,
    ],
    imports: [
        BrowserModule,

    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}