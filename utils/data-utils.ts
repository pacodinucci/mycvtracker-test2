const displayPrice = (num: number, fractionDigits?: number): string => {
  const numStr = !!fractionDigits ? num.toFixed(fractionDigits) : num.toString();

  const str = numStr.toString().split(".");
  str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (str.length > 0 && str[1] == "00") {
    return str[0];
  }

  return str.join(".");
};

export { displayPrice };
