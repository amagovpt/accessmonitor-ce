import * as htmlparser from "htmlparser2";
import * as CSSselect from "css-select";
import clone from "lodash.clone";

import tests from "./tests";
import testsColors from "./testsColors";

import { getElementsMapping } from "./mapping";

import scs from "../../utils/scs";

import { generateMd5Hash } from "../lib/security";
import { convertBytes } from "../../utils/utils";
import { refWebsite, testView } from "../../sidepanel/pages/Resume/utils";

function completeMissingReportElements(report: any): void {
  let _dom = {};

  const handler = new htmlparser.DomHandler((error, dom) => {
    if (error) {
      throw new Error();
    } else {
      _dom = clone(dom);
    }
  });

  const parser = new htmlparser.Parser(handler);
  parser.write(report.pagecode.replace(/(\r\n|\n|\r|\t)/gm, ""));
  parser.end();

  if (report.data.elems["img"] === undefined) {
    const img = CSSselect.selectAll("img", _dom);
    report.data.elems["img"] = img.length;
  }

  const area = CSSselect.selectAll("area", _dom);
  report.data.elems["area"] = area.length;

  const inpImg = CSSselect.selectAll("a", _dom);
  report.data.elems["inpImg"] = inpImg.length;

  const roles = [
    "checkbox",
    "combobox",
    "listbox",
    "menuitemcheckbox",
    "menuitemradio",
    "radio",
    "searchbox",
    "slider",
    "spinbutton",
    "switch",
    "textbox",
  ];

  const label = CSSselect.selectAll(
    "input, select, textarea, " + roles.map((r) => `[role="${r}"]`).join(", "),
    _dom
  );
  report.data.elems["label"] = label.length;

  const form = CSSselect.selectAll("form", _dom);
  report.data.elems["form"] = form.length;

  const table = CSSselect.selectAll("table", _dom);
  if (report.data.elems["tableData"] === undefined) {
    report.data.elems["tableData"] = table.length;
  }
  if (report.data.elems["tableLayout"] === undefined) {
    report.data.elems["tableLayout"] = table.length;
  }
  if (report.data.elems["tableComplex"] === undefined) {
    report.data.elems["tableComplex"] = table.length;
  }

  //const tabletable = CSSselect.selectAll("table table", _dom);
  //report.data.elems["tableNested"] = tabletable.length;

  const iframe = CSSselect.selectAll("iframe", _dom);
  report.data.elems["iframe"] = iframe.length;

  const ehandler = CSSselect.selectAll(
    "*[onmousedown], *[onmouseup], *[onclick], *[onmouseover], *[onmouseout]",
    _dom
  );
  report.data.elems["ehandler"] = ehandler.length;

  report.data.tot.elems = clone(report.data.elems);
}

function generateScore(report: any): string {
  let rel = 0;
  let pon = 0;

  for (const test in report.data.tot.results) {
    const value = tests[test];

    if (value.result === "warning") {
      continue;
    }

    let calc = false;
    switch (value["type"]) {
      case "true":
      case "decr":
        if (
          value["elem"] === "all" ||
          report.data["elems"][value["elem"]] !== undefined
        ) {
          if (report.data["elems"][value["test"]] !== undefined) {
            calc = true;
          }
        }
        break;
      case "fals":
        if (
          value["elem"] === "all" ||
          report.data["elems"][value["elem"]] !== undefined
        ) {
          // if (report.data["elems"][value["test"]] !== undefined) {
          calc = true;
          // }
        }
        break;
      case "prop":
        if (
          report.data["elems"][value["elem"]] !== undefined &&
          report.data["elems"][value["test"]] !== undefined
        ) {
          calc = true;
        }
        break;
    }
    // if (value["test"] === "liNotSemantically")
    //   console.log({ calc, value, elems: report.data["elems"] })

    if (calc) {
      let temp = null;
      if (tests[test]["type"] === "prop") {
        temp = calculateProp(value, report);
      } else if (tests[test]["type"] === "decr") {
        temp = calculateDecr(value, report);
      } else {
        temp = calculateTrueFalse(value);
      }

      if (temp) { // always runs
        const pp = temp["p"] / 5;
        const ss = temp["s"] * pp;
        rel += ss;
        pon += pp;

        report.data.tot.results[test] = value["score"] + "@" + ss;
      }
    }
  }

  return (rel / pon).toFixed(1);
}

