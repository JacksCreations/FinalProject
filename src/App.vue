<template>
  <div id="App">
    <h1 style="font-weight: bold; font-family: 'Roboto'">JACK'S BUDGET BUCKETS</h1>
    <h6>Independent Study Final Project for IT287</h6>
    <div class="container" style="width: 94%; float: center;">
      <div class="row" style="margin-bottom: 25px;">
        <!-- <h1 id="mainPageTitle">J</h1> -->
        <div class="col-3">
          <button class="navButtons" @click="changeView('income')">INCOME</button>
        </div>

        <div class="col-3">
          <button class="navButtons" style="background-color: rgb(239, 226, 106)" @click="changeView('static')">COMMITTED</button>
        </div>

        <div class="col-3">
          <button class="navButtons" style="background-color: rgb(56, 79, 239)" @click="changeView('control')">WEEKLY</button>
        </div>

        <div class="col-3">
          <button class="navButtons" style="background-color: rgb(236, 46, 67)" @click="changeView('dynamic')">FUTURE</button>
        </div>

      </div>


      <!-- THIS SECTION USES IF STATEMENTS TO DETERMINE THE SECOND ROW -->
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
            <p class="subText">Total Weekly: {{usd(controlExpenseWeekly)}} ∙ Total Monthly: {{usd(controlExpenseTotal)}}
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

      <!------------------------- INPUT SECTIONS FOR EACH BUCKET ---------------------------->
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
        <Dynamic :dynArr=dynamicArray
          @getDynamicTotal="(n) => dynamicExpenseTotal = n" />
      </div>





    </div>
  </div>
</template>

<script>
import Income from './components/Income.vue';
// import Static from './components/Static.vue';
import Control from './components/Control.vue';
import Dynamic from './components/Dynamic.vue';
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import Remaining from './components/Remaining.vue';
import './assets/style.css';
import Static from './components/Static.vue';

const api = 'http://localhost:4000/'
const axios = require('axios')

export default {
  name: 'App',
  data() {
    return {
      totalIncome: 0,
      staticExpenseTotal: 0,
      controlExpenseTotal: 0,
      dynamicExpenseTotal: 0,
      view: 'income',

      //DATA ARRAYS
      incomeArray: [],
      staticArray: [],
      controlArray: [],
      dynamicArray: [],
    };
  },
  mounted() {
    axios.get(api + 'committed')
      .then(res => {
        this.staticExpenseTotal = getTotalExpensesFromBucket(res.data)
      })
      .catch(function (error) {
        console.log(error);
      });
    
    //computes weekly total from all weekly expense API endpoint
    axios.get(api + 'weekly')
    .then(res => {
        this.controlExpenseTotal = getTotalExpensesFromBucket(res.data)
      })
      .catch(function (error) {
        console.log(error);
      });

    //computes expenses total from all future expense API endpoint
    axios.get(api + 'future')
    .then(res => {
        this.dynamicExpenseTotal = getTotalExpensesFromBucket(res.data)
      })
      .catch(function (error) {
        console.log(error);
      });

  },
  components: {
    Income,
    Control,
    Remaining,
    Dynamic,
    Static
  },
  methods: {
    usd(money) {
      // Create our number formatter.
      var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2

      });
      return formatter.format(money)

    },
    changeView(view) {
      this.view = view
    }
  },
  computed: {
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

function getTotalExpensesFromBucket(objArr) {
  let total = 0.00
  for (var i = 0; i < objArr.length; i++) {
    total += objArr[i].monthly
  }
  return total
}
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
