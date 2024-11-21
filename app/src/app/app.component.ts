import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Octokit } from '@octokit/rest';
import OpenAI from 'openai';
import { RepoService } from './repo.service';
import { marked } from 'marked';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,  // This marks the component as standalone
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  owner: string = '';
  repo: string = '';
  output: string = '';
  renderedOutput: SafeHtml | null = null;
  isLoading: boolean = false;

  constructor(private repoService: RepoService, private sanitizer: DomSanitizer) {}

  onOwnerInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.owner = target.value;
  }

  onRepoInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.repo = target.value;
  }

  private octokit = new Octokit({
    auth: '',
  });

  private openai = new OpenAI({
    apiKey: '',
    dangerouslyAllowBrowser: true,
  });

  formatString(input: string | null): string | null {
    if (input === null) {
      return null;
    }
    let formattedString = input.replace(/\\n/g, '\n');
    formattedString = formattedString.replace(/\+/g, ' ');
    return formattedString;
  }

  async callOpenAi(output: any): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a senior software engineer.' },
          {
            role: 'user',
            content: `Generate file-wise documentation detailing the files' functionality, protection mechanisms, enforced scopes, and implemented endpoints. The document should be structured and easy to navigate, and should not include the file contents. ${JSON.stringify(output)}`,
          },
        ],
      });
      return completion.choices[0].message.content || '';
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      return '';
    }
  }

  async getRepoFiles(owner: string, repo: string): Promise<any[]> {
    try {
      const repoContent = await this.octokit.repos.getContent({
        owner,
        repo,
        path: '',
      });

      const files: any[] = [];
      const fetchFiles = async (contents: any[]) => {
        for (const item of contents) {
          if (item.type === 'file' && item.path !== 'package-lock.json') {
            const fileData = await this.octokit.repos.getContent({
              owner,
              repo,
              path: item.path,
            });

            if (
              !Array.isArray(fileData.data) &&
              fileData.data.type === 'file' &&
              fileData.data.content
            ) {
              const content = Buffer.from(fileData.data.content, 'base64').toString('utf-8');
              files.push({ path: item.path, content });
            }
          } else if (item.type === 'dir') {
            const dirData = await this.octokit.repos.getContent({
              owner,
              repo,
              path: item.path,
            });

            if (Array.isArray(dirData.data)) {
              await fetchFiles(dirData.data);
            }
          }
        }
      };

      if (Array.isArray(repoContent.data)) {
        await fetchFiles(repoContent.data);
      }

      return files;
    } catch (error) {
      console.error('Error fetching repo files:', error);
      return [];
    }
  }

  async generateDocs(owner: string, repo: string) {
    this.isLoading = true;  // Set loading to true when fetching starts
    try {
      const output = await this.getRepoFiles(owner, repo);
      const doc = await this.callOpenAi(output);
      this.output = this.formatString(doc) || '';
      
      const markdownHtml = await Promise.resolve(marked.parse(this.output));
      
      this.renderedOutput = this.sanitizer.bypassSecurityTrustHtml(markdownHtml);
    } catch (error) {
      console.error('Error generating docs:', error);
    } finally {
      this.isLoading = false; 
    }
  }
}
