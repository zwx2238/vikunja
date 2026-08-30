import {getFullBaseUrl} from './getFullBaseUrl'

export const LOCAL_AGENT_SERVICE_LOGIN_TOKEN = 'local-agent-service-login'

export function isLocalAgentTodoService(base = getFullBaseUrl()): boolean {
	return /^\/(?:services\/todo|service-sessions\/todo\/[A-Za-z0-9_-]{32,128}|service-edge\/services\/todo|service-edge\/sessions\/todo\/[A-Za-z0-9_-]{32,128})\/$/.test(base)
}
