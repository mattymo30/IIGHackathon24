import { Octokit } from '../node_modules/@octokit/rest/dist-web/index.js';
import OpenAI from '../node_modules/openai/dist/browser/index.js';
import { Buffer } from '../node_modules/buffer/index.js';
import { marked } from '../node_modules/marked/lib/marked.esm.js';

class AppComponent {
  constructor() {
    this.owner = '';
    this.repo = '';
    this.output = '';
    this.renderedOutput = null;
    this.isLoading = false;

    this.octokit = new Octokit({
      auth: '', // Add your GitHub token here if needed
    });

    this.openai = new OpenAI({
      apiKey: '', // Add your OpenAI API key here
      dangerouslyAllowBrowser: true,
    });
  }

  onOwnerInputChange(event) {
    this.owner = event.target.value;
  }

  onRepoInputChange(event) {
    this.repo = event.target.value;
  }

  formatString(input) {
    if (input === null) {
      return null;
    }
    let formattedString = input.replace(/\\n/g, '\n');
    formattedString = formattedString.replace(/\+/g, ' ');
    return formattedString;
  }

  async callOpenAi(output) {
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

  async getRepoFiles(owner, repo) {
    try {
      const repoContent = await this.octokit.repos.getContent({
        owner,
        repo,
        path: '',
      });

      const files = [];
      const fetchFiles = async (contents) => {
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

  async genDocs(owner, repo) {
    // Select DOM elements
    const spinner = document.getElementById("spinner");
    const renderedOutput = document.getElementById("renderedOutput");
  
    // Helper functions to show/hide spinner
    function showSpinner() {
      spinner.classList.remove("hidden");
    }
  
    function hideSpinner() {
      spinner.classList.add("hidden");
    }
  
    // Clear previous output and show spinner
    showSpinner();
    renderedOutput.innerHTML = "";
  
    try {
      // Fetch repo files
      const output = await this.getRepoFiles(owner, repo);
  
      // Call OpenAI API
      const doc = await this.callOpenAi(output);
      this.output = this.formatString(doc) || "";
  
      // Handle file download
      if (this.output !== "") {
        const file = new Blob([this.output], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(file);
        link.download = "output.txt";
        link.click();
        link.remove();
      }
  
      // Render the markdown
      const markdownHtml = marked.parse(this.output);
  
      // Insert rendered output into the DOM
      renderedOutput.innerHTML = markdownHtml;
    } catch (error) {
      console.error("Error generating docs:", error);
      renderedOutput.innerHTML =
        "<p style='color: red;'>Failed to fetch documentation.</p>";
    } finally {
      // Hide spinner
      hideSpinner();
    }
  }
  

  async generateDocs(owner, repo) {
    this.isLoading = true; // Set loading to true when fetching starts
    try {
      const output = await this.getRepoFiles(owner, repo);
      const doc = await this.callOpenAi(output);
      this.output = this.formatString(doc) || '';

      if (this.output !== '') {
        const file = new Blob([this.output], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(file);
        link.download = 'output.txt';
        link.click();
        link.remove();
      }

      const markdownHtml = marked.parse(this.output);

      // Rendered output should be inserted into the DOM
      this.renderedOutput = markdownHtml; // Use this with innerHTML in your HTML
      console.log('Rendered Output:', markdownHtml);
    } catch (error) {
      console.error('Error generating docs:', error);
    } finally {
      this.isLoading = false;
    }
  }
}