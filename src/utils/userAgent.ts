
export type DeviceType = "desktop" | "mobile" | "tablet";

/**
 * Detects the device type based on the User Agent string.
 * 
 * @param userAgent The User Agent string from headers or navigator.
 * @returns DeviceType ('desktop', 'mobile', or 'tablet')
 */
export const getDeviceType = (userAgent: string): DeviceType => {
  const isTablet = /iPad|tablet|(android(?!.*mobile))/i.test(userAgent);
  const isMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

  if (isTablet) return "tablet";
  if (isMobile) return "mobile";
  return "desktop";
};

/**
 * Check if the device is a mobile or tablet.
 */
export const isHandheld = (userAgent: string): boolean => {
  const device = getDeviceType(userAgent);
  return device === "mobile" || device === "tablet";
};

/**
 * Check if the device is specifically a mobile phone.
 */
export const isMobile = (userAgent: string): boolean => {
  return getDeviceType(userAgent) === "mobile";
};

/**
 * Check if the device is a tablet.
 */
export const isTablet = (userAgent: string): boolean => {
  return getDeviceType(userAgent) === "tablet";
};
