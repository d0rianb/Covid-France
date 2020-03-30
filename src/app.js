/**
 * Made by D0rian <dorian.beauchesne@icloud.com>
 */

const COUNTRY = 'france'
const API_URL = `https://coronavirus-19-api.herokuapp.com/countries/${COUNTRY}`

const canvas = document.querySelector('#main')
const ctx = canvas.getContext('2d')

let app = new Vue({
    el: '#app',
    created() {
        this.getData()
            .then(data => {
                this.covidData = data
            })
    },
    filters: {
        capitalize(value) {
            if (!value) return ''
            value = value.toString()
            return value.charAt(0).toUpperCase() + value.slice(1)
        }
    },
    methods: {
        getData: async function() {
            const data = await fetch(API_URL, { "method": "GET" })
                .then(response => response.json())
                .then(data => {
                    return data
                })
            return data
        }
    },
    data() {
        return {
            country: COUNTRY,
            covidData: {}
        }
    }
})

fetch("https://pomber.github.io/covid19/timeseries.json", {
        "method": "GET",
    })
    .then(res => res.json())
    .then(data => {
        let labels = data.France.map(stat => stat.date)
        let deaths = data.France.map(stat => stat.deaths)
        let cases = data.France.map(stat => stat.confirmed)
        let recovered = data.France.map(stat => stat.recovered)

        let chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Nombre de mort en France',
                    backgroundColor: 'transparent',
                    borderColor: '#9b0000',
                    data: deaths
                }, {
                    label: 'Nombre de cas en France',
                    backgroundColor: 'transparent',
                    borderColor: '#304ffe',
                    data: cases
                }, {
                    label: 'Nombre de guéris en France',
                    backgroundColor: 'transparent',
                    borderColor: '#4caf50',
                    data: recovered
                }]
            },
            options: {}
        })
    })
    .catch(err => {
        console.log(err)
    })