/** Type declarations for the `@qualweb/counter` module */
declare module '@qualweb/counter' {
  export interface CounterResult {
    data: { tags: Record<string, number> };
    elementCount?: number;
  }

  export function executeCounter(options: {
    sourceHtml: string;
  }): CounterResult;
}
