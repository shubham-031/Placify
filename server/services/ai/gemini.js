
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import logger from '../../utils/logger.js';

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// function parseJsonLoose(txt) {
//     // Strip code fences if model wraps JSON
//     const cleaned = txt.replace(/^```json\s*|```$/gim, "").trim();
//     try {
//         return JSON.parse(cleaned);
//     } catch (err) {
//         logger.error("[parseJsonLoose] Failed to parse JSON:", err);
//         logger.error("[parseJsonLoose] Raw response:", txt);
//         return { error: "Gemini returned non-JSON response", raw: txt };
//     }
// }

// export async function analyzeWithGemini(resumeText, jobDescription) {
//     try {
//         const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
//         const prompt = `You are an ATS expert. Compare the resume and the job description and output STRICT JSON only with keys: fitScore (0-100), strengths (string[]), weaknesses (string[]), suggestions (string[]). No prose.\n\nResume:\n"""${resumeText}"""\n\nJob Description:\n"""${jobDescription}"""`;

//         logger.debug("[analyzeWithGemini] Sending prompt to Gemini...");
//         const result = await model.generateContent(prompt);
//         const text = result.response.text();
//         logger.debug("[analyzeWithGemini] Gemini response received.");
//         return parseJsonLoose(text);
//     } catch (err) {
//         logger.error("[analyzeWithGemini] Gemini Error:", err?.message || err);
//         return { error: "Gemini AI failed" };
//     }
// }

// /**
//  * Generates an aptitude question using Gemini API
//  * @param {Object} params - { topic: string, difficulty: string }
//  * @returns {Promise<Object>} - { question, options, answer, explanation }
//  */

// export async function generateAptitudeQuestionWithGemini({ topic, difficulty }) {
//     try {
//         const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
//         const prompt = `Generate a multiple-choice aptitude question on the topic '${topic}' with difficulty '${difficulty}'. Provide the question, 4 options, the correct answer, and a brief explanation in STRICT JSON format with keys: question, options (string[]), answer, explanation. No prose.`;

//         logger.debug("[generateAptitudeQuestionWithGemini] Sending prompt to Gemini...");
//         const result = await model.generateContent(prompt);
//         const text = result.response.text();
//         logger.debug("[generateAptitudeQuestionWithGemini] Gemini response received.");
//         return parseJsonLoose(text);
//     } catch (err) {
//         logger.error("[generateAptitudeQuestionWithGemini] Gemini Error:", err?.message || err);
//         return { error: "Gemini AI failed" };
//     }
// }

// /**
//  * Chat with Gemini API, preserving chat history and roles
//  * @param {Array<{role: "user"|"assistant", content: string}>} messages
//  * @returns {Promise<string|{error:string,raw:string}>}
//  */
// export async function chatWithGemini(messages) {
//     try {
//         const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
//         let formatted = messages.map(m => ({
//             role: m.role,
//             parts: [{ text: m.content }]
//         }));

//         // Detect if user is asking about the website or registration process
//         const lastMsg = messages[messages.length - 1]?.content?.toLowerCase();
//         if (lastMsg && (lastMsg.includes("tell me about this website") || lastMsg.includes("register as a company") || lastMsg.includes("how do i register") || lastMsg.includes("sign up") || lastMsg.includes("create account"))) {
//             // Load README.md content as context
//             const fs = await import('fs/promises');
//             let readmeText = "";
//             try {
//                 readmeText = await fs.readFile("d:/my/GUNJAN/OpenSource/gssoc'25/placifyhash464/README.md", "utf-8");
//             } catch (e) {
//                 readmeText = "Placify is an AI-powered campus placement platform. For more details, visit the homepage.";
//             }
//             // Add specific registration flow instructions
//             const registrationInstructions = `\n\n---\n\nYou are Placify's website expert. ONLY answer questions about the website's user-facing features, pages, and components.\n\nHere is the website's frontend structure and features (from README):\n\n${readmeText}\n\nFor registration, guide users to:\n- Click the 'Sign In' or 'Register' button in the navbar.\n- Select their role (Student, Company, Employee, Institution, etc.).\n- Fill out the appropriate registration form (found in pages/register/ for each role).\n- After registration, they can log in and access their dashboard.\n\nDo NOT answer about backend, server, APIs, or database. Focus only on what users see and interact with on the website. If asked about errors, explain only what is visible to users and what the frontend does.\n\n---`;
//             // Prepend instructions/context to the first user message
//             if (formatted.length > 0) {
//                 formatted[0].parts[0].text = registrationInstructions + '\n\n' + formatted[0].parts[0].text;
//             }
//         }

//         const result = await model.generateContent({ contents: formatted });
//         const text = result.response.text();
//         return text;
//     } catch (err) {
//         logger.error("[chatWithGemini] Gemini Error:", err?.message || err);
//         return { error: "Gemini AI failed" };
//     }
// }




import { GoogleGenerativeAI } from "@google/generative-ai";
import logger from "../../utils/logger.js";

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing in .env");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MODEL_NAME = "gemini-2.5-flash";

