<template>
    <div id="dynamic_form">
        <div class="container">
            <form class="input-group">
                <div class="row ">
                    <div class="col-xs-4 col-md-4">
                        <label class="dynamicFormLabel">Name</label>
                        <input type="text" class="form-control" v-model="name" />
                    </div>
                    <div class="col-xs-2 col-md-2">
                        <label class="dynamicFormLabel">Amount</label>
                        <input type="text" class="form-control" v-model="amount" />
                    </div>
                    <div class="col-xs-4 col-md-4">
                        <label class="dynamicFormLabel">Frequency</label>
                        <select class="form-select" v-model="freq">
                            <option>Weekly</option>
                            <option>Bi-Weekly</option>
                            <option>Semi-Monthly</option>
                            <option>Monthly</option>
                            <option>Quarterly</option>
                            <option>Semi-Annually</option>
                            <option>Annually</option>
                        </select>
                    </div>
                    <div class="col-xs-2 col-md-2">
                        <button style=" width: 100%; margin-top: 38px; min-width: 60px; padding: 5px; width: 60%"
                            class="addButton" type="button" @click="addStaticExpense">
                            ADD
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
// import { StaticExpense } from "@/model/ExpenseModel";
import { v4 as uuidv4 } from "uuid";

const axios = require('axios')
const api = 'http://localhost:4000/'

export default {
    name: "dynamic_form",
    props: {
        expenseType: String,
    },
    data() {
        return {
            name: "",
            amount: "",
            freq: "",
        };
    },
    methods: {
        addStaticExpense() {
            
            const exp = {
                id: uuidv4(),
                type: this.expenseType,
                name: this.name,
                amount: parseFloat(this.amount),
                frequency: this.freq,
                monthly: parseFloat(monthly(this.freq, this.amount).toFixed(2))
            }
            console.log(exp)
            this.$emit("addStaticExpense", exp);

            //adds the committed expense to the committed table
            axios.post(api + 'add/committed', exp)
                .then(response => this.exp.id = response.data.id)

            this.name = ''
            this.amount = ''
            this.freq = ''
        },
    },
};

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
</script>
