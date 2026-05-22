<?php
/**
 * Scroll-Synced Zoom block registration.
 */

namespace HM\ScrollSyncedZoomBlock\Blocks\ScrollSyncedZoom;

use const HM\ScrollSyncedZoomBlock\PLUGIN_PATH;

/**
 * Set up the block.
 */
function bootstrap(): void {
	add_action( 'init', __NAMESPACE__ . '\\register_block' );
}

/**
 * Register the Scroll-Synced Zoom block from its compiled metadata.
 */
function register_block(): void {
	register_block_type( PLUGIN_PATH . '/build/blocks/scroll-synced-zoom/block.json' );
}
