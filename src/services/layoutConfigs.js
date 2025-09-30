/**
 * Layout configurations for all 14 layout types
 * Each layout defines zones with their positioning and sizing
 */

/**
 * @typedef {import('../types/index.js').ZoneConfig} ZoneConfig
 */

// Canvas dimensions (matching Android TV)
const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

/**
 * Helper function to convert percentage to pixels
 */
function toPixels(widthPercent, heightPercent) {
  return {
    width: `${Math.round((widthPercent / 100) * CANVAS_WIDTH)}px`,
    height: `${Math.round((heightPercent / 100) * CANVAS_HEIGHT)}px`
  };
}

/**
 * Get zone configurations for a specific layout type
 * @param {string} layoutType
 * @returns {ZoneConfig[]}
 */
export function getLayoutZones(layoutType) {
  const configs = {
    // ===== BÁSICOS (3) =====
    'full-screen': [
      {
        id: 'zone-1',
        style: toPixels(100, 100),
        size: { width: 100, height: 100, position: 'fullscreen', index: 0, total: 1 }
      }
    ],

    'vertical-split': [
      {
        id: 'zone-1',
        style: toPixels(50, 100),
        size: { width: 50, height: 100, position: 'split-vertical', index: 0, total: 2 }
      },
      {
        id: 'zone-2',
        style: toPixels(50, 100),
        size: { width: 50, height: 100, position: 'split-vertical', index: 1, total: 2 }
      }
    ],

    'horizontal-split': [
      {
        id: 'zone-1',
        style: toPixels(100, 50),
        size: { width: 100, height: 50, position: 'split-horizontal', index: 0, total: 2 }
      },
      {
        id: 'zone-2',
        style: toPixels(100, 50),
        size: { width: 100, height: 50, position: 'split-horizontal', index: 1, total: 2 }
      }
    ],

    // ===== TRES ZONAS (2) =====
    'three-vertical': [
      {
        id: 'zone-1',
        style: toPixels(33.33, 100),
        size: { width: 33.33, height: 100, position: 'split-vertical', index: 0, total: 3 }
      },
      {
        id: 'zone-2',
        style: toPixels(33.33, 100),
        size: { width: 33.33, height: 100, position: 'split-vertical', index: 1, total: 3 }
      },
      {
        id: 'zone-3',
        style: toPixels(33.33, 100),
        size: { width: 33.33, height: 100, position: 'split-vertical', index: 2, total: 3 }
      }
    ],

    'three-horizontal': [
      {
        id: 'zone-1',
        style: toPixels(100, 33.33),
        size: { width: 100, height: 33.33, position: 'split-horizontal', index: 0, total: 3 }
      },
      {
        id: 'zone-2',
        style: toPixels(100, 33.33),
        size: { width: 100, height: 33.33, position: 'split-horizontal', index: 1, total: 3 }
      },
      {
        id: 'zone-3',
        style: toPixels(100, 33.33),
        size: { width: 100, height: 33.33, position: 'split-horizontal', index: 2, total: 3 }
      }
    ],

    // ===== ASIMÉTRICOS (4) =====
    'main-left': [
      {
        id: 'zone-1',
        style: toPixels(66.67, 100),
        size: { width: 66.67, height: 100, position: 'asymmetric', index: 0, total: 3 }
      },
      {
        id: 'zone-2',
        style: toPixels(33.33, 50),
        size: { width: 33.33, height: 50, position: 'asymmetric', index: 1, total: 3 }
      },
      {
        id: 'zone-3',
        style: toPixels(33.33, 50),
        size: { width: 33.33, height: 50, position: 'asymmetric', index: 2, total: 3 }
      }
    ],

    'main-right': [
      {
        id: 'zone-1',
        style: toPixels(33.33, 50),
        size: { width: 33.33, height: 50, position: 'asymmetric', index: 0, total: 3 }
      },
      {
        id: 'zone-2',
        style: toPixels(33.33, 50),
        size: { width: 33.33, height: 50, position: 'asymmetric', index: 1, total: 3 }
      },
      {
        id: 'zone-3',
        style: toPixels(66.67, 100),
        size: { width: 66.67, height: 100, position: 'asymmetric', index: 2, total: 3 }
      }
    ],

    'main-top': [
      {
        id: 'zone-1',
        style: toPixels(100, 66.67),
        size: { width: 100, height: 66.67, position: 'asymmetric', index: 0, total: 3 }
      },
      {
        id: 'zone-2',
        style: toPixels(50, 33.33),
        size: { width: 50, height: 33.33, position: 'asymmetric', index: 1, total: 3 }
      },
      {
        id: 'zone-3',
        style: toPixels(50, 33.33),
        size: { width: 50, height: 33.33, position: 'asymmetric', index: 2, total: 3 }
      }
    ],

    'main-bottom': [
      {
        id: 'zone-1',
        style: toPixels(50, 33.33),
        size: { width: 50, height: 33.33, position: 'asymmetric', index: 0, total: 3 }
      },
      {
        id: 'zone-2',
        style: toPixels(50, 33.33),
        size: { width: 50, height: 33.33, position: 'asymmetric', index: 1, total: 3 }
      },
      {
        id: 'zone-3',
        style: toPixels(100, 66.67),
        size: { width: 100, height: 66.67, position: 'asymmetric', index: 2, total: 3 }
      }
    ],

    // ===== COMPLEJOS (4) =====
    'two-top-one-bottom': [
      {
        id: 'zone-1',
        style: toPixels(50, 50),
        size: { width: 50, height: 50, position: 'complex', index: 0, total: 3 }
      },
      {
        id: 'zone-2',
        style: toPixels(50, 50),
        size: { width: 50, height: 50, position: 'complex', index: 1, total: 3 }
      },
      {
        id: 'zone-3',
        style: toPixels(100, 50),
        size: { width: 100, height: 50, position: 'complex', index: 2, total: 3 }
      }
    ],

    'one-top-two-bottom': [
      {
        id: 'zone-1',
        style: toPixels(100, 50),
        size: { width: 100, height: 50, position: 'complex', index: 0, total: 3 }
      },
      {
        id: 'zone-2',
        style: toPixels(50, 50),
        size: { width: 50, height: 50, position: 'complex', index: 1, total: 3 }
      },
      {
        id: 'zone-3',
        style: toPixels(50, 50),
        size: { width: 50, height: 50, position: 'complex', index: 2, total: 3 }
      }
    ],

    'two-left-one-right': [
      {
        id: 'zone-1',
        style: toPixels(50, 50),
        size: { width: 50, height: 50, position: 'complex', index: 0, total: 3 }
      },
      {
        id: 'zone-2',
        style: toPixels(50, 50),
        size: { width: 50, height: 50, position: 'complex', index: 1, total: 3 }
      },
      {
        id: 'zone-3',
        style: toPixels(50, 100),
        size: { width: 50, height: 100, position: 'complex', index: 2, total: 3 }
      }
    ],

    'one-left-two-right': [
      {
        id: 'zone-1',
        style: toPixels(50, 100),
        size: { width: 50, height: 100, position: 'complex', index: 0, total: 3 }
      },
      {
        id: 'zone-2',
        style: toPixels(50, 50),
        size: { width: 50, height: 50, position: 'complex', index: 1, total: 3 }
      },
      {
        id: 'zone-3',
        style: toPixels(50, 50),
        size: { width: 50, height: 50, position: 'complex', index: 2, total: 3 }
      }
    ],

    'grid-2x2': [
      {
        id: 'zone-1',
        style: toPixels(50, 50),
        size: { width: 50, height: 50, position: 'grid', index: 0, total: 4 }
      },
      {
        id: 'zone-2',
        style: toPixels(50, 50),
        size: { width: 50, height: 50, position: 'grid', index: 1, total: 4 }
      },
      {
        id: 'zone-3',
        style: toPixels(50, 50),
        size: { width: 50, height: 50, position: 'grid', index: 2, total: 4 }
      },
      {
        id: 'zone-4',
        style: toPixels(50, 50),
        size: { width: 50, height: 50, position: 'grid', index: 3, total: 4 }
      }
    ]
  };

  return configs[layoutType] || configs['full-screen'];
}

