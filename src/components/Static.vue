<template>
    <div class="static_view">
        <div class="container">

            <!--These buttons change the value of view to show specified expenses-->
            <div style="margin-top: 20px" class="row">
                <div class="col col-xs-2">
                    <!-- Buttons change color if selected to show the specified view -->
                    <button v-bind:style="{ 'background-color': showSelectedBG('debt'), color: showSelectedFG('debt') }"
                        @click="view = 'debt'" class="dynamicTerms">
                        Debt
                    </button>
                </div>

                <div class="col col-xs-2">
                    <button
                        v-bind:style="{ 'background-color': showSelectedBG('insurance'), color: showSelectedFG('insurance') }"
                        @click="view = 'insurance'" class="dynamicTerms">
                        Insurance
                    </button>
                </div>

                <div class="col col-xs-2">
                    <button
                        v-bind:style="{ 'background-color': showSelectedBG('taxes'), color: showSelectedFG('taxes') }"
                        @click="view = 'taxes'" class="dynamicTerms">Taxes</button>
                </div>
                <div class="col col-xs-2">
                    <button
                        v-bind:style="{ 'background-color': showSelectedBG('utilities'), color: showSelectedFG('utilities') }"
                        @click=" view = 'utilities'" class="dynamicTerms">Utilities</button>
                </div>
                <div class="col col-xs-2">
                    <button
                        v-bind:style="{ 'background-color': showSelectedBG('other'), color: showSelectedFG('other') }"
                        @click="view = 'other'" class="dynamicTerms">Other</button>
                </div>
                <div class="col col-xs-2">
                    <button v-bind:style="{ 'background-color': showSelectedBG('all'), color: showSelectedFG('all') }"
                        @click="view = 'all'" class="dynamicTerms">All</button>
                </div>
            </div>

            <!-- This row is used to show the input field -->
            <div class="row">
                <!-- Doesn't show the input field if the view is = to show all expenses -->
                <div v-if="view !== 'all'">
                    <p style="float: left; font-family: 'Roboto'; margin-top: 20px; margin-bottom: -10px">Add {{
                    view
                    }}
                        expense...</p>
                    <p style="float: right; font-family: 'Roboto'; margin-top: 20px; margin-bottom: -10px">Yearly
                        {{view}} total: {{usd(getYearly)}}</p>

                    <!-- Input form field to add specific type of expense -->
                    <StaticInputForm :expenseType="view" @addStaticExpense="(exp) => addObjToAppArr(exp)" />

                </div>

                <!-- Shows labels if the array is populated -->
                <div style="margin-top: 10px;" v-if="getTermArray.length > 0">
                    <Transition name="slide-fade">
                        <div style="margin-top: 20px;" v-if="staticArray.length > 0">
                            <div style="margin-left: -30px; text-align: left; font-weight: bold" class="row">
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
                </div>
                <div style="margin-top: 20px;" v-else>
                    <p>No {{this.view}} expenses...</p>
                </div>

                <!-- Displays all of the expenses in the specific view -->
                <!-- Uses function getTermArray that returns a specific array of expenses according to the selected view -->
                <div v-for="exp in getTermArray" :key="exp.id">
                    <StaticRow :remove=removeExpense :name=exp.name :amount=exp.amount :freq=exp.frequency
                        :monthly=exp.monthly :id=exp.id />
                </div>

            </div>
        </div>
    </div>
</template>

<script>

//Imported components
//These are used to input the expenses and to display them
import StaticInputForm from './StaticInputForm.vue';
import StaticRow from './Rows/StaticRow.vue';

//helper functions imported
import { usd } from '../assets/helper.js'


//use for api
const axios = require('axios')
const api = 'http://localhost:4000/'

export default {
    name: 'static_view',
    props: {
        staticArr: Array, //stored value array passed in from app.vue
    },
    data() {
        return {
            view: 'debt',
            staticArray: this.staticArr, //assigned prop to this value so that it can be manipulated
        };
    },
    //gets all of the committed expenses from the api endpoint
    mounted() {
        axios.get(api + 'committed')
            .then(res => {
                this.staticArray = res.data
                this.totalExpenses()
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    computed: {
        //returns a specific array of expenses according to the selected view 
        getTermArray() {
            let debtArr = this.staticArray.filter(exp => exp.type === 'debt')
            let insArr = this.staticArray.filter(exp => exp.type === 'insurance')
            let taxArr = this.staticArray.filter(exp => exp.type === 'taxes')
            let utlArr = this.staticArray.filter(exp => exp.type === 'utilities')
            let otherArr = this.staticArray.filter(exp => exp.type === 'other')
            let all = this.staticArray;

            switch (this.view) {
                case 'debt':
                    return debtArr;
                case 'insurance':
                    return insArr;
                case 'taxes':
                    return taxArr;
                case 'utilities':
                    return utlArr;
                case 'other':
                    return otherArr;
                case 'all':
                    return all;

                default:
                    return ["not working"]
            }

        },
        getYearly() {
            let total = 0;
            for (var i = 0; i < this.getTermArray.length; i++) {
                total += this.getTermArray[i].monthly * 12
            }

            return total
        }
    },
    methods: {
        //computes total expenses in the array
        totalExpenses() {
            let total = 0
            for (var i = 0; i < this.staticArray.length; i++) {
                total += this.staticArray[i].monthly
            }
            this.$emit('getStaticTotal', total)
            return total

        },
        //staticInputForm returns object and that object is added to the array here
        addObjToAppArr(obj) {
            this.staticArray.push(obj)
            this.totalExpenses()
        },

        //used to remove see income vue for more information as to how this works
        removeExpense(id) {
            if (
                confirm("Are you sure you want to delete this source of income?") ===
                true
            ) {
                let index = 0;
                for (var i = 0; i < this.staticArray.length; i++) {
                    if (this.staticArray[i].id === id) {
                        index = i;
                        break;
                    }
                }
                this.staticArray.splice(index, 1);

                 //Calls api delete requests and removes expense from the DB with specific ID
                 console.log(api + 'remove/committed/' + id)
                 axios.delete(api + 'remove/committed/' + id)
                    .then(response => {
                        console.log(response);
                    });

                this.totalExpenses()

            }
        },
        //returns a color to specify which view is selected
        showSelectedBG(view) {
            if (this.view === view) {
                return 'rgba(28, 111, 23, 0.8)'
            } else {
                return '#FFFFFF'
            }
        },
        //returns a color to specify which view is selected
        showSelectedFG(view) {
            if (this.view === view) {
                return '#FFFFFF'
            } else {
                return 'rgba(28, 111, 23, 0.8)'
            }
        },

        //calls helper function and formats
        usd(money) {
            return usd(money)
        },

    },

    components: { StaticInputForm, StaticRow }
};



</script>
