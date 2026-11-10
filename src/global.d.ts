import type { Report } from './utils/types';

declare global {
  interface TestingData {
    sourceHtml: string;
  }

  interface RunnerLocale {
    translate: unknown;
    fallback: unknown;
  }

  class ACTRulesRunner {
    constructor(options: RunnerLocale);
    configure(options: { rules?: string[]; exclude?: string[] }): void;
    test(data: TestingData): unknown;
    testSpecial(): unknown;
    getReport(): Report;
  }

  class WCAGTechniquesRunner {
    constructor(locale: RunnerLocale, options?: unknown);
    configure(options: { techniques?: string[]; exclude?: string[] }): void;
    test(data: TestingData): WCAGTechniquesRunner;
    getReport(): Report;
  }

  class BestPracticesRunner {
    constructor(locale: RunnerLocale, options?: unknown);
    configure(options: { practices?: string[]; exclude?: string[] }): void;
    test(data: TestingData): BestPracticesRunner;
    getReport(): Report;
  }

  interface Window {
    wcag: WCAGTechniquesRunner;
    act: ACTRulesRunner;
    bp: BestPracticesRunner;
    /** Prevents registering the content script listener twice */
    __accessMonitorContentLoaded?: boolean;
  }
}

export {};
