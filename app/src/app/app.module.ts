import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import {FormsModule} from '@angular/forms';
import { RepoService } from "./repo.service";
import { AppComponent } from "./app.component";

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule

    ],
    providers: [RepoService,],
    bootstrap: [AppComponent]
})
export class AppModule {}