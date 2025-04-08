interface Summary {
  passed: number;
  failed: number;
  warning: number;
  inapplicable: number;
  title: string;
}

interface SuccessCriteria {
  name: string;
  level: string;
  principle: string;
  url: string;
}

interface RuleMetadata {
  target: {
    element: string | string[];
  };
  "success-criteria": SuccessCriteria[];
  related: string[];
  url: string;
  passed: number;
  warning: number;
  failed: number;
  inapplicable: number;
  outcome: string;
  description: string;
}

interface Rule {
  name: string;
  code: string;
  mapping: string;
  description: string;
  metadata: RuleMetadata;
  results: Result[];
}

interface Result{
  attributes: string[];
  description: string;
  mapping: string;
  elements:   [];
  resultCode: string;
  veridict: string;
}

interface Report {
  assertions: {
    [rule: string]: Rule;
  };
  metadata: {
    passed: number;
    failed: number;
    warning: number;
    inapplicable: number;
  };
}

export { Summary, Rule, RuleMetadata, Report , Result };