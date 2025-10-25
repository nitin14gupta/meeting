import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY || 'AIzaSyBeUdFBeVDzSwxs6c7qS53J_KNlyvqlKkU');
const model = genAI.getGenerativeModel({
    model: process.env.NEXT_PUBLIC_GEMINI_MODEL_NAME || 'gemini-2.5-flash'
});

export interface MeetingSummary {
    title: string;
    keyPoints: string[];
    actionItems: string[];
    decisions: string[];
    nextSteps: string[];
    participants: string[];
    summary: string;
}

export const generateMeetingSummary = async (chunks: string[]): Promise<MeetingSummary> => {
    try {
        const combinedText = chunks.join(' ');

        const prompt = `
Please analyze the following meeting transcript and create a comprehensive meeting summary (MOM - Minutes of Meeting) in JSON format.

Meeting Transcript:
${combinedText}

Please provide a structured summary with the following format:
{
  "title": "Brief descriptive title of the meeting",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3"],
  "actionItems": ["Action item 1 with assignee", "Action item 2 with assignee"],
  "decisions": ["Decision 1", "Decision 2"],
  "nextSteps": ["Next step 1", "Next step 2"],
  "summary": "A comprehensive 2-3 paragraph summary of the meeting"
}

Guidelines:
- Extract key decisions and action items clearly
- Identify participants mentioned in the conversation
- Create actionable next steps
- Write a professional summary suitable for business documentation
- If information is unclear, make reasonable inferences
- Keep the summary concise but comprehensive
- Return only valid JSON, no additional text
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean the response to extract JSON
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No valid JSON found in response');
        }

        const summary = JSON.parse(jsonMatch[0]);
        return summary;
    } catch (error) {
        console.error('Error generating meeting summary:', error);
        throw new Error('Failed to generate meeting summary. Please try again.');
    }
};

export const generateQuickSummary = async (chunks: string[]): Promise<string> => {
    try {
        const combinedText = chunks.join(' ');

        const prompt = `
Please provide a brief 2-3 sentence summary of the following meeting transcript:

${combinedText}

Focus on the main topics discussed and key outcomes. Keep it concise and professional.
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error generating quick summary:', error);
        throw new Error('Failed to generate quick summary. Please try again.');
    }
};
