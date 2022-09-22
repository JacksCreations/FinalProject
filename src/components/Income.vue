<template>
    <div id="income_view">
        <!-- INPUT INCOME SOURCES SECTION -->
        <div class="container-fluid" style="width: 100%; float: center">

            <p style="float: left; font-family: 'Roboto'; margin-top: 5px; margin-bottom: 5px">Add a source of income...
            </p>
            <form>
                <div class="row input-group">
                    <div class="col-xs-4 col-md-4">
                        <label class="dynamicFormLabel">Name</label>
                        <input type="text" class="form-control" v-model="inputName" />
                    </div>
                    <div class="col-xs-3 col-md-3">
                        <label class="dynamicFormLabel">Amount</label>
                        <input type="text" class="form-control" v-model="inputAmount" />
                    </div>
                    <div class="col-xs-4 col-md-4">
                        <label class="dynamicFormLabel">Frequency</label>
                        <select class="form-select" v-model="inputFrequency">
                            <option>Weekly</option>
                            <option>Bi-Weekly</option>
                            <option>Semi-Monthly</option>
                            <option>Monthly</option>
                            <option>Quarterly</option>
                            <option>Semi-Annually</option>
                            <option>Annually</option>
                        </select>
                    </div>
                    <div class="col-xs-1 col-md-1">
                        <button style=" width: 100%; margin-top: 38px; min-width: 60px; padding: 5px; width: 60%"
                            class="addButton" type="button" @click="addIncome">
                            ADD
                        </button>
                    </div>
                </div>
            </form>

            <div class="row">
                <Transition name="slide-fade">
                    <div style="margin-top: 20px;" v-if="incomeArray.length > 0">
                        <div style="text-align: left; font-weight: bold" class="row">
                            <div class="col col-xs-2">
                                <p></p>
                            </div>
                            <div class="col col-xs-3">
                                <p>Name</p>
                            </div>

                            <div class="col col-xs-2">
                                <p>Amount</p>
                            </div>

                            <div class="col col-xs-3">
                                <p>Frequency</p>
                            </div>

                            <div class="col col-xs-2">
                                <p>Monthly</p>
                            </div>
                        </div>
                    </div>
                </Transition>

                <div v-for="income in incomeArray" :key="income.id">
                    <IncomeRow :name="income.incomeName" :amount="usd(income.incomeAmount)"
                        :freq="income.incomeFrequency" :remove=removeSourceOfIncome
                        :id=income.id :monthly=income.incomeMonthly></IncomeRow>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import IncomeRow from "./Rows/IncomeRow.vue";
const axios = require('axios')
const API_URL = 'http://localhost:4000/'

function monthly(freq, amount) {
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

export default {
    name: "income_view",
    components: {
        IncomeRow,
    },
    props: {
        appIncomeArray: Array,
    },
    data() {
        return {
            inputName: "",
            inputAmount: "",
            inputFrequency: "",
            incomeArray: this.appIncomeArray,
        };
    },

    //This pulls the income sources from the api and displays them
    mounted() {
        axios.get(API_URL + 'income')
            .then(res => {
                this.incomeArray = res.data
                this.totalIncome()
            })
            .catch(function (error) {
                console.log(error);
            });
    },
    computed: {
        
    },
    methods: {
        totalIncome() {
            let total = 0;
            if (this.incomeArray?.length) {
                for (var i = 0; i < this.incomeArray.length; i++) {
                    total += this.incomeArray[i].incomeMonthly;
                }
            } else {
                return 0;
            }
            this.$emit("getTotalIncome", total);
            return total;
        },
        addIncome() {

            //I didn't need to make a javascript class, just an object
            // const income = new IncomeSource(
            //     this.inputName,
            //     this.inputAmount,
            //     this.inputFrequency
            // );

            const income = {
                id: uuidv4(),
                incomeName: this.inputName,
                incomeAmount: parseFloat(this.inputAmount),
                incomeFrequency: this.inputFrequency,
                incomeMonthly: parseFloat(monthly(this.inputFrequency, this.inputAmount).toFixed(2))
            };
            this.incomeArray.push(income);

            //post income to api
            axios.post(API_URL + 'add/income', income)
                .then(response => this.income.id = response.data.id)


            this.totalIncome()
            this.resetFields();
        },
        resetFields() {
            this.inputName = "";
            this.inputAmount = "";
            this.inputFrequency = "";
        },
        usd(money) {
            // Create our number formatter.
            var formatter = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
            });
            return formatter.format(money);
        },
        removeSourceOfIncome(id) {
            if (
                confirm("Are you sure you want to delete this source of income?") ===
                true
            ) {
                let index = 0;
                for (var i = 0; i < this.incomeArray.length; i++) {
                    if (this.incomeArray[i].id === id) {
                        index = i;
                        break;
                    }
                }

                this.incomeArray.splice(index, 1);

                //Calls api delete requests and removes source of income from the DB with specific ID
                axios.delete(API_URL + 'remove/income/' + id)
                    .then(response => {
                        console.log(response);
                    });

                //recomputes the total income
                //emits the total income back to the main inside the called function
                this.totalIncome()
            }
        },
    },
};

//IMPORT FROM FOLDER NOT WORKING - import IncomeSource from './components/IncomeSource.js'
// class IncomeSource {
//     constructor(name, amount, frequency) {
//         this.incomeName = name;
//         amount= amount;
//         freq = frequency;
//         this.id = uuidv4();
//     }

//     get monthly() {
//         if (freq.toLowerCase() === "weekly") {
//             const yearly = amount* 52;
//             return yearly / 12;
//         } else if (freq.toLowerCase() === "bi-weekly") {
//             const yearly = amount* 26;
//             return yearly / 12;
//         } else if (freq.toLowerCase() === "semi-monthly") {
//             const yearly = amount* 24;
//             return yearly / 12;
//         } else if (freq.toLowerCase() === "monthly") {
//             const yearly = amount* 12;
//             return yearly / 12;
//         } else if (freq.toLowerCase() === "quarterly") {
//             const yearly = amount* 4;
//             return yearly / 12;
//         } else if (freq.toLowerCase() === "semi-annually") {
//             const yearly = amount* 2;
//             return yearly / 12;
//         } else if (freq.toLowerCase() === "annually") {
//             const yearly = amount* 1;
//             return yearly / 12;
//         } else {
//             return 0;
//         }
//     }

//     getIncome() {
//         return (
//             this.incomeName +
//             " " +
//             amount+
//             " " +
//             freq.toLowerCase() +
//             " " +
//             this._id +
//             " " +
//             this.monthly
//         );
//     }
// }
</script>
