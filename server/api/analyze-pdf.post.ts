import { GoogleGenAI } from '@google/genai'
import * as fs from 'node:fs'
import * as path from 'node:path'

export default defineEventHandler(async (event) => {
	const ai = new GoogleGenAI({
		apiKey: process.env.GOOGLE_API_KEY,
	})

	// Read the PDF file
	const pdfPath = path.join(process.cwd(), 'app/pdfs/60.pdf')
	const base64ImageFile = fs.readFileSync(pdfPath, {
		encoding: 'base64',
	})

	const contents = [
		{
			inlineData: {
				mimeType: 'application/pdf',
				data: base64ImageFile,
			},
		},
		{
			text: "Look at the floorplan image and identify all rooms or enclosed sections that have at least one wall or boundary line drawn in color (i.e. not black or gray — for example, lines in green, blue, or red). For each of these rooms or sections: Extract any text, numbers, or codes that appear inside the space or directly next to it, especially if they look like a room name, label, or identifier. If multiple text elements are close together, combine them in top-to-bottom reading order to form a single complete label (e.g., 'FOKUS 2 P 1542'). If no identifying text is found inside or near the space, return a placeholder like 'unknown 1', 'unknown 2', and so on. Return only a flat array with an object of room name, door type (ex PIDG. usually encircle), wall height (indicated with an H:, color green), and wall length (blue text), in any order. Do not include duplicates or unlabeled rooms more than once. If there are no colored walls or identifiable rooms, return an empty array. If there are no wall height or length indicators, set those values to null.",
		},
	]

	const response = await ai.models.generateContent({
		model: 'gemini-3-pro-preview',
		contents: contents,
	})

	return {
		text: response.text,
	}
})
