import { ruleset, testColors } from '@a12e/accessmonitor-rulesets';

import type {
  AuditReport,
  ElementDetail,
  EvidenceItem,
  TestDetails,
} from '../../shared/types';

/** Function to extract the tag name from the beginning of an HTML string (`<img src=...` -> `img`)
 *
 * @param htmlCode  The HTML code from which to extract the tag name
 * @returns    The tag name extracted from the HTML code
 */
function getTagName(htmlCode: string): string {
  const name = htmlCode.slice(1);

  let k = 0;
  for (let i = 0; i < name.length; i++, k++) {
    if (name[i] === ' ' || name[i] === '>') {
      break;
    }
  }

  return name.substring(0, k);
}

/** Removes internal QualWeb attributes (`_selector`, `_cssrules`, ...) from the displayed code
 *
 * @param code  The HTML code from which to remove internal QualWeb attributes
 * @returns     The cleaned HTML code without internal QualWeb attributes
 */
function cleanCode(code: string): string {
  let result = code
    .replace(/_cssrules="true"/g, '')
    .replace(/_documentselector="undefined"/g, '');

  let index = result.indexOf('_selector="');
  while (index !== -1) {
    let foundStart = false;
    let foundEnd = false;
    let k = index;
    while (!foundEnd && k < result.length) {
      k++;
      if (result[k] === '"') {
        if (!foundStart) {
          foundStart = true;
        } else {
          foundEnd = true;
        }
      }
    }

    result = result.replace(result.substring(index, k + 1), '');
    index = result.indexOf('_selector="');
  }

  return result;
}

/** Function to make relative image `src` attributes absolute based on the page URL
 *
 * @param code  The HTML code containing the image tag
 * @param pageUrl  The URL of the page to use as the base for relative `src` attributes
 * @returns  The HTML code with the image `src` attribute made absolute
 */
function absolutizeImgSrc(code: string, pageUrl: string): string {
  if (!code.startsWith('<img')) {
    return code;
  }

  const protocol = pageUrl.startsWith('https://') ? 'https://' : 'http://';
  const www = pageUrl.includes('www.') ? 'www.' : '';
  const host =
    pageUrl
      .replace('http://', '')
      .replace('https://', '')
      .replace('www.', '')
      .split('/')[0] ?? '';

  const srcIndex = code.indexOf('src="');
  if (srcIndex === -1) {
    return code;
  }

  const valueStart = srcIndex + 'src="'.length;
  const valueEnd = code.indexOf('"', valueStart);
  if (valueEnd === -1) {
    return code;
  }

  const src = code.substring(valueStart, valueEnd);
  if (!src || src.startsWith('http')) {
    return code;
  }

  const prefix = `${protocol}${www}${host}${src.startsWith('/') ? '' : '/'}`;
  return code.slice(0, valueStart) + prefix + code.slice(valueStart);
}

/** Function to fix the HTML code by cleaning it and making image `src` attributes absolute
 *
 * @param code  The HTML code to fix
 * @param pageUrl  The URL of the page to use as the base for relative `src` attributes
 * @returns  The fixed HTML code
 */
const fixCode = (code: string, pageUrl: string): string =>
  absolutizeImgSrc(cleanCode(code), pageUrl);

function attributesToString(attributes: EvidenceItem['attributes']): string {
  if (attributes === undefined) return '';
  return typeof attributes === 'string'
    ? attributes
    : JSON.stringify(attributes);
}

/** Function to convert the attributes of an evidence item to a string
 *
 * @param attributes  The attributes of the evidence item
 * @returns  The attributes as a string
 */
function toElementDetail(
  item: EvidenceItem,
  report: AuditReport,
): ElementDetail {
  const htmlCode = item.htmlCode ?? '';
  const ele = getTagName(htmlCode);

  return {
    ele,
    code:
      ele === 'style'
        ? attributesToString(item.attributes)
        : ele === 'title'
          ? report.metadata.title
          : fixCode(htmlCode, report.metadata.url),
    showCode:
      ele === 'style' ? undefined : fixCode(htmlCode, report.metadata.url),
    pointer: item.pointer ?? '',
  };
}

/** Function to get the details of a test from the audit report
 *
 * @param test  The test identifier
 * @param report  The audit report containing the test results
 * @returns  The details of the test, including result, size, and elements
 */
export function getTestDetails(test: string, report: AuditReport): TestDetails {
  const ele = test === 'form' ? 'formSubmitNo' : test;
  const { assertionEvidence, conformanceResults } = report.scoring;

  // Cada resultado pode trazer os elementos aninhados (`elements`) ou ser ele próprio o elemento
  const elements: ElementDetail[] = [];
  for (const node of assertionEvidence[ele] ?? []) {
    if (node.elements) {
      for (const element of node.elements) {
        elements.push(toElementDetail(element, report));
      }
    } else {
      elements.push(toElementDetail(node, report));
    }
  }

  // Cor da primeira regra aplicada a este teste (G se nenhuma)
  let result: NonNullable<TestDetails['result']> = 'G';
  for (const key of Object.keys(ruleset) as Array<keyof typeof ruleset>) {
    if (ruleset[key].test === ele && key in conformanceResults) {
      result = testColors[key];
      break;
    }
  }

  return { result, size: elements.length, elements };
}
