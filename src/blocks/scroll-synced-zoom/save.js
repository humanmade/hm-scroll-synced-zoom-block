/**
 * Scroll-Synced Zoom block — saved markup.
 *
 * The saved structure is always three layers — stage > frame > card —
 * regardless of mode. This keeps the DOM (and the view script) consistent;
 * the `is-mode-*` class on the stage decides which layers do anything.
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Serialize the block for the front end.
 *
 * @param {Object} props            Block props.
 * @param {Object} props.attributes Block attributes.
 * @return {Element} The saved element.
 */
export default function Save( { attributes } ) {
	const { mode, zoomLevel, maxCoverage, backdropColor, stageHeight } =
		attributes;

	const blockProps = useBlockProps.save( {
		className: `is-mode-${ mode }`,
		style: {
			'--hm-sz-peak': zoomLevel,
			'--hm-sz-max-coverage': maxCoverage,
			'--hm-sz-backdrop': backdropColor,
			'--hm-sz-stage-height': stageHeight,
		},
	} );

	const innerBlocksProps = useInnerBlocksProps.save( {
		className: 'hm-scroll-synced-zoom__card',
	} );

	return (
		<div { ...blockProps }>
			<div className="hm-scroll-synced-zoom__frame">
				<div { ...innerBlocksProps } />
			</div>
		</div>
	);
}
