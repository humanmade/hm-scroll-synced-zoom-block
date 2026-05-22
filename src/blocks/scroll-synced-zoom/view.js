/**
 * Scroll-Synced Zoom block — front-end fallback.
 *
 * Runs only in browsers that lack native `animation-timeline: view()`
 * support (Firefox as of 2026). Computes scroll progress per block and
 * writes `--hm-sz-scale` (and, for modal mode, `--hm-sz-backdrop-opacity`)
 * that view.css reads. Native-support browsers skip this entirely and use
 * the @keyframes path.
 *
 * Keyframe stops here MUST stay in sync with the @keyframes in view.css.
 */

import './view.css';

const HAS_NATIVE_TIMELINE =
	window.CSS &&
	window.CSS.supports &&
	window.CSS.supports( 'animation-timeline: view()' );

const PREFERS_REDUCED_MOTION =
	window.matchMedia &&
	window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

if ( ! HAS_NATIVE_TIMELINE && ! PREFERS_REDUCED_MOTION ) {
	/**
	 * Interpolate a value from sorted [offset, value] stops at progress t.
	 *
	 * @param {number[][]} stops Sorted [offset, value] pairs.
	 * @param {number}     t     Progress, 0–1.
	 * @return {number} The interpolated value.
	 */
	const lerpStops = ( stops, t ) => {
		if ( t <= stops[ 0 ][ 0 ] ) {
			return stops[ 0 ][ 1 ];
		}
		for ( let i = 1; i < stops.length; i++ ) {
			const [ offset, value ] = stops[ i ];
			if ( t <= offset ) {
				const [ prevOffset, prevValue ] = stops[ i - 1 ];
				const span = offset - prevOffset || 1;
				const local = ( t - prevOffset ) / span;
				return prevValue + ( value - prevValue ) * local;
			}
		}
		return stops[ stops.length - 1 ][ 1 ];
	};

	/**
	 * Scroll progress mirroring `animation-range: cover 0% cover 100%`:
	 * 0 when the element's bottom edge enters the viewport bottom, 1 when
	 * its top edge exits the viewport top.
	 *
	 * @param {DOMRect} rect Element bounding rect.
	 * @return {number} Progress, clamped 0–1.
	 */
	const computeProgress = ( rect ) => {
		const total = window.innerHeight + rect.height;
		if ( total <= 0 ) {
			return 0;
		}
		const traveled = window.innerHeight - rect.top;
		return Math.max( 0, Math.min( 1, traveled / total ) );
	};

	const tracked = new Set();
	let scheduled = false;

	const tick = () => {
		scheduled = false;
		for ( const entry of tracked ) {
			const t = computeProgress(
				entry.timelineEl.getBoundingClientRect()
			);
			const el = entry.styleEl;
			el.style.setProperty(
				'--hm-sz-scale',
				lerpStops( entry.scaleStops, t )
			);
			if ( entry.backdropStops ) {
				el.style.setProperty(
					'--hm-sz-backdrop-opacity',
					lerpStops( entry.backdropStops, t )
				);
			}
		}
	};

	const schedule = () => {
		if ( scheduled ) {
			return;
		}
		scheduled = true;
		window.requestAnimationFrame( tick );
	};

	const init = () => {
		const blocks = document.querySelectorAll(
			'.wp-block-hm-scroll-synced-zoom'
		);

		const io = new window.IntersectionObserver(
			( entries ) => {
				for ( const entry of entries ) {
					const data = entry.target._hmScrollSyncedZoom;
					if ( ! data ) {
						continue;
					}
					if ( entry.isIntersecting ) {
						tracked.add( data );
					} else {
						tracked.delete( data );
					}
				}
				schedule();
			},
			{ rootMargin: '0px' }
		);

		for ( const block of blocks ) {
			const card = block.querySelector( '.hm-scroll-synced-zoom__card' );
			if ( ! card ) {
				continue;
			}
			const isModal = block.classList.contains( 'is-mode-modal' );
			const peak =
				parseFloat(
					window
						.getComputedStyle( block )
						.getPropertyValue( '--hm-sz-peak' )
				) || ( isModal ? 1.25 : 1.15 );

			const data = isModal
				? {
						timelineEl: block,
						// Custom properties set on the block inherit to both
						// the card (scale) and the frame's backdrop pseudo.
						styleEl: block,
						scaleStops: [
							[ 0, 0.85 ],
							[ 0.5, peak ],
							[ 1, 0.85 ],
						],
						backdropStops: [
							[ 0, 0 ],
							[ 0.4, 0.8 ],
							[ 0.6, 0.8 ],
							[ 1, 0 ],
						],
				  }
				: {
						timelineEl: card,
						styleEl: card,
						scaleStops: [
							[ 0, 0.9 ],
							[ 0.5, peak ],
							[ 1, 0.9 ],
						],
						backdropStops: null,
				  };

			// The stage is the timeline anchor in modal mode, the card in
			// zoom mode. Observe whichever drives progress and tag it so
			// the IntersectionObserver callback can find its data.
			data.timelineEl._hmScrollSyncedZoom = data;
			io.observe( data.timelineEl );
		}

		window.addEventListener( 'scroll', schedule, { passive: true } );
		window.addEventListener( 'resize', schedule, { passive: true } );
		schedule();
	};

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init, { once: true } );
	} else {
		init();
	}
}
