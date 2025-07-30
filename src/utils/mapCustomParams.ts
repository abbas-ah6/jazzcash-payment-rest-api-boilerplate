/**
 * Map custom parameters for the JAZZCASH API (ppmpf parameters)
 * @param customParams object containing custom parameters to be mapped
 * @returns Mapped object
 */

export function mapCustomParams(customParams: Record<string, string> = {}) {
  const mapped: Record<string, string> = {};
  Object.entries(customParams).forEach(([key, value], index) => {
    if (index < 5) {
      mapped[`ppmpf_${index + 1}`] = value;
    }
  });

  return mapped;
}
