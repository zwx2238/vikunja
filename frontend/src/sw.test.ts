import {afterEach, expect, it, vi} from 'vitest'
import {precacheAndRoute} from 'workbox-precaching'

vi.mock('workbox-precaching', () => ({precacheAndRoute: vi.fn()}))

afterEach(() => vi.unstubAllGlobals())

it('uses one precache controller so activation cannot erase the current manifest', async () => {
	const manifest = [{url: 'assets/app-contenthash.js', revision: null}]
	const legacyPrecache = vi.fn()
	const registerRoute = vi.fn()
	const imports = vi.fn()
	vi.stubGlobal('location', {pathname: '/services/todo/sw.js'})
	vi.stubGlobal('self', {__WB_MANIFEST: manifest, addEventListener: vi.fn()})
	vi.stubGlobal('importScripts', imports)
	vi.stubGlobal('__WORKBOX_VERSION__', 'v7.4.1')
	vi.stubGlobal('workbox', {
		setConfig: vi.fn(),
		core: {clientsClaim: vi.fn()},
		routing: {registerRoute},
		strategies: {StaleWhileRevalidate: class {}, NetworkOnly: class {}},
		precaching: {precacheAndRoute: legacyPrecache},
	})
	await import('./sw')
	expect(precacheAndRoute).toHaveBeenCalledExactlyOnceWith(manifest)
	expect(legacyPrecache).not.toHaveBeenCalled()
	expect(imports).toHaveBeenCalledWith('/services/todo/workbox-v7.4.1/workbox-sw.js')
	expect(registerRoute).toHaveBeenCalledTimes(2)
})
