/**
 * Scroll-Synced Zoom block — editor interface.
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	PanelColorSettings,
} from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl } from '@wordpress/components';

const DEFAULT_BACKDROP = '#000000bf';

/**
 * Normalise a colour string to 8-digit hex (#rrggbbaa).
 *
 * The backdrop colour is stored as an inline CSS custom property. WordPress'
 * KSES filter strips custom-property values that contain `rgb()/rgba()`, so
 * the colour must be serialised as parens-free hex to survive an editor save.
 *
 * @param {string} color A hex or rgb()/rgba() colour string.
 * @return {string} An 8-digit hex colour, or the default if unparseable.
 */
const toHex8 = ( color ) => {
	if ( ! color ) {
		return DEFAULT_BACKDROP;
	}
	if ( color.startsWith( '#' ) ) {
		let hex = color.slice( 1 );
		if ( hex.length === 3 ) {
			hex = [ ...hex ].map( ( c ) => c + c ).join( '' ) + 'ff';
		} else if ( hex.length === 4 ) {
			hex = [ ...hex ].map( ( c ) => c + c ).join( '' );
		} else if ( hex.length === 6 ) {
			hex += 'ff';
		}
		return `#${ hex }`;
	}
	const match = color.match( /rgba?\(([^)]+)\)/ );
	if ( match ) {
		const parts = match[ 1 ].split( ',' ).map( ( s ) => s.trim() );
		const channel = ( n ) =>
			Math.max( 0, Math.min( 255, Math.round( n ) ) )
				.toString( 16 )
				.padStart( 2, '0' );
		const [ r, g, b ] = parts.map( Number );
		const alpha =
			parts[ 3 ] !== undefined
				? channel( parseFloat( parts[ 3 ] ) * 255 )
				: 'ff';
		return `#${ channel( r ) }${ channel( g ) }${ channel( b ) }${ alpha }`;
	}
	return DEFAULT_BACKDROP;
};

/**
 * Render the block's editor interface.
 *
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Attribute setter.
 * @return {Element} The editor element.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { mode, zoomLevel, maxCoverage, backdropColor, stageHeight } =
		attributes;
	const isModal = mode === 'modal';

	const blockProps = useBlockProps( {
		className: `is-mode-${ mode }`,
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'hm-scroll-synced-zoom__card' },
		{ templateLock: false }
	);

	const stageHeightValue = parseInt( stageHeight, 10 ) || 100;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'Scroll effect',
						'hm-scroll-synced-zoom-block'
					) }
				>
					<SelectControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={ __( 'Mode', 'hm-scroll-synced-zoom-block' ) }
						help={
							isModal
								? __(
										'Content pins to the centre of the viewport and zooms up behind a dimmed backdrop.',
										'hm-scroll-synced-zoom-block'
								  )
								: __(
										'Content scales up as it crosses the viewport centre, then back down.',
										'hm-scroll-synced-zoom-block'
								  )
						}
						value={ mode }
						options={ [
							{
								label: __(
									'Zoom on focus',
									'hm-scroll-synced-zoom-block'
								),
								value: 'zoom',
							},
							{
								label: __(
									'Zoom + modal backdrop',
									'hm-scroll-synced-zoom-block'
								),
								value: 'modal',
							},
						] }
						onChange={ ( next ) => setAttributes( { mode: next } ) }
					/>
					<RangeControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={ __(
							'Peak zoom',
							'hm-scroll-synced-zoom-block'
						) }
						help={ __(
							'How large the content grows at the centre of the effect.',
							'hm-scroll-synced-zoom-block'
						) }
						value={ zoomLevel }
						min={ 1 }
						max={ 1.6 }
						step={ 0.05 }
						onChange={ ( next ) =>
							setAttributes( { zoomLevel: next ?? 1.15 } )
						}
					/>
					<RangeControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={ __(
							'Max viewport coverage (%)',
							'hm-scroll-synced-zoom-block'
						) }
						help={ __(
							'Caps the content size so that, at peak zoom, it never exceeds this share of the viewport.',
							'hm-scroll-synced-zoom-block'
						) }
						value={ maxCoverage }
						min={ 50 }
						max={ 100 }
						step={ 5 }
						onChange={ ( next ) =>
							setAttributes( { maxCoverage: next ?? 90 } )
						}
					/>
					{ isModal && (
						<RangeControl
							__nextHasNoMarginBottom
							__next40pxDefaultSize
							label={ __(
								'Scroll travel (vh)',
								'hm-scroll-synced-zoom-block'
							) }
							help={ __(
								'100 keeps the section one screen tall. Higher values pin the content at the centre for longer.',
								'hm-scroll-synced-zoom-block'
							) }
							value={ stageHeightValue }
							min={ 100 }
							max={ 300 }
							step={ 10 }
							onChange={ ( next ) =>
								setAttributes( {
									stageHeight: `${ next ?? 100 }vh`,
								} )
							}
						/>
					) }
				</PanelBody>
			</InspectorControls>
			{ isModal && (
				<InspectorControls>
					<PanelColorSettings
						__experimentalIsRenderedInSidebar
						title={ __(
							'Backdrop',
							'hm-scroll-synced-zoom-block'
						) }
						colorSettings={ [
							{
								value: backdropColor,
								onChange: ( next ) =>
									setAttributes( {
										backdropColor: toHex8( next ),
									} ),
								label: __(
									'Backdrop color',
									'hm-scroll-synced-zoom-block'
								),
								enableAlpha: true,
							},
						] }
					/>
				</InspectorControls>
			) }
			<div { ...blockProps }>
				<div className="hm-scroll-synced-zoom__frame">
					<div { ...innerBlocksProps } />
				</div>
			</div>
		</>
	);
}
