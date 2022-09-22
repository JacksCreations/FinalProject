//Takes in a frequency and amount and returns how much that is per month
export function monthly(freq, amount) {
  if (freq.toLowerCase() === "weekly") {
    const yearly = amount * 52;
    return yearly / 12;
  } else if (freq.toLowerCase() === "bi-weekly") {
    const yearly = amount * 26;
    return yearly / 12;
  } else if (freq.toLowerCase() === "semi-monthly") {
    const yearly = amount * 24;
    return yearly / 12;
  } else if (freq.toLowerCase() === "monthly") {
    const yearly = amount * 12;
    return yearly / 12;
  } else if (freq.toLowerCase() === "quarterly") {
    const yearly = amount * 4;
    return yearly / 12;
  } else if (freq.toLowerCase() === "semi-annually") {
    const yearly = amount * 2;
    return yearly / 12;
  } else if (freq.toLowerCase() === "annually") {
    const yearly = amount * 1;
    return yearly / 12;
  } else {
    return 0;
  }
}

//Sums the value of monthly amount in an object array
export function getTotalExpensesFromBucket(objArr) {
  let total = 0.0;
  for (var i = 0; i < objArr.length; i++) {
    total += objArr[i].monthly;
  }
  return total;
}

//formats number to us currency
export function usd(money) {
  // Create our number formatter.
  var formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
  return formatter.format(money);
}
