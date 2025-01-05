// Common Tailwind class mappings
export const alignmentClasses = {
    'left': 'text-left',
    'center': 'text-center',
    'right': 'text-right',
    'justify': 'text-justify'
} as const;

export const objectFitClasses = {
    'cover': 'object-cover',
    'contain': 'object-contain',
    'fill': 'object-fill',
    'none': 'object-none',
    'scale-down': 'object-scale-down'
} as const;

// Type-safe helper for class mappings
export type ClassMapKey<T> = keyof T;
export type ClassMap<T> = { [K in ClassMapKey<T>]: string };