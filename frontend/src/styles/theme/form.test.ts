import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {expect, test} from 'vitest'

const css = readFileSync(resolve(process.cwd(), 'src/styles/theme/form.scss'), 'utf8')

test('native select options use explicit theme colors', () => {
	expect(css).toMatch(
		/option\s*\{[^}]*background-color:\s*var\(--input-background-color\);[^}]*color:\s*var\(--input-color\);/s,
	)
	expect(css).toMatch(
		/option:disabled\s*\{[^}]*color:\s*var\(--input-disabled-color\);/s,
	)
})
