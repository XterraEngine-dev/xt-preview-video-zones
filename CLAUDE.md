# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`xt-video-preview` is a Vue 3 + Vite application for rendering multi-layout video campaigns from PocketBase. It displays campaigns containing multiple layouts with synchronized video/image playback across zones, with support for labels and background shapes.

## Development Commands

- **Install dependencies**: `npm install`
- **Start dev server**: `npm run dev` - Starts Vite dev server with hot-reload (default: http://localhost:5173)
- **Build for production**: `npm run build` - Compiles and minifies for production
- **Preview production build**: `npm run preview` - Preview the production build locally

## PocketBase Setup

The app connects to PocketBase at `https://pocket.xterraengine.com` with credentials:
- Email: `admin@xterraengine.com`
- Password: `admin123`

Update these in `src/services/pocketbase.js` if needed.

## Architecture

### Build System
- Vite as build tool and dev server
- Vue 3 with Composition API (`<script setup>`)
- PocketBase SDK for backend communication
- Vue DevTools plugin enabled in development

### Path Aliases
- `@` maps to `./src` directory (vite.config.js:14-17)

### Core Components

1. **CampaignPlayer** (`src/components/CampaignPlayer.vue`)
   - Main component that loads campaigns from PocketBase
   - Manages layout transitions with auto-advance based on media duration
   - Handles authentication and error states

2. **LayoutRenderer** (`src/components/LayoutRenderer.vue`)
   - Renders individual layouts with their zone configurations
   - Displays labels and background shapes from metadata
   - Applies 14 different layout types (full-screen, splits, grids, etc.)

3. **MediaZone** (`src/components/MediaZone.vue`)
   - Handles video/image playback in individual zones
   - Auto-advances through media items based on duration
   - Supports looping within zone assignments

### Services

- **pocketbase.js** - PocketBase connection, authentication, and data fetching (campaigns, layouts)
- **layoutConfigs.js** - Zone configurations for 14 layout types with Tailwind classes

### Layout System

14 layout types supported:
- **Básicos**: full-screen, vertical-split, horizontal-split
- **Tres Zonas**: three-vertical, three-horizontal
- **Asimétricos**: main-left, main-right, main-top, main-bottom
- **Complejos**: two-top-one-bottom, one-top-two-bottom, two-left-one-right, one-left-two-right, grid-2x2

### Data Flow

1. Campaign loaded from PocketBase (contains array of layout IDs)
2. Layouts fetched by IDs (contain metadata with configuration)
3. Metadata includes:
   - Layout type
   - Video assignments (zone → media mappings)
   - Labels (text overlays with positioning/styling)
   - Background shapes (rectangles, circles, triangles)
4. Each layout renders until longest media sequence completes
5. Transitions to next layout (hard cut, no animation)

### PocketBase Collections

- **campaigns** - Campaign records with `layouts` field (array of layout IDs)
- **layouts** - Layout records with `metadata` field (JSON with LayoutConfiguration)
- **users** - User authentication

### Usage

Set campaign ID in `src/App.vue:6`:
```javascript
const campaignId = ref('YOUR_CAMPAIGN_ID');
```

### Node Version
Requires Node.js `^20.19.0 || >=22.12.0`