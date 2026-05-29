import mixpanel from 'mixpanel-browser';

const token = import.meta.env.PUBLIC_MIXPANEL_TOKEN as string | undefined;
let inited = false;

export function initMixpanel() {
	if (inited || !token) return;
	mixpanel.init(token, {
		autocapture: true,
		record_sessions_percent: 0,
		api_host: 'https://api-eu.mixpanel.com'
	});
	inited = true;
}

export default mixpanel;
