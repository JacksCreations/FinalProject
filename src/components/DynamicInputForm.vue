<template>
    <div id="dynamic_form">
        <div style="margin-top: 10px" class="container">
            <form class="input-group">
                <div class="row ">
                    <div class="col-xs-3 col-md-3">
                        <label class="dynamicFormLabel">Goal</label>
                        <input type="text" class="form-control" v-model="goal" />
                    </div>
                    <div class="col-xs-3 col-md-3">
                        <label class="dynamicFormLabel">Name</label>
                        <input type="text" class="form-control" v-model="nameOfAcc" />
                    </div>
                    <div class="col-xs-2 col-md-2">
                        <label class="dynamicFormLabel">Amount</label>
                        <input type="text" class="form-control" v-model="amt" />
                    </div>
                    <div class="col-xs-3 col-md-3">
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
                    <div class="col-xs-1 col-md-1">
                    <button style=" width: 100%; margin-top: 38px; min-width: 60px; padding: 5px; width: 60%" class="addButton" type="button"
                        @click="addDynamicExpense">
                        ADD
                    </button>
                </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>

import { monthly } from '../assets/formatter.js'
import { v4 as uuidv4 } from "uuid";

const axios = require('axios')
const api = 'http://localhost:4000/'

export default {
    name: "dynamic_form",
    props: {
        termLength: String,
    },
    data() {
        return {
            goal: "",
            nameOfAcc: "",
            amt: "",
            freq: "",
        };
    },

    methods: {
        addDynamicExpense() {
            const exp = {
                id: uuidv4(),
                type: 'future',
                length: this.termLength,
                goal: this.goal,
                name: this.nameOfAcc,
                amount: parseFloat(this.amt),
                frequency: this.freq,
                monthly: parseFloat(monthly(this.freq, this.amt).toFixed(2))
            }
            console.log(exp)

             //adds the committed expense to the committed table
             axios.post(api + 'add/future', exp)
                .then(response => this.exp.id = response.data.id)
            
            this.$emit("addExpense", exp);

            this.goal = ''
            this.nameOfAcc = ''
            this.amt = ''
            this.freq = ''
        },
    },
};
</script>
