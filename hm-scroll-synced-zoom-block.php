<?php
/**
 * Plugin Name:       HM Scroll-Synced Zoom Block
 * Description:       A block that scales its contents as they scroll through the viewport, optionally pinning into a modal-style spotlight with a backdrop.
 * Version:           1.0.0
 * Requires at least: 6.7
 * Requires PHP:      8.0
 * Author:            Human Made Limited
 * Author URI:        https://humanmade.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       hm-scroll-synced-zoom-block
 */

namespace HM\ScrollSyncedZoomBlock;

const PLUGIN_PATH = __DIR__;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Bootstrap the plugin.
 */
function bootstrap(): void {
	require_once __DIR__ . '/src/blocks/scroll-synced-zoom/register.php';

	Blocks\ScrollSyncedZoom\bootstrap();
}

add_action( 'plugins_loaded', __NAMESPACE__ . '\\bootstrap' );
