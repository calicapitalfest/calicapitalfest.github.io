<script module lang="ts">
	// Settings tuned on the /animation test page, used on the home page.
	// imgT, textT and speedT are log-scale: the factor is 3^t (33.3% … 300%).
	export const SPHERE_DEFAULTS = {
		imgT: 0.37, // 150%
		textT: 0.15, // 118%
		speedT: -0.54, // 55%
		heat: 0.2, // shakes per second
		wobble: 2, // shake distance, px
		rows: 5,
		angle: 25, // drift direction, deg (0 = leftward like the old carousel)
		region: 0, // shrink edge, % beyond (+) or inside (−) the box edge
		noScroll: true, // no dragging
		showText: true,
		gap: -1 // space between titles and sticker, px
	};
	export type SphereSettings = typeof SPHERE_DEFAULTS;
</script>

<script lang="ts">
	// The line-up laid out like the Apple Watch app grid: a honeycomb that
	// drifts like the old hero carousel. Near the edge of a rectangular region
	// the stickers shrink and bunch up, reaching nothing at the edge, so they
	// never get cut off. Each category sits together in one clump.
	import { untrack } from "svelte";
	import { base } from "$app/paths";
	import { invitados, nacionales, regionales, staff } from "./lineup";

	type Person = { name: string; src: string; tilt: number; size: number };
	const group = (title: string, sub: string, list: Person[]) => list.map((p) => ({ ...p, title, sub }));
	// 0–2 internacional, 3–6 nacional, 7–11 regional, 12 head judge,
	// 13–15 battle judges, 16–18 DJs, 19 hosts
	const people = [
		...group("Internacional", "Line Up", invitados),
		...group("Nacional", "Line Up", nacionales),
		...group("Regional", "Line Up", regionales),
		...staff.flatMap((g) => group(g.title, g.sub, g.list))
	];

	// Seating chart: everyone once, each category in one clump, on a
	// 5 × 4 patch of the honeycomb (odd rows sit half a step right). The
	// patch repeats over the whole plane, shifted 2 columns every 4 rows so
	// copies of a person land as far apart as 20 seats allow.
	const PATCH = [
		[3, 4, 7, 8, 9], //       nacional · regional
		[5, 6, 0, 10, 11], //     nacional · internacional · regional
		[12, 13, 1, 2, 16], //    judges · internacional · DJ
		[14, 15, 17, 18, 19] //   judges · DJs · hosts
	];
	const PATCH_W = 5;
	const PATCH_H = 4;
	const PATCH_SHIFT = 2;
	const seat = (C: number, R: number) => {
		const m = Math.floor(R / PATCH_H);
		return PATCH[R - m * PATCH_H][mod(C - m * PATCH_SHIFT, PATCH_W)];
	};
	// where the internacional clump's middle is, in grid steps: the start view
	const START = { x: -2.5, y: -5 / 3 };

	// carousel drift speed (Hero.svelte WHEEL_SPEED), px per second
	const BASE_SPEED = 35;
	// stickers and titles start at 40% of their size in the carousel
	const START_SCALE = 0.4;
	const HOLD_MS = 3000;

	const D = SPHERE_DEFAULTS;
	let {
		imgT = D.imgT,
		textT = D.textT,
		speedT = D.speedT,
		heat = D.heat,
		wobble = D.wobble,
		rows = D.rows,
		angle = D.angle,
		region = D.region,
		noScroll = D.noScroll,
		showText = D.showText,
		gap = D.gap
	}: Partial<SphereSettings> = $props();
	const fac = (t: number) => Math.pow(3, t);
	function mod(a: number, n: number) {
		return ((a % n) + n) % n;
	}

	let box: HTMLDivElement;
	let W = $state(0);
	let H = $state(0);
	let vw = $state(390);

	// carousel sizes at this screen width (narrow-screen rules in Hero.svelte)
	const clamp = (min: number, v: number, max: number) => Math.min(max, Math.max(min, v));
	const stageH = $derived(Math.min(0.246 * vw, 113) * 1.82);
	const imgH = $derived(stageH * START_SCALE * fac(imgT));
	const titlePx = $derived(clamp(22.4, 0.05 * vw, 38.4) * START_SCALE * fac(textT));
	const subPx = $derived(clamp(20.8, 0.038 * vw, 32.8) * START_SCALE * fac(textT));

	// The shrink region: a rectangle, half-sizes hw × hh. Inside it, a sticker
	// keeps its full size until it is `band` px from the edge; across the band
	// it shrinks in step with its distance to the edge. The band is at least
	// half a sticker, so a sticker never pokes past the edge.
	const hwBox = $derived((W / 2) * (1 + region / 100));
	const hh = $derived((H / 2) * (1 + region / 100));
	const band = $derived(
		Math.max(
			0.7 * imgH + (showText ? (titlePx + subPx) / 2 : 0) + wobble,
			0.2 * Math.min(hwBox, hh)
		)
	);
	// flat length (before squeezing) that fits across the region on one axis:
	// the band takes (π/2)·band of flat length
	const flat = (half: number) => 2 * Math.max(0, half - band) + Math.PI * band;
	// `rows` rows fit top to bottom
	const pitchY = $derived(Math.max(1, flat(hh) / rows));
	const pitchX = $derived(pitchY * 1.15);
	// On wide screens the region gets no wider than one seating-chart patch
	// (a bit under PATCH_W columns), so nobody shows twice in a row.
	const hwMax = $derived((0.95 * PATCH_W * pitchX - Math.PI * band) / 2 + band);
	const hw = $derived(Math.min(hwBox, hwMax));
	// spots: enough to cover the region plus a spare ring, wrapped both ways
	// (an even row count keeps the half-step rows lined up across the wrap)
	const nRows = $derived(rows + 2 + (rows % 2));
	const nCols = $derived(Math.max(2, Math.ceil(flat(hw) / pitchX) + 2));
	const cells = $derived(
		Array.from({ length: nRows * nCols }, (_, i) => ({ r: Math.floor(i / nCols), c: i % nCols }))
	);
	// who is on each spot right now (from the seating chart)
	let assign = $state<number[]>([]);
	const els: HTMLElement[] = [];

	$effect(() => {
		const measure = () => {
			W = box.clientWidth;
			H = box.clientHeight;
			vw = window.innerWidth;
		};
		// untracked, so moving a slider doesn't rerun this setup
		untrack(measure);
		// load every sticker up front, so a spot that changes person swaps
		// its picture at once instead of showing the old one under the new title
		for (const p of people) new Image().src = `${base}/assets/lineup/trim/${p.src}`;
		const ro = new ResizeObserver(measure);
		ro.observe(box);
		// only animate while on screen; hold still with reduced motion
		let visible = true;
		const io = new IntersectionObserver((e) => (visible = e.some((en) => en.isIntersecting)));
		io.observe(box);
		const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

		// offset of the grid, in grid steps (so resizing keeps the view), and drag state
		let ox = START.x;
		let oy = START.y;
		let holdUntil = 0;
		let drag: { id: number; x: number; y: number } | null = null;
		const down = (e: PointerEvent) => {
			if (noScroll) return;
			drag = { id: e.pointerId, x: e.clientX, y: e.clientY };
			box.setPointerCapture(e.pointerId);
		};
		const move = (e: PointerEvent) => {
			if (!drag || e.pointerId !== drag.id) return;
			ox += (e.clientX - drag.x) / pitchX;
			oy += (e.clientY - drag.y) / pitchY;
			drag.x = e.clientX;
			drag.y = e.clientY;
		};
		// only a drag of the sphere pauses it; scrolling the page past it doesn't
		const up = (e: PointerEvent) => {
			if (!drag || e.pointerId !== drag.id) return;
			drag = null;
			holdUntil = performance.now() + HOLD_MS;
		};
		box.addEventListener("pointerdown", down);
		box.addEventListener("pointermove", move);
		box.addEventListener("pointerup", up);
		box.addEventListener("pointercancel", up);

		// Squeeze one axis: flat offset u (px from the centre) → shown offset
		// and size factor. Linear up to the band; across it, positions follow a
		// sine so they bunch up, and the size falls with the distance to the edge.
		// Returns null past the edge.
		const SQ = { pos: 0, size: 1 };
		const squeeze = (u: number, half: number) => {
			const inner = Math.max(0, half - band);
			const a = Math.abs(u);
			if (a <= inner) {
				SQ.pos = u;
				SQ.size = 1;
				return true;
			}
			const e = (a - inner) / band;
			if (e >= Math.PI / 2) return false;
			const sin = Math.sin(e);
			SQ.pos = Math.sign(u) * (inner + band * sin);
			SQ.size = 1 - sin;
			return true;
		};

		// each sticker shakes out of step with the others: random phases,
		// and slightly different rates for x, y and rotation
		const phases = Array.from({ length: 3 * 400 }, () => Math.random() * 2 * Math.PI);
		let vib = 0;
		let raf = 0;
		let last = performance.now();
		const frame = (t: number) => {
			raf = requestAnimationFrame(frame);
			const dt = Math.min(t - last, 50);
			last = t;
			if (!visible) return;
			if (!drag && t > holdUntil && !reduce) {
				// 0° drifts like the carousel (content moving left); angles turn counter-clockwise
				const v = (BASE_SPEED * fac(speedT) * dt) / 1000;
				const a = (angle * Math.PI) / 180;
				ox -= (v * Math.cos(a)) / pitchX;
				oy -= (v * Math.sin(a)) / pitchY;
			}
			const n = cells.length;
			if (assign.length !== n) assign = new Array(n).fill(0);
			vib += (2 * Math.PI * heat * dt) / 1000;
			const amp = reduce ? 0 : wobble;
			for (let i = 0; i < n; i++) {
				const el = els[i];
				if (!el) continue;
				const { r, c } = cells[i];
				// position in grid steps, wrapped around the centre
				const gx = c + (r % 2) / 2 + ox;
				const gy = r + oy;
				const kx = Math.floor((gx + nCols / 2) / nCols);
				const ky = Math.floor((gy + nRows / 2) / nRows);
				// the seat this spot is over right now
				const who = seat(c - kx * nCols, r - ky * nRows);
				if (assign[i] !== who) assign[i] = who;

				if (!squeeze((gx - kx * nCols) * pitchX, hw)) {
					el.style.opacity = "0";
					continue;
				}
				let x = SQ.pos;
				let s = SQ.size;
				if (!squeeze((gy - ky * nRows) * pitchY, hh)) {
					el.style.opacity = "0";
					continue;
				}
				let y = SQ.pos;
				s = Math.min(s, SQ.size);
				let rot = 0;
				if (amp && heat) {
					const k = (3 * i) % phases.length;
					// the shake shrinks with the sticker, so it can't poke past the edge
					x += Math.sin(vib + phases[k]) * amp * s;
					y += Math.sin(vib * 1.13 + phases[k + 1]) * amp * s;
					rot = Math.sin(vib * 0.87 + phases[k + 2]) * amp * 0.5;
					// size pulses at the heat rate too, more toward the edge
					// (up to ±25% at full wobble)
					s *= 1 + Math.sin(vib * 0.71 + phases[k]) * (amp / 10) * 0.25 * (1 - s);
				}
				el.style.opacity = String(Math.min(1, s * 4));
				el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${s}) rotate(${rot}deg)`;
			}
		};
		raf = requestAnimationFrame(frame);

		return () => {
			cancelAnimationFrame(raf);
			ro.disconnect();
			io.disconnect();
			box.removeEventListener("pointerdown", down);
			box.removeEventListener("pointermove", move);
			box.removeEventListener("pointerup", up);
			box.removeEventListener("pointercancel", up);
		};
	});
</script>

<div
	class="sphere"
	class:is-draggable={!noScroll}
	bind:this={box}
	aria-hidden="true"
	style:--img-h="{imgH}px"
	style:--title="{titlePx}px"
	style:--sub="{subPx}px"
	style:--gap="{gap}px"
>
	{#each cells as _, i (i)}
		{@const p = people[assign[i] ?? i % people.length]}
		<!-- data-*: read by the Preloader to place its figures on the stickers -->
		<div
			class="sphere__item"
			bind:this={els[i]}
			data-title={showText ? p.title : undefined}
			data-sub={showText ? p.sub : undefined}
		>
			{#if showText}
				<span class="sphere__title">{p.title}</span>
				<span class="sphere__sub">{p.sub}</span>
			{/if}
			<img
				class="sphere__img"
				src="{base}/assets/lineup/trim/{p.src}"
				alt=""
				draggable="false"
				style:--tilt="{p.tilt}deg"
			/>
		</div>
	{/each}
</div>

<style>
	.sphere {
		position: relative;
		/* the settings were tuned for this height */
		height: var(--sphere-h, calc((100svh - var(--nav-h)) * 2 / 3));
		overflow: hidden;
		user-select: none;
	}
	.sphere.is-draggable {
		touch-action: none;
		cursor: grab;
	}
	.sphere__item {
		position: absolute;
		left: 50%;
		top: 50%;
		display: flex;
		flex-direction: column;
		align-items: center;
		will-change: transform, opacity;
		opacity: 0;
	}
	/* titles over the stickers */
	.sphere__title,
	.sphere__sub {
		position: relative;
		z-index: 1;
		white-space: nowrap;
		line-height: 1;
	}
	.sphere__title {
		font-family: var(--font-display);
		font-weight: 950;
		font-size: var(--title);
		letter-spacing: 0.02em;
		text-transform: uppercase;
		color: var(--c-text);
	}
	.sphere__sub {
		font-family: var(--font-subtitle);
		font-size: var(--sub);
		letter-spacing: 0.02em;
		color: var(--c-pink);
		margin-bottom: var(--gap);
	}
	.sphere__img {
		/* trimmed copies (assets/lineup/trim): the artwork fills the file, so
		   one height fits all; 0.9 matches the artwork height in the old carousel */
		height: calc(var(--img-h) * 0.9);
		width: auto;
		max-width: none;
		rotate: var(--tilt, 0deg);
		pointer-events: none;
	}
</style>
