<script lang="ts">
	import type { Pathname } from '$app/types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import './layout.css';
	import * as m from '$lib/paraglide/messages';
	import favicon from '$lib/assets/favicon.svg';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import CookieConsent from '$lib/components/CookieConsent.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>{m.layout_title()}</title>
	<link rel="icon" href={favicon} />
	<script>
		(function (e, c) {
			if (!c.__SV) {
				var l, h;
				window.mixpanel = c;
				c._i = [];
				c.init = function (q, r, f) {
					function t(d, a) {
						var g = a.split('.');
						2 == g.length && ((d = d[g[0]]), (a = g[1]));
						d[a] = function () {
							d.push([a].concat(Array.prototype.slice.call(arguments, 0)));
						};
					}
					var b = c;
					'undefined' !== typeof f ? (b = c[f] = []) : (f = 'mixpanel');
					b.people = b.people || [];
					b.toString = function (d) {
						var a = 'mixpanel';
						'mixpanel' !== f && (a += '.' + f);
						d || (a += ' (stub)');
						return a;
					};
					b.people.toString = function () {
						return b.toString(1) + '.people (stub)';
					};
					l =
						'disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders start_session_recording stop_session_recording people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove'.split(
							' '
						);
					for (h = 0; h < l.length; h++) t(b, l[h]);
					var n = 'set set_once union unset remove delete'.split(' ');
					b.get_group = function () {
						function d(p) {
							a[p] = function () {
								b.push([g, [p].concat(Array.prototype.slice.call(arguments, 0))]);
							};
						}
						for (
							var a = {},
								g = ['get_group'].concat(Array.prototype.slice.call(arguments, 0)),
								m = 0;
							m < n.length;
							m++
						)
							d(n[m]);
						return a;
					};
					c._i.push([q, r, f]);
				};
				c.__SV = 1.2;
				var k = e.createElement('script');
				k.type = 'text/javascript';
				k.async = !0;
				k.src =
					'undefined' !== typeof MIXPANEL_CUSTOM_LIB_URL
						? MIXPANEL_CUSTOM_LIB_URL
						: 'file:' === e.location.protocol &&
						    '//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js'.match(/^\/\//)
						  ? 'https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js'
						  : '//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js';
				e = e.getElementsByTagName('script')[0];
				e.parentNode.insertBefore(k, e);
			}
		})(document, window.mixpanel || []);

		mixpanel.init('695b10f0cc23ab0266e16425fcd244cd', {
			autocapture: true,
			record_sessions_percent: 0,
			api_host: 'https://api-eu.mixpanel.com'
		});
	</script>
</svelte:head>
{@render children()}
<SvelteToast />
<CookieConsent />

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}>{locale}</a>
	{/each}
</div>
