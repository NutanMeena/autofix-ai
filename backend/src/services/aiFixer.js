const Groq = require("groq-sdk");

class AICodeFixer {
  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
  }

  async findAndFixErrors(code, language = "javascript") {
    try {
      const prompt = `
You are an expert AI debugger.
Analyze this ${language} code.
Return ONLY valid JSON with no markdown, no backticks, no preamble.
FORMAT:
{
  "languageDetected": "string",
  "errors": [
    {
      "line": number,
      "message": "string",
      "severity": "error" | "warning" | "info",
      "suggestion": "string",
      "fixedLine": "string"
    }
  ],
  "correctedCode": "string",
  "diff": [
    {
      "line": number,
      "original": "string",
      "fixed": "string"
    }
  ],
  "score": {
    "overall": number,
    "performance": number,
    "security": number,
    "readability": number
  },
  "explanation": "string"
}
CODE:
${code}
`;

      const response = await this.groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2
      });

      let content = response.choices[0].message.content;
      content = content.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(content);

    } catch (error) {
      console.error("GROQ ERROR:", error);
      return {
        languageDetected: language,
        errors: [
          {
            line: 1,
            message: "Groq AI failed",
            severity: "error",
            suggestion: error.message,
            fixedLine: ""
          }
        ],
        correctedCode: code,
        diff: [],
        score: {
          overall: 0,
          performance: 0,
          security: 0,
          readability: 0
        },
        explanation: "Groq backend failed. Check your API key and model name."
      };
    }
  }
}

module.exports = AICodeFixer;