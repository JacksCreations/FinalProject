
<template>
    <div id="static_row">
        <div class="container">
            <div class="row incomeRow">
                <div class="col col-xs-1">
                    <button style="background-color: transparent; border: 0px; font-weight: bold; color: red" class="bi bi-x-lg" type="button"
                        @click="remove(this.id)">X</button>
                </div>
                <div style="margin-left: -23px" class="col col-xs-3">
                    <p>{{ this.name }}</p>
                </div>

                <div class="col col-xs-2">
                    <p>{{ usd(this.amount) }}</p>
                </div>

                <div class="col col-xs-3">
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
    name: 'static_row',
    data() {
        return {
        }
    },
    props: {
        remove: Function,
        name: String,
        amount: Number,
        freq: String,
        monthly: Number,
        id: String
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
<!-- <template>
    <div id="static_row">
        <div style="width: 100%; text-align: left; margin-top: 15px;" class="container-fluid">
            <div style="background-color:aliceblue;" class="row">
            <div class="col-1">
                <button class="bi bi-trash3" type="button" @click="remove"></button>
            </div>
                <div class="col-3">
                    {{ this.name }}
                </div>
                <div class="col-3">
                    {{ usd(this.amount) }}
                </div>
                <div class="col-3">
                    {{ this.freq }}
                </div>
                <div class="col-2">
                    {{usd(this.monthly) }}
                </div>
            </div>
        </div>

    </div>

</template>

<script>
export default {
    name: 'static_row',
    data() {
        return {

        }
    },
    props: {
        name: String,
        amount: parseInt(String),
        freq: String,
        remove: Function

    },
    computed: {
        monthly() {
            if (this.freq.toLowerCase() === 'weekly') {
                const yearly = this.amount * 52
                return yearly / 12
            } else if (this.freq.toLowerCase() === 'bi-weekly') {
                const yearly = this.amount * 26
                return yearly / 12
            } else if (this.freq.toLowerCase() === 'semi-monthly') {
                const yearly = this.amount * 24
                return yearly / 12
            } else if (this.freq.toLowerCase() === 'monthly') {
                const yearly = this.amount * 12
                return yearly / 12
            } else if (this.freq.toLowerCase() === 'quarterly') {
                const yearly = this.amount * 4
                return yearly / 12
            } else if (this.freq.toLowerCase() === 'semi-annually') {
                const yearly = this.amount * 2
                return yearly / 12
            } else if (this.freq.toLowerCase() === 'annually') {
                const yearly = this.amount * 1
                return yearly / 12
            } else {
                return 0
            }
        }
    },
    methods: {
        usd(money) {
            // Create our number formatter.
            var formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0

            });
            return formatter.format(money)

        },
    }

}

</script> -->