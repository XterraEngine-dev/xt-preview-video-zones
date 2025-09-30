/**
 * Layout configurations for all 14 layout types
 * Each layout defines zones with their positioning and sizing
 */

/**
 * @typedef {import('../types/index.js').ZoneConfig} ZoneConfig
 */

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
        style: 'w-full h-full',
        size: {
          width: 100,
          height: 100,
          position: 'fullscreen',
          index: 0,
          total: 1
        }
      }
    ],

    'vertical-split': [
      {
        id: 'zone-1',
        style: 'w-1/2 h-full',
        size: {
          width: 50,
          height: 100,
          position: 'split-vertical',
          index: 0,
          total: 2
        }
      },
      {
        id: 'zone-2',
        style: 'w-1/2 h-full',
        size: {
          width: 50,
          height: 100,
          position: 'split-vertical',
          index: 1,
          total: 2
        }
      }
    ],

    'horizontal-split': [
      {
        id: 'zone-1',
        style: 'w-full h-1/2',
        size: {
          width: 100,
          height: 50,
          position: 'split-horizontal',
          index: 0,
          total: 2
        }
      },
      {
        id: 'zone-2',
        style: 'w-full h-1/2',
        size: {
          width: 100,
          height: 50,
          position: 'split-horizontal',
          index: 1,
          total: 2
        }
      }
    ],

    // ===== TRES ZONAS (2) =====
    'three-vertical': [
      {
        id: 'zone-1',
        style: 'w-1/3 h-full',
        size: {
          width: 33.33,
          height: 100,
          position: 'split-vertical',
          index: 0,
          total: 3
        }
      },
      {
        id: 'zone-2',
        style: 'w-1/3 h-full',
        size: {
          width: 33.33,
          height: 100,
          position: 'split-vertical',
          index: 1,
          total: 3
        }
      },
      {
        id: 'zone-3',
        style: 'w-1/3 h-full',
        size: {
          width: 33.33,
          height: 100,
          position: 'split-vertical',
          index: 2,
          total: 3
        }
      }
    ],

    'three-horizontal': [
      {
        id: 'zone-1',
        style: 'w-full h-1/3',
        size: {
          width: 100,
          height: 33.33,
          position: 'split-horizontal',
          index: 0,
          total: 3
        }
      },
      {
        id: 'zone-2',
        style: 'w-full h-1/3',
        size: {
          width: 100,
          height: 33.33,
          position: 'split-horizontal',
          index: 1,
          total: 3
        }
      },
      {
        id: 'zone-3',
        style: 'w-full h-1/3',
        size: {
          width: 100,
          height: 33.33,
          position: 'split-horizontal',
          index: 2,
          total: 3
        }
      }
    ],

    // ===== ASIMÉTRICOS (4) =====
    'main-left': [
      {
        id: 'zone-1',
        style: 'w-2/3 h-full',
        size: {
          width: 66.67,
          height: 100,
          position: 'asymmetric',
          index: 0,
          total: 3
        }
      },
      {
        id: 'zone-2',
        style: 'w-1/3 h-1/2',
        size: {
          width: 33.33,
          height: 50,
          position: 'asymmetric',
          index: 1,
          total: 3
        }
      },
      {
        id: 'zone-3',
        style: 'w-1/3 h-1/2',
        size: {
          width: 33.33,
          height: 50,
          position: 'asymmetric',
          index: 2,
          total: 3
        }
      }
    ],

    'main-right': [
      {
        id: 'zone-1',
        style: 'w-1/3 h-1/2',
        size: {
          width: 33.33,
          height: 50,
          position: 'asymmetric',
          index: 0,
          total: 3
        }
      },
      {
        id: 'zone-2',
        style: 'w-1/3 h-1/2',
        size: {
          width: 33.33,
          height: 50,
          position: 'asymmetric',
          index: 1,
          total: 3
        }
      },
      {
        id: 'zone-3',
        style: 'w-2/3 h-full',
        size: {
          width: 66.67,
          height: 100,
          position: 'asymmetric',
          index: 2,
          total: 3
        }
      }
    ],

    'main-top': [
      {
        id: 'zone-1',
        style: 'w-full h-2/3',
        size: {
          width: 100,
          height: 66.67,
          position: 'asymmetric',
          index: 0,
          total: 3
        }
      },
      {
        id: 'zone-2',
        style: 'w-1/2 h-1/3',
        size: {
          width: 50,
          height: 33.33,
          position: 'asymmetric',
          index: 1,
          total: 3
        }
      },
      {
        id: 'zone-3',
        style: 'w-1/2 h-1/3',
        size: {
          width: 50,
          height: 33.33,
          position: 'asymmetric',
          index: 2,
          total: 3
        }
      }
    ],

    'main-bottom': [
      {
        id: 'zone-1',
        style: 'w-1/2 h-1/3',
        size: {
          width: 50,
          height: 33.33,
          position: 'asymmetric',
          index: 0,
          total: 3
        }
      },
      {
        id: 'zone-2',
        style: 'w-1/2 h-1/3',
        size: {
          width: 50,
          height: 33.33,
          position: 'asymmetric',
          index: 1,
          total: 3
        }
      },
      {
        id: 'zone-3',
        style: 'w-full h-2/3',
        size: {
          width: 100,
          height: 66.67,
          position: 'asymmetric',
          index: 2,
          total: 3
        }
      }
    ],

    // ===== COMPLEJOS (4) =====
    'two-top-one-bottom': [
      {
        id: 'zone-1',
        style: 'w-1/2 h-1/2',
        size: {
          width: 50,
          height: 50,
          position: 'complex',
          index: 0,
          total: 3
        }
      },
      {
        id: 'zone-2',
        style: 'w-1/2 h-1/2',
        size: {
          width: 50,
          height: 50,
          position: 'complex',
          index: 1,
          total: 3
        }
      },
      {
        id: 'zone-3',
        style: 'w-full h-1/2',
        size: {
          width: 100,
          height: 50,
          position: 'complex',
          index: 2,
          total: 3
        }
      }
    ],

    'one-top-two-bottom': [
      {
        id: 'zone-1',
        style: 'w-full h-1/2',
        size: {
          width: 100,
          height: 50,
          position: 'complex',
          index: 0,
          total: 3
        }
      },
      {
        id: 'zone-2',
        style: 'w-1/2 h-1/2',
        size: {
          width: 50,
          height: 50,
          position: 'complex',
          index: 1,
          total: 3
        }
      },
      {
        id: 'zone-3',
        style: 'w-1/2 h-1/2',
        size: {
          width: 50,
          height: 50,
          position: 'complex',
          index: 2,
          total: 3
        }
      }
    ],

    'two-left-one-right': [
      {
        id: 'zone-1',
        style: 'w-1/2 h-1/2',
        size: {
          width: 50,
          height: 50,
          position: 'complex',
          index: 0,
          total: 3
        }
      },
      {
        id: 'zone-2',
        style: 'w-1/2 h-1/2',
        size: {
          width: 50,
          height: 50,
          position: 'complex',
          index: 1,
          total: 3
        }
      },
      {
        id: 'zone-3',
        style: 'w-1/2 h-full',
        size: {
          width: 50,
          height: 100,
          position: 'complex',
          index: 2,
          total: 3
        }
      }
    ],

    'one-left-two-right': [
      {
        id: 'zone-1',
        style: 'w-1/2 h-full',
        size: {
          width: 50,
          height: 100,
          position: 'complex',
          index: 0,
          total: 3
        }
      },
      {
        id: 'zone-2',
        style: 'w-1/2 h-1/2',
        size: {
          width: 50,
          height: 50,
          position: 'complex',
          index: 1,
          total: 3
        }
      },
      {
        id: 'zone-3',
        style: 'w-1/2 h-1/2',
        size: {
          width: 50,
          height: 50,
          position: 'complex',
          index: 2,
          total: 3
        }
      }
    ],

    'grid-2x2': [
      {
        id: 'zone-1',
        style: 'w-1/2 h-1/2',
        size: {
          width: 50,
          height: 50,
          position: 'grid',
          index: 0,
          total: 4
        }
      },
      {
        id: 'zone-2',
        style: 'w-1/2 h-1/2',
        size: {
          width: 50,
          height: 50,
          position: 'grid',
          index: 1,
          total: 4
        }
      },
      {
        id: 'zone-3',
        style: 'w-1/2 h-1/2',
        size: {
          width: 50,
          height: 50,
          position: 'grid',
          index: 2,
          total: 4
        }
      },
      {
        id: 'zone-4',
        style: 'w-1/2 h-1/2',
        size: {
          width: 50,
          height: 50,
          position: 'grid',
          index: 3,
          total: 4
        }
      }
    ]
  };

  return configs[layoutType] || configs['full-screen'];
}

