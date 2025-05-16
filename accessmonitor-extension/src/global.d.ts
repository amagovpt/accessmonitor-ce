declare global {
  class ACTRulesRunner {
    constructor(options: { translate: any; fallback: any });
    configure(options: { rules?: string[]; exclude?: string[] }): void;
    test(data: TestingData): any;
    testSpecial(): any;
    getReport(): ACTReport;
  } 

  class WCAGTechniquesRunner {
    constructor(locale: any, options?: any);
    configure(options: { techniques?: string[]; exclude?: string[] }): void;
    test(data: TestingData): any;
    getReport(): any;
  }

  class BestPracticesRunner {
    constructor(locale: any, options?: any);
    configure(options: { practices?: string[]; exclude?: string[] }): void;
    test(data: TestingData): any;
    getReport(): any;
  }

  interface Window {
    wcag: WCAGTechniquesRunner;
    act: ACTRulesRunner;
    bp: BestPracticesRunner;
  }
}

interface ACTReport {
  assertions: Record<string, ACTRule>; // Specify the type of assertions
  metadata: {
    passed: number;
    failed: number;
    warning: number;
    inapplicable: number;
  };
}

export {};
