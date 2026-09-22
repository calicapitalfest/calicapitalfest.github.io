/**
 * Timing for the little "hint" speech bubbles (hero sun's "Click me!", the
 * nav sun's "MENU!"): shows 2s after load, then for 1s every 10s.
 * Call during component init; read `.on` in markup.
 */
const FIRST_DELAY = 2000;
const VISIBLE_FOR = 1000;
const EVERY = 10000;

export function flashBubble() {
	let on = $state(false);

	$effect(() => {
		let hideTimer: ReturnType<typeof setTimeout>;
		const flash = () => {
			on = true;
			hideTimer = setTimeout(() => (on = false), VISIBLE_FOR);
		};
		let repeat: ReturnType<typeof setInterval>;
		const first = setTimeout(() => {
			flash();
			repeat = setInterval(flash, EVERY);
		}, FIRST_DELAY);

		return () => {
			clearTimeout(first);
			clearTimeout(hideTimer);
			clearInterval(repeat);
		};
	});

	return {
		get on() {
			return on;
		}
	};
}
