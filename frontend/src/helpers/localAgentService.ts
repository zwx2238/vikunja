import {getFullBaseUrl} from './getFullBaseUrl'

export const LOCAL_AGENT_SERVICE_LOGIN_TOKEN = 'local-agent-service-login'

export function isLocalAgentTodoService(base = getFullBaseUrl()): boolean {
	return /^\/(?:services\/todo|service-sessions\/todo\/[A-Za-z0-9_-]{32,128}|service-edge\/services\/todo|service-edge\/sessions\/todo\/[A-Za-z0-9_-]{32,128})\/$/.test(base)
}

export function resolveLocalAgentTodoApiUrl(base = getFullBaseUrl()): string | null {
	return isLocalAgentTodoService(base) ? `${base}api/v1` : null
}

export function markLocalAgentServiceReady(
	base = getFullBaseUrl(),
	documentTarget: Document = document,
	runtime: Pick<Window, 'requestAnimationFrame'> = window,
): void {
	if (!isLocalAgentTodoService(base)) return
	runtime.requestAnimationFrame(() => {
		runtime.requestAnimationFrame(() => {
			documentTarget.documentElement.setAttribute('data-acp-service-ready', '')
		})
	})
}
