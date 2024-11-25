import conf from "../../conf/groqConf";
import Groq from "groq-sdk";

class GroqService {
    constructor() {
        this.groq = new Groq({
            apiKey: conf.apiKey,
            dangerouslyAllowBrowser: true,
        });
    }

    async getResponse(systemPrompt,prompt,isJson=false) {
        try {
            const completion = await this.groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: systemPrompt,
                    },
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                model: "llama3-8b-8192",
                response_format:{
                    type: isJson?"json_object":"text",
                }
            });

            return completion.choices[0].message.content;
        } catch (error) {
            console.log(`Groq service :: getResponse :: error`, error);
            throw error;
        }
    }
}

export default new GroqService();