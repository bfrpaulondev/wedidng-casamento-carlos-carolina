// src/utils/animations.js
export const smoothEase = { ease: [0.25, 0.1, 0.25, 1] };
export const fastTransition = { duration: 0.3, ...smoothEase };
export const slideTransition = { duration: 0.4, ...smoothEase };