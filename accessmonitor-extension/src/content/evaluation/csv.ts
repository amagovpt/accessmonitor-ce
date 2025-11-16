import clone from "lodash.clone";

function calculatePractices(results) {
  let pracs = {};
  pracs["A"] = { "ok": 0, "err": 0, "war": 0 };
  pracs["AA"] = { "ok": 0, "err": 0, "war": 0 };
  pracs["AAA"] = { "ok": 0, "err": 0, "war": 0 };

  for (const r in results) {
    switch(results[r]["lvl"]) {
      case "A":
        pracs["A"][results[r]["color"]] += 1;
        break;
      case "AA":
        pracs["AA"][results[r]["color"]] += 1;
        break;
      case "AAA":
        pracs["AAA"][results[r]["color"]] += 1;
        break;
    }
  }

  return pracs;
}

function newBetterResult(newColor: string, oldColor: string): boolean {
  if (newColor === "ok" && ["war", "err"].includes(oldColor))
    return true;
  else if (newColor === "war" && oldColor === "err")
    return true;
  return false;
}

function updateCSVProcessedData(newData, oldData) {
  let data = clone(newData);

  for (const row in oldData["results"]) {
    if (oldData["results"][row]) {
      let exists = false;
      for (const r in data["results"]) {
        if (data["results"][r]) {
          if (data["results"][r]["msg"] === oldData["results"][row]["msg"]) {
            exists = true;
            if (newBetterResult(data["results"][r]["color"], oldData["results"][row]["color"])) {
              data["results"][r] = clone(oldData["results"][row]);
            }
            break;
          }
        }
      }

      if (!exists) {
        data["results"].push(oldData["results"][row]);
      }
    }
  }

  if (parseFloat(data["metadata"]["score"]) > parseFloat(oldData["metadata"]["score"])) {
    data["metadata"]["score"] = oldData["metadata"]["score"];
  }

  // update number of total results
  data["metadata"]["count_results"] = data["results"].length;

  // combine practices
  data["infoak"] = calculatePractices(data["results"]);

  return data;
}

export function updateCSVProcData(newData, oldData) {
  console.log("Updating CSV Processed Data");

  const csvData = updateCSVProcessedData(newData, oldData);

  console.log(csvData);

  return csvData;
}
