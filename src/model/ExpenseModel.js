// When I initially designed the front end of this application I created this expense model data structure using JS classes. 
// After implementing the backend I realized that I didn't need an entire data structure like this. All I needed to do with the forms was create objects to post to the api.

// import { v4 as uuidv4 } from 'uuid';

// export class Debt {
//     constructor(name, monthlyPmt, amountOwed, interestRate) {
//         this._name = name;
//         this._monthlyPmt = monthlyPmt;
//         this._amountOwed = amountOwed;
//         this._interestRate = interestRate;
//         this._id = uuidv4()
//     }

//     showDebt(){
//         return this._name + ' ' + this._amountOwed + ' ' + this._interestRate
//     }

// }

// export class StaticExpense{
//     constructor(type, name, amount, freq) {
//         this._type = type;
//         this._name = name;
//         this._amount = amount;
//         this._freq = freq;
//         this._id = uuidv4()
//     }

//     get monthly() {
//         if (this._freq.toLowerCase() === 'weekly') {
//             const yearly = this._amount * 52
//             return yearly / 12
//         } else if (this._freq.toLowerCase() === 'bi-weekly') {
//             const yearly = this._amount * 26
//             return yearly / 12
//         } else if (this._freq.toLowerCase() === 'semi-monthly') {
//             const yearly = this._amount * 24
//             return yearly / 12
//         } else if (this._freq.toLowerCase() === 'monthly') {
//             const yearly = this._amount * 12
//             return yearly / 12
//         } else if (this._freq.toLowerCase() === 'quarterly') {
//             const yearly = this._amount * 4
//             return yearly / 12
//         } else if (this._freq.toLowerCase() === 'semi-annually') {
//             const yearly = this._amount * 2
//             return yearly / 12
//         } else if (this._freq.toLowerCase() === 'annually') {
//             const yearly = this._amount * 1
//             return yearly / 12
//         } else {
//             return 0
//         }
//     }

//     print(){
//         console.log(this._name)
//         console.log(this._amount)
//         console.log(this._freq)
//     }

// }

// export class ControlExpense {
//     constructor(name, amount, freq) {
//         this._name = name;
//         this._amount = parseInt(amount);
//         this._freq = freq;
//         this._id = uuidv4()
//     }

//     //add weekly computation

//     get monthly() {
//         if (this._freq.toLowerCase() === 'weekly') {
//             const yearly = this._amount * 52
//             return yearly / 12
//         } else if (this._freq.toLowerCase() === 'bi-weekly') {
//             const yearly = this._amount * 26
//             return yearly / 12
//         } else if (this._freq.toLowerCase() === 'semi-monthly') {
//             const yearly = this._amount * 24
//             return yearly / 12
//         } else if (this._freq.toLowerCase() === 'monthly') {
//             const yearly = this._amount * 12
//             return yearly / 12
//         } else if (this._freq.toLowerCase() === 'quarterly') {
//             const yearly = this._amount * 4
//             return yearly / 12
//         } else if (this._freq.toLowerCase() === 'semi-annually') {
//             const yearly = this._amount * 2
//             return yearly / 12
//         } else if (this._freq.toLowerCase() === 'annually') {
//             const yearly = this._amount * 1
//             return yearly / 12
//         } else {
//             return 0
//         }
//     }

//     print(){
//         console.log(this._name)
//         console.log(this._amount)
//         console.log(this._freq)
//     }

// }

// export class DynamicExpense{
//     constructor(termLength, goal, nameOfAcc, amt, freq){
//         this._termLength = termLength,
//         this._goal = goal,
//         this._nameOfAcc = nameOfAcc,
//         this._amt = amt, 
//         this._freq = freq,
//         this._id = uuidv4()
//     }

//     get monthly() {
//         if (this._freq.toLowerCase() === 'weekly') {
//             const yearly = this._amt * 52
//             return yearly / 12
//         } else if (this._freq.toLowerCase() === 'bi-weekly') {
//             const yearly = this._amt * 26
//             return yearly / 12
//         } else if (this._freq.toLowerCase() === 'semi-monthly') {
//             const yearly = this._amt * 24
//             return yearly / 12
//         } else if (this._freq.toLowerCase() === 'monthly') {
//             const yearly = this._amt * 12
//             return yearly / 12
//         } else if (this._freq.toLowerCase() === 'quarterly') {
//             const yearly = this._amt * 4
//             return yearly / 12
//         } else if (this._freq.toLowerCase() === 'semi-annually') {
//             const yearly = this._amt * 2
//             return yearly / 12
//         } else if (this._freq.toLowerCase() === 'annually') {
//             const yearly = this._amt * 1
//             return yearly / 12
//         } else {
//             return 0
//         }
//     }

// }