/**
 * Get container style for layout type (fixed pixel sizes)
 * @param {string} layoutType
 * @returns {Object}
 */
export function getLayoutContainerStyle(layoutType) {
  const styles = {
    'full-screen': { display: 'flex', width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` },
    'vertical-split': { display: 'flex', flexDirection: 'row', width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` },
    'horizontal-split': { display: 'flex', flexDirection: 'column', width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` },
    'three-vertical': { display: 'flex', flexDirection: 'row', width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` },
    'three-horizontal': { display: 'flex', flexDirection: 'column', width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` },
    'main-left': { display: 'flex', flexDirection: 'row', width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` },
    'main-right': { display: 'flex', flexDirection: 'row', width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` },
    'main-top': { display: 'flex', flexDirection: 'column', width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` },
    'main-bottom': { display: 'flex', flexDirection: 'column', width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` },
    'two-top-one-bottom': { display: 'flex', flexDirection: 'column', width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` },
    'one-top-two-bottom': { display: 'flex', flexDirection: 'column', width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` },
    'two-left-one-right': { display: 'flex', flexDirection: 'row', width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` },
    'one-left-two-right': { display: 'flex', flexDirection: 'row', width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` },
    'grid-2x2': { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` }
  };

  return styles[layoutType] || styles['full-screen'];
}

