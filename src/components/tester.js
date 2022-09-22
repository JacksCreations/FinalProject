const { v4 } = require("uuid");

class IncomeSource {
  constructor(name, amount, frequency) {
    this._name = name;
    this._amount = amount;
    this._frequency = frequency;
    this._id = v4();
  }
}

let arr = [];
const inc1 = new IncomeSource("a", 1, "monthly");
arr.push(inc1);
const inc2 = new IncomeSource("b", 2, "monthly");
arr.push(inc2);

const inc3 = new IncomeSource("c", 3, "monthly");
arr.push(inc3);

for (var i = 0; i < arr.length; i++) {
  console.log(arr[i]._id);
}

//THIS FUNCTION IS NOT WORKING
function remove(id) {
  let index = 0;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]._id === id) {
        index = i;
        console.log("removing ... " + arr[i]._name)
      break;
    }
  }
  // console.log(this.staticArray[index])

  arr.splice(index, 1);
}

remove(inc3._id)

for (var i = 0; i < arr.length; i++) {
    console.log(arr[i]._id);
  }
  
