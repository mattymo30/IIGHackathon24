import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RepoService } from "./repo.service";
import { AppComponent } from "./app.component";
import { MarkdownModule } from "ngx-markdown";
import { HttpClient, HttpClientModule } from "@angular/common/http";

@NgModule({
    declarations: [
        AppComponent,
        RepoService,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        MarkdownModule.forRoot({
            // loader: HttpClient
        })
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}