/**
 * Get wrapper style for asymmetric and complex layouts (fixed pixel sizes)
 * @param {string} layoutType
 * @returns {Object}
 */
export function getLayoutWrapperStyles(layoutType) {
  // For asymmetric layouts that need nested containers
  const wrapperConfigs = {
    'main-left': {
      needsWrapper: true,
      mainContainer: { display: 'flex', flexDirection: 'row', width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` },
      secondaryContainer: { display: 'flex', flexDirection: 'column', width: `${Math.round(CANVAS_WIDTH / 3)}px`, height: `${CANVAS_HEIGHT}px` }
    },
    'main-right': {
      needsWrapper: true,
      mainContainer: { display: 'flex', flexDirection: 'row', width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` },
      secondaryContainer: { display: 'flex', flexDirection: 'column', width: `${Math.round(CANVAS_WIDTH / 3)}px`, height: `${CANVAS_HEIGHT}px` }
    },
    'main-top': {
      needsWrapper: true,
      mainContainer: { display: 'flex', flexDirection: 'column', width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` },
      secondaryContainer: { display: 'flex', flexDirection: 'row', width: `${CANVAS_WIDTH}px`, height: `${Math.round(CANVAS_HEIGHT / 3)}px` }
    },
    'main-bottom': {
      needsWrapper: true,
      mainContainer: { display: 'flex', flexDirection: 'column', width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` },
      secondaryContainer: { display: 'flex', flexDirection: 'row', width: `${CANVAS_WIDTH}px`, height: `${Math.round(CANVAS_HEIGHT / 3)}px` }
    },
    'two-top-one-bottom': {
      needsWrapper: true,
      mainContainer: { display: 'flex', flexDirection: 'column', width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` },
      secondaryContainer: { display: 'flex', flexDirection: 'row', width: `${CANVAS_WIDTH}px`, height: `${Math.round(CANVAS_HEIGHT / 2)}px` }
    },
    'one-top-two-bottom': {
      needsWrapper: true,
      mainContainer: { display: 'flex', flexDirection: 'column', width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` },
      secondaryContainer: { display: 'flex', flexDirection: 'row', width: `${CANVAS_WIDTH}px`, height: `${Math.round(CANVAS_HEIGHT / 2)}px` }
    },
    'two-left-one-right': {
      needsWrapper: true,
      mainContainer: { display: 'flex', flexDirection: 'row', width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` },
      secondaryContainer: { display: 'flex', flexDirection: 'column', width: `${Math.round(CANVAS_WIDTH / 2)}px`, height: `${CANVAS_HEIGHT}px` }
    },
    'one-left-two-right': {
      needsWrapper: true,
      mainContainer: { display: 'flex', flexDirection: 'row', width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` },
      secondaryContainer: { display: 'flex', flexDirection: 'column', width: `${Math.round(CANVAS_WIDTH / 2)}px`, height: `${CANVAS_HEIGHT}px` }
    }
  };

  return wrapperConfigs[layoutType] || { needsWrapper: false };
}
