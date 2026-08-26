export const LOCAL_AGENT_SERVICE_LOGIN_TOKEN = 'local-agent-service-login'
export const SERVICE_CLOSE_URL = 'acp-service://close'
export const MOBILE_BROWSER_CHANNEL = 'acp-mobile-browser'

type ServiceHostWindow = {
	closed: boolean
	close(): void
	location: {
		assign(url: string): void
	}
	ReactNativeWebView?: {
		postMessage(message: string): void
	}
}

export function isLocalAgentTodoService(base = import.meta.env.BASE_URL): boolean {
	return base === '/services/todo/'
}

export function closeServiceHost(
	target: ServiceHostWindow = window as unknown as ServiceHostWindow,
): void {
	if (target.ReactNativeWebView) {
		target.ReactNativeWebView.postMessage(JSON.stringify({
			channel: MOBILE_BROWSER_CHANNEL,
			type: 'service-close',
		}))
		return
	}

	try {
		target.close()
	} catch {
		// Embedded browser views are not always script-closeable.
	}

	if (!target.closed) {
		target.location.assign(SERVICE_CLOSE_URL)
	}
}
