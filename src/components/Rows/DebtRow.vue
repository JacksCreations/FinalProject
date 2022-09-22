<template>
    <div id="debt_row">
        <div style="width: 100%; text-align: left; margin-top: 15px;" class="container-fluid">
            <div style="background-color:aliceblue;" class="row">
                <div class="col-1">
                    <button class="bi bi-trash3" type="button" @click="remove"></button>
                </div>
                <div class="col-4">
                    {{ this.name }}
                </div>
                <div class="col-3">
                    {{ this.pmt }}
                </div>
                <div class="col-3">
                    {{ this.amtOwed }}
                </div>
                <div class="col-1">
                    {{ this.intRate }}
                </div>
            </div>
        </div>

    </div>

</template>

<script>
export default {
    name: 'debt_row',
    data() {
        return {

        }
    },
    props: {
        name: String,
        pmt: parseInt(String),
        amtOwed: parseInt(String),
        intRate: parseInt(String),
        remove: Function
    },

}

</script>