import OpenAI from "openai";
const openai = new OpenAI();

const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
            role: "user",
            content: "can you parse through this repository url: https://github.com/angeudybp/IIGHackathon24/tree/sample-branch and return the file names in it",
        },
    ],
});

console.log(completion.choices[0].message);