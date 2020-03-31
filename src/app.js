/**
 * Made by D0rian <dorian.beauchesne@icloud.com>
 */

const COUNTRY = 'france'
const API_URL = `https://coronavirus-19-api.herokuapp.com/countries/${COUNTRY}`

const canvas = document.querySelector('#chart')
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
            return value.toString().charAt(0).toUpperCase() + value.slice(1)
        },
        int(value) {
            if (!value) return ''
            return value.toLocaleString()
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
        moment.locale('fr')
        let dataFrance = data.France.slice(15)
        let labels = dataFrance.map(stat => moment(stat.date).format('DD MMMM'))
        let deaths = dataFrance.map(stat => stat.deaths)
        let cases = dataFrance.map(stat => stat.confirmed)
        let recovered = dataFrance.map(stat => stat.recovered)

        let chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Nombre de cas en France',
                    backgroundColor: 'transparent',
                    borderColor: '#304ffe',
                    data: cases,
                    radius: 3,
                    pointStyle: 'cross',
                    pointHitRadius: 6,
                    easing: 'easeOutQuad',
                    animationDuration: 600
                }, {
                    label: 'Nombre de mort en France',
                    backgroundColor: 'transparent',
                    borderColor: '#9b0000',
                    data: deaths,
                    radius: 3,
                    pointStyle: 'cross',
                    pointHitRadius: 6,
                    easing: 'easeOutQuad',
                    animationDuration: 600,
                }, {
                    label: 'Nombre de guéris en France',
                    backgroundColor: 'transparent',
                    borderColor: '#4caf50',
                    data: recovered,
                    radius: 3,
                    pointStyle: 'cross',
                    pointHitRadius: 6,
                    easing: 'easeOutQuad',
                    animationDuration: 600,
                }]
            },
            options: {
                aspectRatio: 2.5,
                fill: false,
                layout: {
                    padding: {
                        left: 10,
                        right: 25,
                        top: 0,
                        bottom: 50
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            callback: value => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                        }
                    }]
                }
            }
        })
        console.log(chart)
    })
    .catch(err => {
        console.log(err)
    })