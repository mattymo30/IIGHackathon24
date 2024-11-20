import { Octokit } from "@octokit/rest";
import OpenAI from "openai";
import fs from 'fs';

const octokit = new Octokit({ 
    auth: ''
  });


async function readMeFile(string, chunkSize = 2048) {
    const chunks = [];
    for (let i= 0; i<fileContent.length; i+= chunkSize) {
        chunks.push(string.substring(i, i + chunkSize ));
    }
    return chunks;
}
  
async function getRepoFiles(owner,repo){
    try{
        const {data: repoContent} = await octokit.repos.getContent({
            owner,
            repo,
            path: ''
        });

        const files = [];
        async function fetchFiles(contents){
            for( const item of contents){
                if(item.type === 'file' && item.path !=='package-lock.json'){
                    const { data: fileContent } = await octokit.repos.getContent({
                        owner,
                        repo,
                        path: item.path
                    })
                    const content = Buffer.from(fileContent.content, 'base64').toString('utf-8');
                    files.push({path: item.path, content});
                } else if (item.type === 'dir') {
                    const {data: dirContents } = await octokit.repos.getContent({
                        owner,
                        repo,
                        path: item.path
                    });
                    await fetchFiles(dirContents)
                }
            }
        }

        await fetchFiles(repoContent);
        return files;
    }catch(error){
        console.log("Errrorrrrrrrrr", error)
    }
}


const openai = new OpenAI({apiKey: ''});

async function callOpenAi(output){
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a senior software engineer." },
                {
                    role: "user",
                    content: `generate file-wise documentation detailing the files functionality, protection mechanisms, enforced scopes, and implemented endpoints
                    the documents should be structured and easy to navigate and don't include the file contents ${JSON.stringify(output)}`,
                },
            ],
        });

    return completion.choices[0].message.content
}


function formatString(input){
    if(input === null){
        return null;
    }

    let formattedString = input.replace(/\\n/g, '\n');
    formattedString = formattedString.replace(/\+/g, ' ');
    return formattedString

}

function downloadFile(string, fileName) {
    fs.writeFile(fileName, string, (err) => {
        if(err) {
            console.error(err)
        } else {
            console.log(fileName)
        }
    })
}

const output = await getRepoFiles('mattymo30', 'my-hello-world')

const doc = await callOpenAi(output)

downloadFile(formatString(doc), 'formated.md')

