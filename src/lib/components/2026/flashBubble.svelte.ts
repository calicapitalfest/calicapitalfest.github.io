/**
 * Timing for the nav sun's "MENU!" speech bubble: first shown after
 * `firstDelay` ms, then on for 2s, off for 2s, over and over.
 * Call during component init; read `.on` in markup.
 */
const VISIBLE_FOR = 2000;
const HIDDEN_FOR = 2000;

export function flashBubble(firstDelay: number) {
	let on = $state(false);

	$effect(() => {
		let hideTimer: ReturnType<typeof setTimeout>;
		let nextTimer: ReturnType<typeof setTimeout>;
		const flash = () => {
			on = true;
			hideTimer = setTimeout(() => (on = false), VISIBLE_FOR);
			nextTimer = setTimeout(flash, VISIBLE_FOR + HIDDEN_FOR);
		};
		nextTimer = setTimeout(flash, firstDelay);

		return () => {
			clearTimeout(hideTimer);
			clearTimeout(nextTimer);
		};
	});

	return {
		get on() {
			return on;
		}
	};
}
