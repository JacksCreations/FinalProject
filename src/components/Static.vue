<template>
    <div class="static_view">
        <div class="container">

            <!--BUTTONS TO SELECT THE TYPE OF EXPENSE-->
            <div style="margin-top: 20px" class="row">
                <div class="col col-xs-2">
                    <button v-bind:style="{ 'background-color': showSelectedBG('debt'), color: showSelectedFG('debt') }"
                        @click="changeView('debt')" class="dynamicTerms">
                        Debt
                    </button>
                </div>

                <div class="col col-xs-2">
                    <button
                        v-bind:style="{ 'background-color': showSelectedBG('insurance'), color: showSelectedFG('insurance') }"
                        @click="changeView('insurance')" class="dynamicTerms">
                        Insurance
                    </button>
                </div>

                <div class="col col-xs-2">
                    <button
                        v-bind:style="{ 'background-color': showSelectedBG('taxes'), color: showSelectedFG('taxes') }"
                        @click="changeView('taxes')" class="dynamicTerms">Taxes</button>
                </div>
                <div class="col col-xs-2">
                    <button
                        v-bind:style="{ 'background-color': showSelectedBG('utilities'), color: showSelectedFG('utilities') }"
                        @click="changeView('utilities')" class="dynamicTerms">Utilities</button>
                </div>
                <div class="col col-xs-2">
                    <button
                        v-bind:style="{ 'background-color': showSelectedBG('other'), color: showSelectedFG('other') }"
                        @click="changeView('other')" class="dynamicTerms">Other</button>
                </div>
                <div class="col col-xs-2">
                    <button v-bind:style="{ 'background-color': showSelectedBG('all'), color: showSelectedFG('all') }"
                        @click="changeView('all')" class="dynamicTerms">All</button>
                </div>
            </div>

            <div class="row">


                <div v-if="view !== 'all'">
                    <p style="float: left; font-family: 'Roboto'; margin-top: 20px; margin-bottom: -10px">Add {{
                    view
                    }}
                        expense...</p>
                    <p style="float: right; font-family: 'Roboto'; margin-top: 20px; margin-bottom: -10px">Yearly
                        {{view}} total: {{usd(getYearly)}}</p>
                    <StaticInputForm :expenseType="view" @addStaticExpense="(exp) => addObjToAppArr(exp)" />

                </div>

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


                <div v-for="exp in getTermArray" :key="exp.id">
                    <StaticRow :remove=removeExpense :name=exp.name :amount=exp.amount :freq=exp.frequency
                        :monthly=exp.monthly :id=exp.id />
                </div>

            </div>

        </div>
    </div>
</template>

<script>

import StaticInputForm from './StaticInputForm.vue';
import StaticRow from './Rows/StaticRow.vue';
const axios = require('axios')
const api = 'http://localhost:4000/'


export default {
    name: 'static_view',
    props: {
        staticArr: Array,
    },
    data() {
        return {
            view: 'debt',
            staticArray: this.staticArr,
        };
    },

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
        totalExpenses() {
            let total = 0
            for (var i = 0; i < this.staticArray.length; i++) {
                total += this.staticArray[i].monthly
            }
            this.$emit('getStaticTotal', total)
            return total

        },
        changeView(view) {
            this.view = view;
        },
        addObjToAppArr(obj) {
            this.staticArray.push(obj)
            this.totalExpenses()
            
        },
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
        showSelectedBG(view) {
            if (this.view === view) {
                return 'rgba(28, 111, 23, 0.8)'
            } else {
                return '#FFFFFF'
            }
        },
        showSelectedFG(view) {
            if (this.view === view) {
                return '#FFFFFF'
            } else {
                return 'rgba(28, 111, 23, 0.8)'
            }
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

    },

    components: { StaticInputForm, StaticRow }
};



</script>
