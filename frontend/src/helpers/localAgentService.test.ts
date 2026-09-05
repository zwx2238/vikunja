import {describe, expect, it, vi} from 'vitest'

import {getFullBaseUrl, resolveFullBaseUrl} from './getFullBaseUrl'
import {
	isLocalAgentTodoService,
	markLocalAgentServiceReady,
	resolveLocalAgentTodoApiUrl,
} from './localAgentService'

describe('local Agent Service integration', () => {
	it('resolves the Service Worker base without a window global', () => {
		vi.stubGlobal('window', undefined)
		vi.stubGlobal('location', {pathname: '/services/todo/sw.js'})
		try {
			expect(getFullBaseUrl()).toBe('/services/todo/')
		} finally {
			vi.unstubAllGlobals()
		}
	})

	it('marks a settled Service after its first painted frame', () => {
		const frames: FrameRequestCallback[] = []
		const calls: string[] = []
		const target = {documentElement: {setAttribute: (name: string) => calls.push(name)}} as unknown as Document
		markLocalAgentServiceReady('/services/todo/', target, {
			requestAnimationFrame: (callback) => frames.push(callback),
		})
		expect(calls).toEqual([])
		frames.shift()!(0)
		expect(calls).toEqual([])
		frames.shift()!(0)
		expect(calls).toEqual(['data-acp-service-ready'])
	})

	it('leaves ordinary deployments unchanged', () => {
		markLocalAgentServiceReady('/', {} as Document, {
			requestAnimationFrame: () => { throw new Error('must not schedule') },
		})
	})

	it('enables service behavior for every Todo host path', () => {
		expect(isLocalAgentTodoService('/services/todo/')).toBe(true)
		expect(isLocalAgentTodoService(`/service-sessions/todo/${'s'.repeat(32)}/`)).toBe(true)
		expect(isLocalAgentTodoService('/service-edge/services/todo/')).toBe(true)
		expect(isLocalAgentTodoService(`/service-edge/sessions/todo/${'s'.repeat(32)}/`)).toBe(true)
		expect(isLocalAgentTodoService('/')).toBe(false)
		expect(isLocalAgentTodoService('/services/wiki/')).toBe(false)
	})

	it('keeps API requests inside the active Todo host path', () => {
		expect(resolveLocalAgentTodoApiUrl('/services/todo/')).toBe('/services/todo/api/v1')
		expect(
			resolveLocalAgentTodoApiUrl(`/service-sessions/todo/${'s'.repeat(32)}/`),
		).toBe(`/service-sessions/todo/${'s'.repeat(32)}/api/v1`)
		expect(resolveLocalAgentTodoApiUrl('/service-edge/services/todo/')).toBe(
			'/service-edge/services/todo/api/v1',
		)
		expect(
			resolveLocalAgentTodoApiUrl(`/service-edge/sessions/todo/${'s'.repeat(32)}/`),
		).toBe(`/service-edge/sessions/todo/${'s'.repeat(32)}/api/v1`)
		expect(resolveLocalAgentTodoApiUrl('/')).toBeNull()
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