function calculateTrueFalse(v: any): any {
  const score = v["score"];
  const ret = { s: score, p: 0 };
  for (const w in v["dis"]) {
    if (parseInt(w) > 1) {
      const p = +v["trust"] * parseInt(w);
      ret["p"] += p;
    }
  }
  return ret;
}

function calculateDecr(v: any, report: any): any {
  const test = report.data.elems[v["test"]];
  const limit = v["top"];
  const steps = v["steps"];
  const score = v["score"];
  const errors = test - limit;
  const minus = errors > 0 ? Math.round(errors / steps) : 0;
  const op = score - minus;
  const rr = op < 1 ? 1 : op;
  const ret = { s: rr, p: 0 };
  for (const w of v["dis"]) {
    if (parseInt(w) > 1) {
      const p = +v["trust"] * parseInt(w);
      ret["p"] += p;
    }
  }
  return ret;
}

function calculateProp(v: any, report: any): any {
  const elem = report.data.elems[v["elem"]];
  const test = report.data.elems[v["test"]];
  const score = v["score"];
  const op = score - (score / elem) * test;
  const rr = op < 1 ? 1 : op;
  const ret = { s: rr, p: 0 };
  for (const w of v["dis"]) {
    if (parseInt(w) > 1) {
      const p = +v["trust"] * parseInt(w);
      ret["p"] += p;
    }
  }
  return clone(ret);
}

function getHtmlLang(html: string): string {
  let lang = "";
  let _dom = {};

  const handler = new htmlparser.DomHandler((error, dom) => {
    if (error) {
      throw new Error();
    } else {
      _dom = clone(dom);
    }
  });

  const parser = new htmlparser.Parser(handler);
  parser.write(html.replace(/(\r\n|\n|\r|\t)/gm, ""));
  parser.end();

  const htmlElement: any = CSSselect.selectOne("html", _dom);

  if (htmlElement && htmlElement.attribs && htmlElement.attribs.lang) {
    lang = htmlElement.attribs.lang;
  }

  return lang;
}

function calculateConform(results: any): string {
  const errors = {
    A: 0,
    AA: 0,
    AAA: 0,
  };
  for (const ee in results || {}) {
    if (ee) {
      let level = tests[ee]["level"].toUpperCase();
      if (testsColors[ee] === "R") {
        errors[level]++;
      }
    }
  }

  return `${errors.A}@${errors.AA}@${errors.AAA}`;
}

function parse(evaluation: any): any {
  const { elements, results, nodes } = getElementsMapping(evaluation);

  const report: any = {};

  report.pagecode = evaluation.system.page.dom.html;
  report["data"] = {};
  report["data"].title = evaluation.system.page.dom.title;
  report["data"].rawUrl = evaluation.system.url.completeUrl || "";
  report["data"].elems = clone(elements);
  report["data"].nodes = clone(nodes);
  report["data"].date = new Date()
    .toISOString()
    .replace(/T/, " ")
    .replace(/\..+/, "");
  report["data"].tot = {};
  report["data"].tot.info = {};
  report["data"].tot.info.url = clone(report["data"].rawUrl);
  report["data"].tot.info.title = clone(report["data"].title);
  report["data"].tot.info.date = clone(report["data"].date);
  report["data"].tot.info.htmlTags = evaluation.system.page.dom.elementCount;
  report["data"].tot.info.roles = evaluation.modules.counter.data.roles;
  report["data"].tot.info.cTags = evaluation.modules.counter.data.tags;
  report["data"].tot.info.size =
    encodeURI(report.pagecode).split(/%..|./).length - 1;
  //report['data'].tot.info.cssRules = calculateCssRules(evaluation);
  report["data"].tot.info.encoding = "utf-8";
  report["data"].tot.info.lang = getHtmlLang(evaluation.system.page.dom.html);
  report["data"].tot.info.content = "text/html";
  report["data"].tot.info.hash = generateMd5Hash(report["data"].date);
  report["data"].tot.info.tests = Object.keys(results).length;
  report["data"].tot.elems = clone(report["data"].elems);
  report["data"].tot.results = clone(results);
  report["data"].conform = calculateConform(report["data"].tot.results);
  report["data"].tot.info.conform = clone(report["data"].conform);

  completeMissingReportElements(report);

  report["data"].score = generateScore(report);
  report["data"].tot.info.score = clone(report["data"].score);
  return report;
}

