export function monthly(freq, amount) {
    if (freq.toLowerCase() === "weekly") {
        const yearly = amount* 52;
        return yearly / 12;
    } else if (freq.toLowerCase() === "bi-weekly") {
        const yearly = amount* 26;
        return yearly / 12;
    } else if (freq.toLowerCase() === "semi-monthly") {
        const yearly = amount* 24;
        return yearly / 12;
    } else if (freq.toLowerCase() === "monthly") {
        const yearly = amount* 12;
        return yearly / 12;
    } else if (freq.toLowerCase() === "quarterly") {
        const yearly = amount* 4;
        return yearly / 12;
    } else if (freq.toLowerCase() === "semi-annually") {
        const yearly = amount* 2;
        return yearly / 12;
    } else if (freq.toLowerCase() === "annually") {
        const yearly = amount* 1;
        return yearly / 12;
    } else {
        return 0;
    }
}