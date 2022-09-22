<template>
  <div id="App">
    <h1 style="font-weight: bold; font-family: 'Roboto'">JACK'S BUDGET BUCKETS</h1>
    <h6>Independent Study Final Project for IT287</h6>
    <div class="container" style="width: 94%; float: center;">

      <!--This row consists of the nav buttons that change the views-->
      <div class="row" style="margin-bottom: 25px;">
        <div class="col-3">
          <!-- Each of these buttons changes the view value which changes the displayed view -->
          <button class="navButtons" @click="view = 'income'">INCOME</button>
        </div>

        <div class="col-3">
          <button class="navButtons" style="background-color: rgb(239, 226, 106)"
            @click="view = 'static'">COMMITTED</button>
        </div>

        <div class="col-3">
          <button class="navButtons" style="background-color: rgb(56, 79, 239)"
            @click="view = 'control'">WEEKLY</button>
        </div>

        <div class="col-3">
          <button class="navButtons" style="background-color: rgb(236, 46, 67)"
            @click="view = 'dynamic'">FUTURE</button>
        </div>

      </div>

      <!-- This section displays the proper section according to the selected view-->
      <div>
        <!-- INCOME VIEW -->
        <div v-if="view === 'income'" class="remaining">
          <div class="row">
            <div style="padding-left:20px;  text-align: left" class="col-5">
              <h2 id="title">Income</h2>
              <h6 class="subText">Enter your take home pay and other income. </h6>
              <p class="subText">Total take home: {{ usd(totalIncome) }}</p>
            </div>
            <div class="col-7 remaining">
              <Remaining :staticMonthlyTotal=staticExpenseTotal :controlMonthlyTotal=controlExpenseTotal
                :incomeMonthlyTotal=totalIncome :dynamicMonthlyTotal=dynamicExpenseTotal></Remaining>
            </div>
          </div>
        </div>

        <!-- COMMITTED VIEW -->
        <div v-if="view === 'static'">
          <div class="row">
            <div style="text-align: left" class="col-5">
              <h2 id="title">Committed Expenses</h2>
              <p class="subText">Past Commitments</p>
              <p class="subText">Total percent: {{ staticExpensePercent.toFixed(2)}}%</P>
              <p class="subText">Total Monthly expenses: {{usd(staticExpenseTotal)}}</p>
            </div>
            <div class="col-7 remaining">
              <Remaining :staticMonthlyTotal=staticExpenseTotal :controlMonthlyTotal=controlExpenseTotal
                :incomeMonthlyTotal=totalIncome :dynamicMonthlyTotal=dynamicExpenseTotal></Remaining>
            </div>
          </div>
        </div>

        <!-- WEEKLY EXPENSES VIEW -->
        <div v-if="view === 'control'">
          <div style="margin-bottom: 22px" class="row">
            <div style="text-align: left" class="col-5">
              <h2 id="title">Weekly Expenses</h2>
              <p class="subText">Present Choices</p>
              <p class="subText">Total percent: {{controlExpensePercentage}}%</P>
              <p class="subText">Total Weekly: {{usd(controlExpenseWeekly)}} ∙ Total Monthly:
                {{usd(controlExpenseTotal)}}
              </p>
              <p class="subText"> </p>
            </div>

            <div class="col-7 remaining">
              <Remaining :staticMonthlyTotal=staticExpenseTotal :controlMonthlyTotal=controlExpenseTotal
                :incomeMonthlyTotal=totalIncome :dynamicMonthlyTotal=dynamicExpenseTotal></Remaining>
            </div>
          </div>
        </div>


        <!-- FUTURE EXPENSES -->
        <div v-if="view === 'dynamic'">
          <div class="row">
            <div style="text-align: left" class="col-5">
              <h2 id="title">Future Expenses</h2>
              <p style="font-weight: bold; font-family: Roboto" class="subText">Future Wants & Needs</p>
              <p class="subText">Total percent: {{dynamicExpensePercentage}}%</P>
              <p class="subText">Total Monthly: {{usd(dynamicExpenseTotal)}}</p>
            </div>

            <div class="col-7">
              <Remaining :staticMonthlyTotal=staticExpenseTotal :controlMonthlyTotal=controlExpenseTotal
                :incomeMonthlyTotal=totalIncome :dynamicMonthlyTotal=dynamicExpenseTotal></Remaining>
            </div>
          </div>
        </div>
      </div>

      <!--Shows the correct input row depending on what view is currently selected -->
      <!-- We pass in the different arrays and totals as props to the components so that each component can directly manipulate the data -->
      <!-- Our main sets of data are stored in this file and the components manipulate each of these stored values -->
      <div v-if="view === 'income'">
        <Income :appIncomeArray=incomeArray @getTotalIncome="(n) => totalIncome = n" />
      </div>

      <div v-if="view === 'static'">
        <Static :staticArr=staticArray @getStaticTotal="(n) => staticExpenseTotal = n" />
      </div>

      <div v-if="view === 'control'">
        <Control :appControlArray=controlArray @getControlTotal="(n) => controlExpenseTotal = n" />
      </div>

      <div v-if="view === 'dynamic'">
        <Dynamic :dynArr=dynamicArray @getDynamicTotal="(n) => dynamicExpenseTotal = n" />
      </div>

    </div>
  </div>
