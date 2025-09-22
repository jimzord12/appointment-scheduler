declare module 'clsx' {
  export type ClassValue = any;
  const clsx: (...inputs: any[]) => string;
  export default clsx;
}

declare module 'tailwind-merge' {
  export function twMerge(...inputs: any[]): string;
}

declare module 'gsap' {
  export const gsap: any;
  export default gsap;
}
