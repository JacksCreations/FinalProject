<template>
    <div id="dynamic_row">
        <div class="container">
            <div class="row incomeRow dynamicRow">
                <div class="col col-xs-1">
                    <button style="background-color: transparent; border: 0px; font-weight: bold; color: red" class="bi bi-x-lg" type="button"
                        @click="remove(this.id)">X</button>
                </div>
                <div style="margin-left: -23px" class="col col-xs-2">
                    <p>{{ this.termLength }}</p>
                </div>
                <div class="col col-xs-2">
                    <p>{{ this.name }}</p>
                </div>

                <div class="col col-xs-2">
                    <p>{{ usd(this.amount) }}</p>
                </div>

                <div class="col col-xs-2">
                    <p>{{ this.freq }}</p>
                </div>

                <div class="col col-xs-3">
                    <p>{{ usd(this.monthly) }}</p>
                </div>

            </div>

        </div>
    </div>
</template>


<script>
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
export default {
    name: 'dynamic_row',
    data() {
        return {
            animate: true,
        }
    },
    props: {
        remove: Function,
        goal: String,
        name: String,
        amount: Number,
        freq: String,
        monthly: Number,
        id: String,
        termLength: String,
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
    }
}



</script>