</template>

<script>

//Using bootstrap and css for styling
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import './assets/style.css'; //CSS file must be imported after the bootstrap

//Here the different view components are imported 
import Income from './components/Income.vue';
import Control from './components/Control.vue';
import Dynamic from './components/Dynamic.vue';
import Static from './components/Static.vue';
import Remaining from './components/Remaining.vue'; //Used to show the progress bar

//Utility function imports
import { getTotalExpensesFromBucket } from './assets/helper.js'

//Used for calling API
const api = 'http://localhost:4000/'
const axios = require('axios')

export default {
  name: 'App',
  data() {
    return {
      //This is where our data values are being stored
      //These values are passed in as props to the different component views where they are being manipulated

      //This is the value that allows us to change our views between the different buckets
      view: 'income',

      //Totals could be computed values
      totalIncome: 0,
      staticExpenseTotal: 0,
      controlExpenseTotal: 0,
      dynamicExpenseTotal: 0,

      //These arrays hold all of the objects
      incomeArray: [],
      staticArray: [],
      controlArray: [],
      dynamicArray: [],
    };
  },
  //These are all of the different component views that we are using in this file.
  //These components are different views that are used to manipulate the stored values.
  //We pass in the stored values as props to these components when they are called.
  components: { Income, Control, Remaining, Dynamic, Static },
  mounted() {
    //Theses are executed when the view is mounted

    //Calls API that returns all of our committed expenses, and returns the total using a helper function
    axios.get(api + 'committed')
      .then(res => {
        this.staticExpenseTotal = getTotalExpensesFromBucket(res.data)
      })
      .catch(function (error) {
        console.log(error);
      });

    //Calls API that returns all of our weekly expenses, and returns the total using a helper function
    axios.get(api + 'weekly')
      .then(res => {
        this.controlExpenseTotal = getTotalExpensesFromBucket(res.data)
      })
      .catch(function (error) {
        console.log(error);
      });

    //Calls API that returns all of our future expenses, and returns the total using a helper function
    axios.get(api + 'future')
      .then(res => {
        this.dynamicExpenseTotal = getTotalExpensesFromBucket(res.data)
      })
      .catch(function (error) {
        console.log(error);
      });

  },
  //Here we have some functions
  methods: {
    //This formatter function returns a float number to US currency
    usd(money) {
    // Create our number formatter.
    var formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    });
    return formatter.format(money)
    }
  },
  computed: {

    //Each of these computed values returns the percentage of the total income the bucket is
    staticExpensePercent() {
      if (this.totalIncome === 0) {
        return 0
      } else {
        return (this.staticExpenseTotal / this.totalIncome).toFixed(4) * 100
      }
    },
    controlExpensePercentage() {
      if (this.totalIncome === 0) {
        return 0
      } else {
        return (this.controlExpenseTotal / this.totalIncome).toFixed(4) * 100
      }
    },
    controlExpenseWeekly() {
      let total = this.controlExpenseTotal * 12;
      return (total / 52).toFixed(2)
    },
    dynamicExpensePercentage() {
      if (this.totalIncome === 0) {
        return 0
      } else {
        return (this.dynamicExpenseTotal / this.totalIncome).toFixed(4) * 100
      }
    },
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}
</style>


