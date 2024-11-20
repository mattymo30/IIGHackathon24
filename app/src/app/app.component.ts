import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RepoService } from './repo.service';
import { generateMdFile } from '../../../ai/github'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
 
  owner: string = '';
  repo: string = '';
  fileContent: string = '';

  constructor (private repoService: RepoService) {}

  generateDocs() {
    
  }

}
