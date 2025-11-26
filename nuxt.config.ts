// https://nuxt.com/docs/api/configuration/nuxt-config

import type { NuxtConfig } from 'nuxt/config'

const runtimeConfig: NuxtConfig['runtimeConfig'] = {
	public: {
		GEMINI_API_KEY: process.env.GOOGLE_API_KEY,
	},
}

export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },
	runtimeConfig,
})