export function parseEvaluation(report: any) {
  let parsedReport;

  console.log("Parsing Report");

  parsedReport = parse(report);

  console.log(parsedReport);

  return parsedReport;
}

function process(tot: any, url?: any): any {
  if (tot === null || tot === undefined) {
    return null;
  }
  const datax = {};

  datax["metadata"] = {};
  datax["metadata"]["url"] = tot["info"]["url"];
  datax["metadata"]["title"] = tot["info"]["title"];
  datax["metadata"]["n_elements"] = tot["info"]["htmlTags"]; // 0;
  datax["metadata"]["score"] = tot["info"]["score"];
  datax["metadata"]["size"] = convertBytes(tot["info"]["size"]);
  datax["metadata"]["last_update"] = tot["info"]["date"];
  datax["metadata"]["count_results"] = Object.keys(tot["results"]).length;
  datax["metadata"]["validator"] = tot.elems["w3cValidator"] === "true";
  datax["results"] = [];

  const infoak = {
    A: {
      ok: 0,
      err: 0,
      war: 0,
    },
    AA: {
      ok: 0,
      err: 0,
      war: 0,
    },
    AAA: {
      ok: 0,
      err: 0,
      war: 0,
    },
  };

  for (const test in tests) {
    if (test) {
      if (tot.results[test]) {
        let tes = tests[test]["test"];
        const lev = tests[test]["level"];
        const ref = tests[test]["ref"];
        const ele = tests[test]["elem"];

        let color;

        if (testsColors[test] === "R") {
          color = "err";
        } else if (testsColors[test] === "Y") {
          color = "war";
        } else if (testsColors[test] === "G") {
          color = "ok";
        }

        const level = lev.toUpperCase();

        infoak[level][color]++;

        let tnum;

        if (tot.elems[tes] !== undefined) {
          if (tes === "titleOk") {
            tnum = tot.info.title;
          } else if (tes === "lang") {
            tnum = tot.info.lang;
          } else if (tes === "langNo") {
            tnum = "lang";
          } else if (tes === "titleLong") {
            tnum = tot.info.title.length;
          } else {
            tnum = tot["elems"][tes];
          }
        } else if (tes === "imgAltNo") {
          tnum = tot.elems["img"];
          tes = "img";
        } else if (tes === "inputLabelNo") {
          tnum = tot.elems["label"];
        } else {
          tnum = tot["elems"][ele];
        }

        const result = {};
        result["ico"] = "assets/images/ico" + color + ".png";
        result["color"] = color;
        result["lvl"] = level;
        result["msg"] = test;
        result["ref"] = ref;

        result["ref_website"] = refWebsite(ref);
        result["relation"] =
          tests[test]["ref"].length > 3 ? "relationACT" : "relationT";
        result["ref_related_sc"] = new Array();
        result["value"] = tnum;
        result["prio"] = color === "ok" ? 3 : color === "err" ? 1 : 2;

        const scstmp = tests[test]["scs"].split(",");

        for (let s in scstmp) {
          if (s) {
            const li = {};
            s = scstmp[s].trim();
            if (s !== "") {
              li["sc"] = s;
              li["lvl"] = scs[s]["1"];
              li["link"] =
                "https://www.w3.org/WAI/WCAG21/Understanding/" +
                scs[s]["0"] +
                ".html";

              result["ref_related_sc"].push(li);
            }
          }
        }

        result["tech_list"] = testView(tes, tes, tes, color, tnum, url);
        datax["results"].push(result);
      }
    }
  }

  datax["infoak"] = infoak;

  return datax;
}

export function processData(tot: any, url: any) {
  let processedData;

  console.log("Process Report");

  processedData = process(tot, url);

  console.log(processedData);

  return processedData;
}

function splice(code: any, idx: any, rem: any, str: any) {
  return code.slice(0, idx) + str + code.slice(idx + Math.abs(rem));
}

