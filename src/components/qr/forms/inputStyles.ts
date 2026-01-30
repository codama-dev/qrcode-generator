/** Shared accent styling for QR form inputs: glowing orange border, visible in light and dark mode */
export const inputAccentBase =
  'border-2 border-orange-500 ring-4 ring-orange-500/20 shadow-[0_0_14px_rgba(249,115,22,0.2)] focus-visible:border-orange-500 focus-visible:ring-orange-500/30 dark:shadow-[0_0_16px_rgba(249,115,22,0.25)]'

export const inputAccentClass = `${inputAccentBase} min-h-11`

/** URL input: same accent + larger font and height */
export const inputAccentClassUrl = `${inputAccentBase} min-h-14 text-lg`

export const selectTriggerAccentClass = `${inputAccentBase} min-h-11`
