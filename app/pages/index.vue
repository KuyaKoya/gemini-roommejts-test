<template>
	<div style="display: flex; flex-direction: column; align-items: center; gap: 16px; margin-top: 50px">
		<input
			type="file"
			accept="application/pdf"
			@change="handleFileSelect"
		/>
		<button
			@click="handleClick"
			:disabled="!pdfData"
		>
			Analyze PDF
		</button>
		<div v-if="loading">Loading...</div>
		<pre
			v-if="result"
			style="width: 80%; background: #f4f4f4; padding: 16px; border-radius: 8px; overflow-x: auto; flex-wrap: wrap"
			>{{ result }}</pre
		>
	</div>
</template>

<script setup>
	import { GoogleGenAI } from '@google/genai'
	import { ref } from 'vue'

	const config = useRuntimeConfig()
	const ai = new GoogleGenAI({
		apiKey: config.public.GEMINI_API_KEY,
	})

	const pdfData = ref(null)
	const loading = ref(false)
	const result = ref(null)

	const handleFileSelect = async (event) => {
		const file = event.target.files[0]
		if (file && file.type === 'application/pdf') {
			const reader = new FileReader()
			reader.onload = (e) => {
				// Remove the data:application/pdf;base64, prefix
				pdfData.value = e.target.result.split(',')[1]
			}
			reader.readAsDataURL(file)
		}
	}

	const handleClick = async () => {
		if (!pdfData.value) return

		loading.value = true
		try {
			const contents = [
				{
					inlineData: {
						mimeType: 'application/pdf',
						data: pdfData.value,
					},
				},
				{
					text: "Look at the floorplan image and identify all rooms or enclosed sections that have at least one wall or boundary line drawn in color (i.e. not black or gray — for example, lines in green, blue, or red). For each of these rooms or sections: Extract any text, numbers, or codes that appear inside the space or directly next to it, especially if they look like a room name, label, or identifier. If multiple text elements are close together, combine them in top-to-bottom reading order to form a single complete label (e.g., 'FOKUS 2 P 1542'). If no identifying text is found inside or near the space, return a placeholder like 'unknown 1', 'unknown 2', and so on. Return only a flat array with an object of room name, door type (ex PIDG. usually encircle), wall height (indicated with an H:, color green), and wall length (blue text), in any order. Do not include duplicates or unlabeled rooms more than once. If there are no colored walls or identifiable rooms, return an empty array. If there are no wall height or length indicators, set those values to null.",
				},
			]

			const response = await ai.models.generateContent({
				model: 'gemini-2.5-flash',
				contents: contents,
			})
			result.value = response.text
			console.log(response.text)
		} catch (error) {
			console.error('Error:', error)
			result.value = error.message || 'An error occurred'
		} finally {
			loading.value = false
		}
	}
</script>