/* ------------------------------------------------------------ */
/*                         HELPERS                              */
/* ------------------------------------------------------------ */

function parseJsonLoose(text) {
  try {
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (err) {
    logger.error("[parseJsonLoose]", err);

    return {
      error: "Gemini returned invalid JSON",
      raw: text,
    };
  }
}

async function loadReadmeContext() {
  try {
    const readmePath = path.resolve(__dirname, "../../../README.md");
    return await fs.readFile(readmePath, "utf8");
  } catch (err) {
    logger.warn("README not found.");

    return `
Placify is an AI powered Placement Preparation Platform.

Features

• Resume Analysis
• ATS Checker
• AI Career Guidance
• AI Mock Interview
• Emotion Detection
• Speech Analysis
• Company Dashboard
• Student Dashboard
`;
  }
}

async function generateWithRetry(model, payload, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await model.generateContent(payload);
    } catch (err) {
      logger.error(`[Gemini Retry ${i + 1}]`, err.message);

      if (
        err.message?.includes("429") ||
        err.message?.includes("quota")
      ) {
        if (i === retries - 1) throw err;

        await new Promise((resolve) =>
          setTimeout(resolve, (i + 1) * 3000)
        );

        continue;
      }

      throw err;
    }
  }
}

/* ------------------------------------------------------------ */
/*                  RESUME ANALYSIS                             */
/* ------------------------------------------------------------ */

export async function analyzeWithGemini(
  resumeText,
  jobDescription
) {
  try {
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
    });

    const prompt = `
You are an ATS Resume Expert.

Compare the Resume and Job Description.

Return STRICT JSON only.

Format:

{
 "fitScore": number,
 "strengths": [],
 "weaknesses": [],
 "suggestions": []
}

Resume:

${resumeText}

Job Description:

${jobDescription}
`;

    logger.debug("[ATS] Sending prompt...");

    const result = await generateWithRetry(model, {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2048,
      },
    });

    const text = result.response.text();

    logger.debug("[ATS] Response received");

    return parseJsonLoose(text);
  } catch (err) {
    logger.error("[ATS]", err);

    if (err.message?.includes("429")) {
      return {
        error:
          "Gemini quota exceeded. Please use another API Key.",
      };
    }

    return {
      error: err.message,
    };
  }
}

/* ------------------------------------------------------------ */
/*                APTITUDE QUESTION GENERATION                  */
/* ------------------------------------------------------------ */

export async function generateAptitudeQuestionWithGemini({
  topic,
  difficulty,
}) {
  try {
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
    });

    const prompt = `
You are an Aptitude Question Generator.

Generate ONE multiple-choice aptitude question.

Topic:
${topic}

Difficulty:
${difficulty}

Return STRICT JSON only.

Format:

{
  "question":"...",
  "options":[
    "...",
    "...",
    "...",
    "..."
  ],
  "answer":"...",
  "explanation":"..."
}

Rules:

- Exactly 4 options
- Only one correct answer
- Clear explanation
- No markdown
- No extra text
`;

    logger.debug("[APTITUDE] Sending prompt...");

    const result = await generateWithRetry(model, {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });

    const text = result.response.text();

    logger.debug("[APTITUDE] Response received");

    return parseJsonLoose(text);
  } catch (err) {
    logger.error("[APTITUDE]", err);

    if (err.message?.includes("429")) {
      return {
        error:
          "Gemini API quota exceeded. Please try again later.",
      };
    }

    return {
      error:
        err.message ||
        "Gemini failed to generate aptitude question.",
    };
  }
}


/* ------------------------------------------------------------ */
/*                     CHATBOT                                  */
/* ------------------------------------------------------------ */
export async function chatWithGemini(messages) {
  try {
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
    });

    const readme = await loadReadmeContext();

    const systemPrompt = `
You are Placify AI Assistant.

You help users with:

• Placify Website
• Resume Analysis
• ATS Score
• Career Guidance
• Aptitude Questions
• Mock Interviews
• Student Dashboard
• Company Dashboard
• Institution Dashboard

Use the following website information when answering.

${readme}

Rules:

- Be helpful.
- Answer in markdown.
- If you don't know something, say so.
- Never invent features.
`;

    // First message contains instructions
    const contents = [
      {
        role: "user",
        parts: [
          {
            text: systemPrompt,
          },
        ],
      },
    ];

    // Convert frontend roles to Gemini roles
    for (const msg of messages) {
      contents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [
          {
            text: msg.content,
          },
        ],
      });
    }

    logger.debug("[CHATBOT] Sending request to Gemini...");

    const result = await generateWithRetry(model, {
      contents,
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });

    const response = result.response.text();

    logger.debug("[CHATBOT] Response generated.");

    return response;
  } catch (err) {
    logger.error("[CHATBOT]", err);

    if (err.message?.includes("429")) {
      return {
        error:
          "Gemini API quota exceeded. Please try again later.",
      };
    }

    return {
      error:
        err.message || "Unable to generate AI response.",
    };
  }
}