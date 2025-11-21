<script lang="ts">
	export let date: string; // Format: "18/11/2025"
	export let title: string;
	export let subtitle: string;
	export let badge: string = "GRATIS";
	export let badge_color: string = "green";

	// Extract day and month from date
	const [day, month, year] = date.split('/');
	
	// Month names in Spanish
	const monthNames = [
		'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
		'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
	];
	
	// Day names in Spanish
	const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
	
	const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
	const dayName = dayNames[dateObj.getDay()];
	const monthName = monthNames[parseInt(month) - 1];

	const badgeColors = {
		green: 'bg-green-500',
		blue: 'bg-blue-500',
		purple: 'bg-[#F04E40]',
		yellow: 'bg-yellow-500',
		red: 'bg-red-500',
		pink: 'bg-pink-500'
	};

	const badgeClass = badgeColors[badge_color as keyof typeof badgeColors] || badgeColors.green;
</script>

<div class="relative flex items-center justify-between gap-2 mb-6">
	<div class="flex-shrink-0">
		<h2 class="text-lg md:text-2xl font-bold text-white">{dayName}</h2>
		<h1 class="text-5xl md:text-7xl font-bold text-white mb-1">{day}</h1>
		<p class="text-white/80 text-sm md:text-base mt-1 font-bold">DE {monthName}</p>
	</div>
	<div class="absolute right-0 top-0 flex flex-col items-end justify-center pr-2 md:pr-4">
		<h3 class="text-lg md:text-2xl font-bold text-white mb-1 text-right">{title}</h3>
		<p class="text-white/90 text-sm md:text-base mb-2 text-right font-bold">{subtitle}</p>
		<span class="inline-block {badgeClass} text-white px-3 py-1 rounded-full text-xs md:text-sm font-bold">{badge}</span>
	</div>
</div>