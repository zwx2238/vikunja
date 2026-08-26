import {describe, expect, it} from 'vitest'

import {bearerTokenHeaders} from './fetcher'

describe('bearerTokenHeaders', () => {
	it('keeps direct API auth and adds the Hub-compatible forwarding header', () => {
		expect(bearerTokenHeaders('service-token')).toEqual({
			Authorization: 'Bearer service-token',
			'X-Local-Agent-Service-Authorization': 'Bearer service-token',
		})
	})
})
