/*
 * Copyright (c) 2024. Matis Byar — MIT
 */

declare module 'byarutils' {
  export function addToPool(methodToRun: Function, args: any[], attempts: number): void;
  export function log(type: string, source: string, message: string): void;
}
