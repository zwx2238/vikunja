import {afterEach, describe, expect, it, vi} from 'vitest'
import {mount} from '@vue/test-utils'
import AddToHomeScreen from './AddToHomeScreen.vue'

afterEach(() => vi.unstubAllGlobals())

function render(installed: boolean) {
	vi.stubGlobal('matchMedia', () => ({matches: installed}))
	return mount(AddToHomeScreen, {
		global: {
			mocks: {$t: (key: string) => key},
			stubs: {Icon: true},
		},
	})
}

describe('optional install information', () => {
	it('keeps install information collapsed until requested', () => {
		const wrapper = render(false)
		expect(wrapper.find('details').exists()).toBe(true)
		expect(wrapper.find('details').attributes('open')).toBeUndefined()
		expect(wrapper.find('summary').text()).toBe('home.installApp')
		expect(wrapper.find('p').text()).toBe('home.addToHomeScreen')
		wrapper.unmount()
	})

	it('does not offer installation in standalone mode', () => {
		const wrapper = render(true)
		expect(wrapper.find('details').exists()).toBe(false)
		wrapper.unmount()
	})
})
