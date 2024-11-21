import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RepoService } from "./repo.service";
import { AppComponent } from "./app.component";

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