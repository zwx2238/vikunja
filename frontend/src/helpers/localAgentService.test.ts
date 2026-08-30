import {describe, expect, it} from 'vitest'

import {resolveFullBaseUrl} from './getFullBaseUrl'
import {isLocalAgentTodoService} from './localAgentService'

describe('local Agent Service integration', () => {
	it('enables service behavior for every Todo host path', () => {
		expect(isLocalAgentTodoService('/services/todo/')).toBe(true)
		expect(isLocalAgentTodoService(`/service-sessions/todo/${'s'.repeat(32)}/`)).toBe(true)
		expect(isLocalAgentTodoService('/service-edge/services/todo/')).toBe(true)
		expect(isLocalAgentTodoService(`/service-edge/sessions/todo/${'s'.repeat(32)}/`)).toBe(true)
		expect(isLocalAgentTodoService('/')).toBe(false)
		expect(isLocalAgentTodoService('/services/wiki/')).toBe(false)
	})

	it('resolves the runtime base for Hub and Broker Edge launches', () => {
		expect(resolveFullBaseUrl('./', '/services/todo/')).toBe('/services/todo/')
		expect(
			resolveFullBaseUrl('./', `/service-sessions/todo/${'s'.repeat(32)}/tasks/1`),
		).toBe(`/service-sessions/todo/${'s'.repeat(32)}/`)
		expect(resolveFullBaseUrl('./', '/service-edge/services/todo/tasks/1')).toBe(
			'/service-edge/services/todo/',
		)
		expect(
			resolveFullBaseUrl('./', `/service-edge/sessions/todo/${'s'.repeat(32)}/tasks/1`),
		).toBe(`/service-edge/sessions/todo/${'s'.repeat(32)}/`)
		expect(resolveFullBaseUrl('/', '/login')).toBe('/')
	})
})