/**
 * Get container style for layout type
 * @param {string} layoutType
 * @returns {string}
 */
export function getLayoutContainerStyle(layoutType) {
  const styles = {
    'full-screen': 'flex w-full h-full',
    'vertical-split': 'flex flex-row w-full h-full',
    'horizontal-split': 'flex flex-col w-full h-full',
    'three-vertical': 'flex flex-row w-full h-full',
    'three-horizontal': 'flex flex-col w-full h-full',
    'main-left': 'flex flex-row w-full h-full',
    'main-right': 'flex flex-row w-full h-full',
    'main-top': 'flex flex-col w-full h-full',
    'main-bottom': 'flex flex-col w-full h-full',
    'two-top-one-bottom': 'flex flex-col w-full h-full',
    'one-top-two-bottom': 'flex flex-col w-full h-full',
    'two-left-one-right': 'flex flex-row w-full h-full',
    'one-left-two-right': 'flex flex-row w-full h-full',
    'grid-2x2': 'grid grid-cols-2 grid-rows-2 w-full h-full'
  };

  return styles[layoutType] || 'flex w-full h-full';
}

/**
 * Get wrapper style for asymmetric and complex layouts
 * @param {string} layoutType
 * @returns {Object}
 */
export function getLayoutWrapperStyles(layoutType) {
  // For asymmetric layouts that need nested containers
  const wrapperConfigs = {
    'main-left': {
      needsWrapper: true,
      mainContainer: 'flex flex-row w-full h-full',
      secondaryContainer: 'flex flex-col w-1/3 h-full'
    },
    'main-right': {
      needsWrapper: true,
      mainContainer: 'flex flex-row w-full h-full',
      secondaryContainer: 'flex flex-col w-1/3 h-full'
    },
    'main-top': {
      needsWrapper: true,
      mainContainer: 'flex flex-col w-full h-full',
      secondaryContainer: 'flex flex-row w-full h-1/3'
    },
    'main-bottom': {
      needsWrapper: true,
      mainContainer: 'flex flex-col w-full h-full',
      secondaryContainer: 'flex flex-row w-full h-1/3'
    },
    'two-top-one-bottom': {
      needsWrapper: true,
      mainContainer: 'flex flex-col w-full h-full',
      secondaryContainer: 'flex flex-row w-full h-1/2'
    },
    'one-top-two-bottom': {
      needsWrapper: true,
      mainContainer: 'flex flex-col w-full h-full',
      secondaryContainer: 'flex flex-row w-full h-1/2'
    },
    'two-left-one-right': {
      needsWrapper: true,
      mainContainer: 'flex flex-row w-full h-full',
      secondaryContainer: 'flex flex-col w-1/2 h-full'
    },
    'one-left-two-right': {
      needsWrapper: true,
      mainContainer: 'flex flex-row w-full h-full',
      secondaryContainer: 'flex flex-col w-1/2 h-full'
    }
  };

  return wrapperConfigs[layoutType] || { needsWrapper: false };
}