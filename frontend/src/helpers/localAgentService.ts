export const LOCAL_AGENT_SERVICE_LOGIN_TOKEN = 'local-agent-service-login'

export function isLocalAgentTodoService(base = import.meta.env.BASE_URL): boolean {
	return base === '/services/todo/'
}
