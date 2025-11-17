<script lang="ts">
	export let event: string = ""; // "Taller Nacional", "Taller Local", etc.
	export let title: string;
	export let subtitle: string = "";
	export let time: string;
	export let color: string = "#9810FA"; // Default purple
	export let description: string = ""; // Optional extra description
	export let highlight: boolean = false; // Special highlight styling

	// Convert hex color to RGB for text color
	function hexToRgb(hex: string) {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : { r: 152, g: 16, b: 250 };
	}

	const rgb = hexToRgb(color);
	const textColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
</script>

<div 
	class="backdrop-blur-sm rounded-xl p-2 border border-white/20 {highlight ? 'bg-gradient-to-r from-yellow-600/30 to-orange-600/30 border-yellow-500/30' : 'bg-white/10'}"
>
	{#if description && highlight}
		<h4 class="text-xl md:text-2xl font-bold text-white mb-3">{title}</h4>
		<p class="text-white/90 mb-4 text-sm md:text-base">{description}</p>
		<div class="flex justify-between items-center flex-wrap gap-2">
			<div>
				{#if subtitle}
					<h5 class="text-lg font-bold text-white">{subtitle}</h5>
				{/if}
				{#if event}
					<p style="color: {textColor}" class="text-sm font-semibold">{event}</p>
				{/if}
			</div>
			<span style="background-color: {color}" class="text-white px-4 py-2 rounded-full font-bold">{time}</span>
		</div>
	{:else if !event && !subtitle}
		<!-- Simple registration/info item -->
		<p class="text-white/90 text-lg">{title}</p>
	{:else}
		<!-- Regular event item -->
		<div class="flex justify-between items-center flex-wrap gap-2">
			<div>
				{#if event}
					<p style="color: {textColor}" class="text-sm font-semibold">{event}</p>
				{/if}
				<h4 class="text-xl md:text-2xl font-bold text-white">{title}</h4>
				{#if subtitle}
					<p class="text-white/80">{subtitle}</p>
				{/if}
			</div>
			<span style="background-color: {color}" class="text-white px-4 py-2 rounded-full font-bold">{time}</span>
		</div>
	{/if}
</div>