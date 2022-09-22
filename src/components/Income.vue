<template>
    <div id="income_view">
        <div class="container-fluid" style="width: 100%; float: center">

            <!--This form is used to collect data to create an income object that we then post to the api for storage-->
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

            <!--If there are income values in the array, these labels are animated and displayed -->
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

                <!-- Each income in the income array is displayed using a for loop -->
                <div v-for="income in incomeArray" :key="income.id">

                    <!-- Here we use our income row component in the for loop to display each income as a vue -->
                    <IncomeRow :name="income.incomeName" :amount="formatUSD(income.incomeAmount)"
                        :freq="income.incomeFrequency" :remove=removeSourceOfIncome :id=income.id
                        :monthly=income.incomeMonthly></IncomeRow>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

//Imported component used for displaying the objects in rows
import IncomeRow from "./Rows/IncomeRow.vue";

//used to assign id to the object
import { v4 as uuidv4 } from "uuid";

//helper functions imported
import { monthly, usd } from '../assets/helper.js'

//used for calling api
const axios = require('axios')
const API_URL = 'http://localhost:4000/'

export default {
    name: "income_view",
    components: {
        IncomeRow, //used to display the income objects
    },
    //Data array stored in app.vue is passed in so that this component can manipulate the array
    props: {
        appIncomeArray: Array,
    },
    data() {
        return {
            //Values stored for input used to create objects
            inputName: "",
            inputAmount: "",
            inputFrequency: "",
            //the array passed in as a prop is assigned to a value here so that it can be manipulated directly
            incomeArray: this.appIncomeArray,
        };
    },

    //This pulls the income sources from the api and assigns it to our local array
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
    methods: {
        //Computes the total income from all of the income objects in the income array
        totalIncome() {
            let total = 0;
            if (this.incomeArray?.length) {
                for (var i = 0; i < this.incomeArray.length; i++) {
                    total += this.incomeArray[i].incomeMonthly;
                }
            } else {
                return 0;
            }
            this.$emit("getTotalIncome", total); //emits the total although I believe that this could be done solely in the app.vue
            return total;
        },
        //This function adds an income object to the array and DB
        addIncome() {
            //We take all inputted values and create an object
            const income = {
                id: uuidv4(),
                incomeName: this.inputName,
                incomeAmount: parseFloat(this.inputAmount),
                incomeFrequency: this.inputFrequency,
                incomeMonthly: parseFloat(monthly(this.inputFrequency, this.inputAmount).toFixed(2))
            };
            //this object is then pushed to the array
            this.incomeArray.push(income);

            //posts the object to the api
            axios.post(API_URL + 'add/income', income)
                .then(response => this.income.id = response.data.id)

            this.totalIncome() //recomputes the total income

            //clears the input fields
            this.inputName = "";
            this.inputAmount = "";
            this.inputFrequency = "";
        },

        //This function is passed into the income row component and activated by a button click to remove the income from the array and the database
        removeSourceOfIncome(id) {
            if (
                confirm("Are you sure you want to delete this source of income?") ===
                true
            ) {
                //finds the correct income in the array
                let index = 0;
                for (var i = 0; i < this.incomeArray.length; i++) {
                    if (this.incomeArray[i].id === id) { //searches for it by id
                        index = i;
                        break;
                    }
                }
                //removes the income from the array
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
        //Function is used to format number to usd
        formatUSD(number) {
            //calls in usd from helper function and returns number in currency format
            return usd(number)
        }
    },
};

</script>
