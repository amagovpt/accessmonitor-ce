// Shared functions between `content` and `sidepanel`: reference links and test view.
import type { ResultColor, TechItem } from './types';

export function refWebsite(ref: string): string {
  let result: string;
  if (ref.length > 3) {
    result = refWebsiteACT(ref);
  } else {
    result = refWebsiteTecnique(ref);
  }
  return result;
}

export function refWebsiteACT(ref: string): string {
  return 'https://www.w3.org/WAI/standards-guidelines/act/rules/' + ref + '/';
}

export function refWebsiteTecnique(ref: string): string {
  let path: string;
  if (ref.startsWith('C')) path = 'css/';
  else if (ref.startsWith('H')) path = 'html/';
  else if (ref.startsWith('A')) path = 'aria/';
  else if (ref.startsWith('S')) path = 'client-side-script/';
  else if (ref.startsWith('G')) path = 'general/';
  else path = 'failures/';
  return 'https://www.w3.org/WAI/WCAG21/Techniques/' + path + ref + '.html';
}

export function testView(
  ele: string,
  txt: string,
  test: string,
  color: ResultColor,
  tot: string | number | undefined,
  url: string,
): TechItem {
  const item: TechItem = { txt, tot: tot ? tot : 0 };

  if (ele === 'dtdOld') {
    return item;
  }

  if (ele === 'w3cValidatorErrors') {
    item['html_validator'] = true;
    item['ele'] = 'https://validator.w3.org/nu/?doc=' + encodeURIComponent(url);
  } else if (tot) {
    item['ele'] = ele;

    if (
      (test === 'aSkip' ||
        test === 'langNo' ||
        test === 'h1' ||
        test === 'titleNo') &&
      color === 'err'
    ) {
      delete item['ele'];
    }
  } else if (test === 'aSkipFirst') {
    item['ele'] = ele;
  }

  if (test === 'ehandBoth' || test === 'ehandler') {
    item['ele'] = 'ehandBoth';
  }

  return item;
}
