<template>
    <div id="controlView">
        <div class="container-fluid">

            <!-- CONTROL ROW -->
            <p style="float: left; font-family: 'Roboto'; margin-top: 5px; margin-bottom: 4px">Add a weekly
                expense...</p>
            <form>
                <div class="row input-group">
                    <div class="col-xs-4 col-md-4">
                        <label class="dynamicFormLabel">Name</label>
                        <input type="text" class="form-control" v-model="controlDesc" />
                    </div>
                    <div class="col-xs-3 col-md-3">
                        <label class="dynamicFormLabel">Amount</label>
                        <input type="text" class="form-control" v-model="controlAmt" />
                    </div>
                    <div class="col-xs-4 col-md-4">
                        <label class="dynamicFormLabel">Frequency</label>
                        <select class="form-select" v-model="controlFreq">
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
                            class="addButton" type="button" @click="addControlExpense">
                            ADD
                        </button>
                    </div>
                </div>
            </form>
            <!-- ROW LABELS -->
            <div class="row">
                <Transition name="slide-fade">
                    <div style="margin-top: 20px; margin-left: -15px;" v-if="controlArray.length > 0">
                        <div style="text-align: left; font-weight: bold" class="row">
                            <div class="col col-xs-1">
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

                            <div class="col col-xs-3">
                                <p>Monthly</p>
                            </div>
                        </div>
                    </div>
                </Transition>

                <div v-for="exp in controlArray" :key="exp.id">
                    <StaticRow :remove=removeExpense :name=exp.name :amount=exp.amount :freq=exp.frequency
                        :monthly=exp.monthly :id=exp.id />
                </div>

            </div>

        </div>




    </div>

</template>

<script>
import StaticRow from './Rows/StaticRow.vue';
import { monthly } from '../assets/helper.js'
import { v4 as uuidv4 } from "uuid";

const axios = require('axios')
const api = 'http://localhost:4000/'



export default {
    name: "controlView",
    data() {
        return {
            controlDesc: "",
            controlAmt: "",
            controlFreq: "",
            controlArray: this.appControlArray
        };
    },
    props: {
        appControlArray: Array,
    },
    mounted() {
        axios.get(api + 'weekly')
            .then(res => {
                this.controlArray = res.data
                this.totalExpenses()
            })
            .catch(function (error) {
                console.log(error);
            });
    },
    methods: {
        addControlExpense() {
            const exp = {
                id: uuidv4(),
                type: 'weekly',
                name: this.controlDesc,
                amount: parseFloat(this.controlAmt),
                frequency: this.controlFreq,
                monthly: parseFloat(monthly(this.controlFreq, this.controlAmt).toFixed(2))
            }
            this.controlArray.push(exp);

            //adds the committed expense to the committed table
            axios.post(api + 'add/weekly', exp)
                .then(response => this.exp.id = response.data.id)

            this.totalExpenses()
            this.controlDesc = '';
            this.controlAmt = '';
            this.controlFreq = '';

        },
        removeExpense(id) {
            if (
                confirm("Are you sure you want to delete this expense?") ===
                true
            ) {
                let index = 0;
                for (var i = 0; i < this.controlArray.length; i++) {
                    if (this.controlArray[i]._id === id) {
                        index = i;
                        break;
                    }
                }
                this.controlArray.splice(index, 1);

                 //Calls api delete requests and removes expense from the DB with specific ID
                 console.log(api + 'remove/weekly/' + id)
                 axios.delete(api + 'remove/weekly/' + id)
                    .then(response => {
                        console.log(response);
                    });

                this.totalExpenses()
            }
        },

        totalExpenses() {
            let total = 0;
            let monthly = 0;
            if (this.controlArray?.length) {
                for (var i = 0; i < this.controlArray.length; i++) {
                    total += this.controlArray[i].amount;
                    monthly += this.controlArray[i].monthly;
                }
            }
            else {
                return total;
            }
            this.$emit("getControlTotal", monthly);
            return monthly;
        },
    },

    components: { StaticRow }
}


</script>
