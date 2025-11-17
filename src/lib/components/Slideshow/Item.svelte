<script lang="ts">
	export let event: string = ""; // "Taller Nacional", "Taller Local", etc.
	export let title: string;
	export let subtitle: string = "";
	export let time: string;
	export let color: string = "#B857FF"; // Default purple
	export let description: string = ""; // Optional extra description
	export let bg_color: string = ""; // Custom background color (e.g., "bg-gradient-to-r from-yellow-600/30 to-orange-600/30")

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
	const bgClass = bg_color || 'bg-black/10';
</script>

<div class="backdrop-blur-sm rounded-xl p-3 md:p-4 {bgClass}">
	<div class="flex justify-between items-center gap-3">
		<div class="flex-1 min-w-0">
			{#if description}
				<h4 class="text-base md:text-lg font-bold text-white mb-2">{title}</h4>
				<p class="text-white/90 mb-3 text-xs md:text-sm text-justify">{description}</p>
			{/if}
			
			{#if event}
				<p style="color: {textColor}" class="text-xs font-semibold mb-1">{event}</p>
			{/if}
			
			{#if title && !description}
				<h4 class="text-base md:text-lg font-bold text-white">{title}</h4>
			{/if}
			
			{#if subtitle && !description}
				<p class="text-white/80 text-sm">{subtitle}</p>
			{:else if subtitle && description}
				<h5 class="text-sm md:text-base font-bold text-white">{subtitle}</h5>
			{/if}
			
			{#if !title && subtitle}
				<h4 class="text-base md:text-lg font-bold text-white">{subtitle}</h4>
			{/if}
		</div>
		
		<span 
			style="background-color: {color}" 
			class="text-white px-3 py-1 md:px-4 md:py-2 rounded-full font-bold text-xs md:text-sm whitespace-nowrap flex-shrink-0 self-center"
		>{time}</span>
	</div>
</div>