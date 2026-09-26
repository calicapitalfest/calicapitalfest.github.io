/**
 * Timing for the little "hint" speech bubbles (hero sun's "Click me!", the
 * nav sun's "MENU!"): each shows for 2s, first after `firstDelay` ms, then
 * again at a random 10–15s after the previous one appeared. The random gap
 * keeps the two bubbles out of step with each other.
 * Call during component init; read `.on` in markup.
 */
const VISIBLE_FOR = 2000;
const EVERY_MIN = 10000;
const EVERY_MAX = 15000;

export function flashBubble(firstDelay: number) {
	let on = $state(false);

	$effect(() => {
		let hideTimer: ReturnType<typeof setTimeout>;
		let nextTimer: ReturnType<typeof setTimeout>;
		const flash = () => {
			on = true;
			hideTimer = setTimeout(() => (on = false), VISIBLE_FOR);
			nextTimer = setTimeout(flash, EVERY_MIN + Math.random() * (EVERY_MAX - EVERY_MIN));
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
