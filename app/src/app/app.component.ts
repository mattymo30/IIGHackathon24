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

  onOwnerInputChange(event: Event): void {
    const target = event.target as HTMLInputElement
    this.owner = target.value;
  }

  onRepoInputChange(event: Event): void {
    const target = event.target as HTMLInputElement
    this.repo = target.value;
  }

  generateDocs() {
    if (this.owner && this.repo) {
      generateMdFile(this.owner, this.repo)
    }

  }

}
