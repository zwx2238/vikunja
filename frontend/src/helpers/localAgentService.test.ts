import {describe, expect, it} from 'vitest'

import {isLocalAgentTodoService} from './localAgentService'

describe('local Agent Service integration', () => {
	it('only enables service behavior for the Todo Hub base path', () => {
		expect(isLocalAgentTodoService('/services/todo/')).toBe(true)
		expect(isLocalAgentTodoService('/')).toBe(false)
		expect(isLocalAgentTodoService('/services/wiki/')).toBe(false)
	})
})
