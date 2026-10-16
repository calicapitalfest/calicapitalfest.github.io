<script lang="ts">
	import "../app.css";
	import { afterNavigate } from "$app/navigation";
	import { trackPageview } from "$lib/analytics/tracker";

	let { children } = $props();

	// the dashboard itself is not tracked
	afterNavigate(({ to }) => {
		if (to?.url && !to.url.pathname.startsWith("/stats")) trackPageview(to.url);
	});
</script>

{@render children()}