function fixeSrcAttribute(code, tot) {
  const ead = process(tot);

  if (code.startsWith("<img")) {
    const protocol = ead.metadata.url.startsWith("https://")
      ? "https://"
      : "http://";
    const www = ead.metadata.url.includes("www.") ? "www." : "";

    let fixSrcUrl = ead.metadata.url
      .replace("http://", "")
      .replace("https://", "")
      .replace("www.", "")
      .split("/")[0];
    if (fixSrcUrl[fixSrcUrl.length - 1] === "/") {
      fixSrcUrl = fixSrcUrl.substring(0, fixSrcUrl.length - 2);
    }

    let srcAttribute = "";
    const index = code.indexOf('src="');
    if (index !== -1) {
      let foundEnd = false;
      let foundStart = false;
      let k = index;
      let startIndex = -1;
      while (!foundEnd) {
        k++;
        if (code[k] === '"') {
          if (!foundStart) {
            foundStart = true;
            startIndex = k;
          } else {
            foundEnd = true;
          }
        }
      }
      srcAttribute = code.substring(startIndex + 1, k);

      if (
        srcAttribute &&
        !srcAttribute.startsWith("http") &&
        !srcAttribute.startsWith("https")
      ) {
        if (srcAttribute.startsWith("/")) {
          srcAttribute = `"${protocol}${www}${fixSrcUrl}${srcAttribute}`;
        } else {
          srcAttribute = `"${protocol}${www}${fixSrcUrl}/${srcAttribute}`;
        }

        code = splice(code, startIndex, 0, srcAttribute);
      }
    }
  }

  return code;
}

function getTagName(element: any) {
  let name = element.htmlCode.slice(1);

  let k = 0;
  for (let i = 0; i < name.length; i++, k++) {
    if (name[i] === " " || name[i] === ">") {
      break;
    }
  }

  name = name.substring(0, k);

  return name;
}

function fixCode(code: any, tot: any) {
  code = code.replace(/_cssrules="true"/g, "");
  code = code.replace(/_documentselector="undefined"/g, "");

  let index = code.indexOf('_selector="');
  while (index !== -1) {
    let foundEnd = false;
    let foundStart = false;
    let k = index;
    while (!foundEnd) {
      k++;
      if (code[k] === '"') {
        if (!foundStart) {
          foundStart = true;
        } else {
          foundEnd = true;
        }
      }
    }

    code = code.replace(code.substring(index, k), "");
    index = code.indexOf('_selector="');
  }

  return fixeSrcAttribute(code, tot);
}

function getElementsList(nodes: any, tot: any) {
  const elements = new Array();
  for (const node of nodes || []) {
    if (node.elements) {
      for (const element of node.elements || []) {
        const ele = getTagName(element);
        elements.push({
          ele,
          code:
            ele === "style"
              ? element.attributes
              : ele === "title"
                ? tot?.info?.title // this.evaluation.processed.metadata.title
                : fixCode(element.htmlCode, tot),
          showCode: ele === "style" ? undefined : fixCode(element.htmlCode, tot),
          pointer: element.pointer,
        });
      }
    } else {
      const ele = getTagName(node);
      elements.push({
        ele,
        code: ele === "style" ? node.attributes : fixCode(node.htmlCode, tot),
        showCode: ele === "style" ? undefined : fixCode(node.htmlCode, tot),
        pointer: node.pointer,
      });
    }
  }

  return elements;
}

function getElements(allNodes: any, ele: any, tot: any) {
  // const ead = processData(tot);

  const dataTransform = process(tot);

  if (ele === "form") {
    ele = "formSubmitNo";
  }

  const elements = getElementsList(allNodes && allNodes[ele], tot);

  let result = "G";
  const results = dataTransform?.results?.map((r) => r.msg);
  for (const test in tests || {}) {
    const _test = tests[test];
    if (_test.test === ele && results?.includes(test)) {
      result = testsColors[test];
      break;
    }
  }

  return {
    type: "html",
    result,
    elements,
    size: elements.length,
    finalUrl: dataTransform?.metadata?.url,
  };
}

export function getTestRslts(test: any, nodes: any, tot: any) {
  let testResults;

  console.log("Get Test Results");

  const allNodes = nodes;
  const ele = test;

  testResults = getElements(allNodes, ele, tot);

  console.log(testResults);

  return testResults;
}
