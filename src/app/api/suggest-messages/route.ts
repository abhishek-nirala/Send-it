
import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function getGroqChatCompletion() {
    const content = "Create a list of four open-ended and engaging questions formatted as a single string. Each questions should be separated by '||'.These questions are for an anonymous social messaging platform, Qooh.me, and should be diverse for diverse audience. Avoid personal or sensitive topics, focusing instead on universal theme that encourages friendly interactions. For example you output should be structured like this: What's a hobby you've started recently? || If you could travel anywhere in the world, where would you go? || What's your favorite book and why? Ensure that the questions are engaging and open-ended to encourage responses.";
    return groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content,
            },
        ],
        model: "llama-3.3-70b-versatile",
    });
}
export async function GET() {

    try {
        const chatCompletion = await getGroqChatCompletion();
        const chatMessage = chatCompletion.choices[0]?.message?.content || "";
        // Print the completion returned by the LLM.
        console.log(chatMessage);
        return Response.json({
            success: true,
            message: chatMessage,
        });
    }catch(error){
        return Response.json({
            success: false,
            message: "Failed to get message suggestions",
            error
        });
    }

}