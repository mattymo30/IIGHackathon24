import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RepoService } from "./repo.service";
import { AppComponent } from "./app.component";
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        CommonModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}