import numeral from "numeral";

export function valueToString(value) {
  if (typeof value === "number" && !isFinite(value)) {
    return String(value);
  } else if (value === "Infinity" || value === "-Infinity" || value === "NaN") {
    return value;
  } else {
    return numeral(value).format("0,0.00");
  }
}

export function valueToNumber(value) {
  if (typeof value === "number" && !isFinite(value)) {
    return value;
  } else if (value === "Infinity" || value === "-Infinity" || value === "NaN") {
    return Number(value);
  } else {
    return numeral(value).value();
  }
}
