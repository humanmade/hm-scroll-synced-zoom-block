# HM Scroll-Synced Zoom Block

A lightweight WordPress block that scales its contents as they scroll through the viewport. It can run as a subtle "zoom on focus" effect, or as a "modal" effect where the content pins to the centre of the screen and zooms up behind a dimmed backdrop.

## Features

- Two modes from a single block: **Zoom on focus** and **Zoom + modal backdrop**.
- Wraps any blocks or patterns — drop in a video, an image, a card, anything.
- Adjustable peak zoom level, backdrop colour, and scroll travel.
- Built on native CSS scroll-driven animations (`animation-timeline: view()`) — GPU-accelerated, no JavaScript on supporting browsers.
- Automatic JavaScript fallback for browsers without native support (Firefox as of 2026).
- Respects `prefers-reduced-motion`.
- Assets load only on pages that use the block.

## Installation

1. Download the plugin zip file.
2. In your WordPress admin panel, go to Plugins > Add New.
3. Click "Upload Plugin" and choose the downloaded zip file.
4. Click "Install Now" and then "Activate" the plugin.

## Usage

1. In the WordPress editor, add a new block and search for "Scroll-Synced Zoom".
2. Add whatever content you want inside it.
3. In the block settings, choose a mode:
   - **Zoom on focus** — the content scales up as it crosses the viewport centre, then back down.
   - **Zoom + modal backdrop** — the content pins to the viewport centre and zooms up while a backdrop dims the rest of the page.
4. Adjust the peak zoom level, and (for modal mode) the backdrop colour and scroll travel.

## Browser support

Modes are powered by CSS scroll-driven animations where available (Chrome, Edge, Safari 17.6+). In browsers without native support, a small bundled script reproduces the effect. In browsers with neither, and for visitors who prefer reduced motion, the content simply renders at its normal size.

## Development

```sh
npm install
npm run start   # watch + rebuild
npm run build   # production build
```

The build output in `build/` is git-ignored on `main`; the GitHub Actions workflow compiles it onto the `release` branch for distribution.

## License

GPL-2.0-or-later
