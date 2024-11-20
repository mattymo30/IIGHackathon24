import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ 
    auth: ''
  });
  
//   const result = await octokit.request("GET /repos/{owner}/{repo}", {
//     owner: "mattymo30",
//     repo: "IIGHackathon24",
//   });

const result = await octokit.repos.getReadme({
    owner: "mattymo30",
    repo: "IIGHackathon24",
  });

  console.log(result)

  const content = Buffer.from(result.data.content, 'base64').toString('utf-8');
  console.log(content)
  