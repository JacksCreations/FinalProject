<template>
    <div id="remaining_section">
        <div class="container-fluid" style="float: left; text-align: left;">
            <div style="margin-top: 5px" class="row progressBarRow">
                <div class="col-lg-4">
                    <div>Static {{ usd(staticMonthlyTotal) }}</div>

                </div>

                <div class="col-lg-8">
                    <div class="progress progress-striped active progressBar"  style="background-color: whitesmoke;">
                        <div id="progressBar" class="progress-bar progress-bar-success progressBar"
                            :style="{ width: `${percentOfIncome(staticMonthlyTotal)}%` }">
                        </div>
                    </div>

                </div>
            </div>

            <div class="row progressBarRow">
                <div class="col-lg-4">
                    <div>Control {{ usd(controlMonthlyTotal) }}</div>

                </div>

                <div class="col-lg-8">
                    <div class="progress progress-striped active progressBar"  style="background-color: whitesmoke;">
                        <div class="progress-bar progress-bar-success progressBar"
                            :style="{ width: `${percentOfIncome(controlMonthlyTotal)}%` }">
                        </div>
                    </div>

                </div>
            </div>

            <div class="row progressBarRow">
                <div class="col-lg-4">
                    <div>Dynamic {{ usd(dynamicMonthlyTotal) }}</div>

                </div>

                <div class="col-lg-8">
                    <div class="progress progress-striped active progressBar"  style="background-color: whitesmoke;">
                        <div class="progress-bar progress-bar-success progressBar"
                            :style="{ width: `${percentOfIncome(dynamicMonthlyTotal)}%` }">
                        </div>
                    </div>

                </div>
            </div>

            <div class="row progressBarRow">
                <div class="col-lg-4">
                    Remaining: {{ usd(remaining) }}
                </div>
                <div class="col-lg-8">
                    <div class="progress progress-striped active progressBar" style="background-color: whitesmoke;">
                        <div class="progress-bar progressBar"
                            :style="{ width: `${percentOfIncome(incomeMonthlyTotal - staticMonthlyTotal - controlMonthlyTotal - dynamicMonthlyTotal)}%` }">
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>


</template>

<script>

export default {
    name: 'remaining_section',
    data() {
        return {
            staticExp: this.staticMonthlyTotal,
            control: this.controlMonthlyTotal,
            dynamic: this.dynamicMonthlyTotal,
            income: this.incomeMonthlyTotal,

        }
    },
    props: {
        staticMonthlyTotal: Number,
        controlMonthlyTotal: Number,
        dynamicMonthlyTotal: Number,
        incomeMonthlyTotal: Number,
    },
    computed: {
        remaining() {
            return this.incomeMonthlyTotal - this.staticMonthlyTotal - this.controlMonthlyTotal - this.dynamicMonthlyTotal
        }
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
        percentOfIncome(expense) {

            const percent = expense / this.incomeMonthlyTotal
            return percent * 100
        },

    }
}

</script>