import {describe, expect, it, vi} from 'vitest'

import {
	closeServiceHost,
	isLocalAgentTodoService,
	MOBILE_BROWSER_CHANNEL,
	SERVICE_CLOSE_URL,
} from './localAgentService'

describe('local Agent Service integration', () => {
	it('only enables service behavior for the Todo Hub base path', () => {
		expect(isLocalAgentTodoService('/services/todo/')).toBe(true)
		expect(isLocalAgentTodoService('/')).toBe(false)
		expect(isLocalAgentTodoService('/services/wiki/')).toBe(false)
	})

	it('uses the mobile host close channel when available', () => {
		const postMessage = vi.fn()

		closeServiceHost({
			closed: false,
			close: vi.fn(),
			location: {assign: vi.fn()},
			ReactNativeWebView: {postMessage},
		})

		expect(JSON.parse(postMessage.mock.calls[0][0])).toEqual({
			channel: MOBILE_BROWSER_CHANNEL,
			type: 'service-close',
		})
	})

	it('falls back to the desktop close protocol', () => {
		const assign = vi.fn()

		closeServiceHost({
			closed: false,
			close: vi.fn(),
			location: {assign},
		})

		expect(assign).toHaveBeenCalledWith(SERVICE_CLOSE_URL)
	})
})
