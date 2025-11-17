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
		purple: 'bg-purple-500',
		yellow: 'bg-yellow-500',
		red: 'bg-red-500',
		pink: 'bg-pink-500'
	};

	const badgeClass = badgeColors[badge_color as keyof typeof badgeColors] || badgeColors.green;
</script>

<div class="flex items-center justify-between flex-wrap gap-1 mb-8">
	<div class="">
		<h2 class="text-2xl md:text-4xl font-bold text-white">{dayName}</h2>
		<h1 class="text-7xl md:text-9xl font-bold text-white mb-2">{day}</h1>
		<p class="text-white/80 text-lg mt-2">DE {monthName}</p>
	</div>
	<div class="flex flex-col items-end justify-center">
		<h3 class="text-2xl md:text-3xl font-bold text-white mb-2">{title}</h3>
		<p class="text-white/90 text-lg mb-2">{subtitle}</p>
		<span class="inline-block {badgeClass} text-white px-4 py-2 rounded-full text-sm font-bold">{badge}</span>
	</div>
</div>