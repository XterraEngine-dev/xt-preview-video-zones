/**
 * @typedef {'full-screen' | 'vertical-split' | 'horizontal-split' | 'three-vertical' |
 *           'three-horizontal' | 'main-left' | 'main-right' | 'main-top' | 'main-bottom' |
 *           'two-top-one-bottom' | 'one-top-two-bottom' | 'two-left-one-right' |
 *           'one-left-two-right' | 'grid-2x2'} LayoutType
 */

/**
 * @typedef {'landscape' | 'portrait'} Orientation
 */

/**
 * @typedef {'video' | 'image'} MediaType
 */

/**
 * @typedef {'fullscreen' | 'split-horizontal' | 'split-vertical' | 'grid' | 'asymmetric' | 'complex'} PositionType
 */

/**
 * @typedef {Object} ZoneSize
 * @property {number} width - Percentage
 * @property {number} height - Percentage
 * @property {PositionType} position
 * @property {number} index
 * @property {number} total
 */

/**
 * @typedef {Object} ZoneConfig
 * @property {string} id
 * @property {string} style - Tailwind CSS classes
 * @property {ZoneSize} size
 */

/**
 * @typedef {Object} MediaItem
 * @property {string} id
 * @property {MediaType} type
 * @property {number} duration - Seconds
 * @property {number} order
 * @property {string} url - Media URL
 */

/**
 * @typedef {Object} VideoAssignment
 * @property {string} zoneId
 * @property {MediaItem[]} media
 * @property {number} currentMediaIndex
 */

/**
 * @typedef {Object} LabelData
 * @property {string} id
 * @property {string} text
 * @property {number} x
 * @property {number} y
 * @property {string} fontSize
 * @property {string} fontWeight
 * @property {string} color
 * @property {number} rotation
 * @property {number} scale
 * @property {number} zIndex
 */

/**
 * @typedef {Object} LabelGroup
 * @property {string} id
 * @property {string} name
 * @property {string[]} labelIds
 * @property {Object} sharedStyles
 */

/**
 * @typedef {Object} BackgroundShape
 * @property {string} id
 * @property {'rectangle' | 'circle' | 'triangle'} type
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 * @property {string} color
 * @property {string} borderColor
 * @property {number} borderWidth
 * @property {number} opacity
 * @property {number} zIndex
 */

/**
 * @typedef {Object} LayoutConfiguration
 * @property {string} id
 * @property {string} name
 * @property {Orientation} orientation
 * @property {LayoutType} layout
 * @property {VideoAssignment[]} assignments
 * @property {LabelData[]} labels
 * @property {LabelGroup[]} labelGroups
 * @property {BackgroundShape[]} backgroundShapes
 * @property {string} userId
 * @property {string} tenantId
 */

/**
 * @typedef {Object} Layout
 * @property {string} id
 * @property {string} tenant
 * @property {string} items
 * @property {string} videos
 * @property {string} name
 * @property {number} width
 * @property {number} height
 * @property {LayoutConfiguration} metadata
 * @property {string} created
 * @property {string} updated
 */

/**
 * @typedef {Object} Campaign
 * @property {string} id
 * @property {string} name
 * @property {string[]} layouts - Array of layout IDs
 * @property {string} tenant
 * @property {string} created
 * @property {string} updated
 */

export {}