import clone from "lodash.clone";

function updateCSVProcessedData(newData, oldData) {
  let data = clone(newData);

  for (const row in oldData["results"]) {
    if (oldData["results"][row]) {
      let exists = false;
      for (const r in data["results"]) {
        if (data["results"][r]) {
          if (data["results"][r]["msg"] === oldData["results"][row]["msg"]) {
            exists = true;
            if (parseInt(data["results"][r]["value"]) > parseInt(oldData["results"][row]["value"])) {
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

  return data;
}

export function updateCSVProcData(newData, oldData) {
  console.log("Updating CSV Processed Data");

  const csvData = updateCSVProcessedData(newData, oldData);

  console.log(csvData);

  return csvData;
}
