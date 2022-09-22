<style>
.bluBG {
  background-color: blue;
}
</style>

<template>
  <div id="dynamic_view">
    <div class="container">
      <div style="margin-top: 20px" class="row">
        <div class="col col-xs-2">
          <!-- COLUMN HERE FOR SPACING -->
        </div>
        <div class="col col-xs-2">
          <button v-bind:style="{ 'background-color': showSelectedBG('short'), color: showSelectedFG('short') }"
            @click="changeView('short')" class="dynamicTerms">
            Short
          </button>
        </div>

        <div class="col col-xs-2">
          <button
            v-bind:style="{ 'background-color': showSelectedBG('intermediate'), color: showSelectedFG('intermediate') }"
            @click="changeView('intermediate')" class="dynamicTerms">
            Intermediate
          </button>
        </div>

        <div class="col col-xs-2">
          <button v-bind:style="{ 'background-color': showSelectedBG('long'), color: showSelectedFG('long') }"
            @click="changeView('long')" class="dynamicTerms">Long</button>
        </div>
        <div class="col col-xs-2">
          <button v-bind:style="{ 'background-color': showSelectedBG('all'), color: showSelectedFG('all') }"
            @click="changeView('all')" class="dynamicTerms">All</button>
        </div>
        <div class="col col-xs-2">
          <!-- COLUMN HERE FOR SPACING -->
        </div>
      </div>

      <div class="row">

        <div v-if="view !== 'all'">
          <DynamicInputForm :termLength="view" @addExpense="(obj) => addObjToAppArr(obj)" />


        </div>

        <Transition name="slide-fade">
          <div style="margin-top: 25px; margin-left: -6px;" v-if="getTermArray.length > 0">
            <div style="text-align: left; font-weight: bold" class="row">
              <div class="col col-xs-1">
                <p></p>
              </div>
              <div class="col col-xs-2">
                <p>Length</p>
              </div>
              <div class="col col-xs-2">
                <p>Name</p>
              </div>

              <div class="col col-xs-2">
                <p>Amount</p>
              </div>

              <div class="col col-xs-2">
                <p>Frequency</p>
              </div>

              <div class="col col-xs-3">
                <p>Monthly</p>
              </div>
            </div>
          </div>
        </Transition>

        <div v-for="exp in getTermArray" :key="exp.id">
          <DynamicRow :termLength=exp.length :remove=removeExpense :goal=exp.goal :name=exp.name :amount=exp.amount
            :freq=exp.frequency :monthly=exp.monthly :id=exp.id />
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import DynamicInputForm from "./DynamicInputForm.vue";
import DynamicRow from "./Rows/DynamicRow.vue";

const axios = require('axios')
const api = 'http://localhost:4000/'

export default {
  name: "dynamic_view",
  components: {
    DynamicInputForm,
    DynamicRow,
  },

  props: {
    dynArr: Array,
  },
  data() {
    return {
      view: 'short',
      dynamicArray: this.dynArr,
    };
  },
  mounted() {
    axios.get(api + 'future')
      .then(res => {
        this.dynamicArray = res.data
        this.totalExpenses()
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  computed: {

    getTermArray() {

      let short = this.dynamicArray.filter(exp => exp.length === 'short')
      let intermediate = this.dynamicArray.filter(exp => exp.length === 'intermediate')
      let long = this.dynamicArray.filter(exp => exp.length === 'long')

      switch (this.view) {
        case 'short':
          return short;
        case 'intermediate':
          return intermediate;
        case 'long':
          return long;
        default:
          return this.dynamicArray
      }

    }
  },
  methods: {
    totalExpenses() {
      let total = 0;
      let monthly = 0;
      if (this.dynamicArray?.length) {
        for (var i = 0; i < this.dynamicArray.length; i++) {
          total += this.dynamicArray[i].amount;
          monthly += this.dynamicArray[i].monthly;
        }
      } else {
        return total;
      }
      this.$emit("getDynamicTotal", monthly);
      return monthly;
    },
    changeView(view) {
      this.view = view;

    },
    addObjToAppArr(obj) {
      this.dynamicArray.push(obj)
      this.totalExpenses()

    },
    removeExpense(id) {
      if (
        confirm("Are you sure you want to delete this expense?") ===
        true
      ) {
        let index = 0;
        for (var i = 0; i < this.dynamicArray.length; i++) {
          if (this.dynamicArray[i]._id === id) {
            index = i;
            break;
          }
        }
        this.dynamicArray.splice(index, 1);

        //Calls api delete requests and removes expense from the DB with specific ID
        console.log(api + 'remove/future/' + id)
        axios.delete(api + 'remove/future/' + id)
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
  }
};
</script>