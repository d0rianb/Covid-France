/**
 * Made by D0rian <dorian.beauchesne@icloud.com>
 * Source of data : Johns Hopkins University Center for Systems Science and Engineering (JHU CSSE)
 */

// TODO:
// - Pourcentage de la population du pays
// - Graph scale options

const API_URL = `https://pomber.github.io/covid19/timeseries.json`

const canvas = document.querySelector('#chart')
const ctx = canvas.getContext('2d')

let app = new Vue({
    el: '#app',
    created() {
        moment.locale('fr')
        this.getData()
    },
    filters: {
        capitalize(value) {
            if (!value) return ''
            return value.toString().charAt(0).toUpperCase() + value.slice(1)
        },
        int(value) {
            if (!value) return ''
            return value.toLocaleString()
        },
        date(value) {
            if (!value) return ''
            return moment(value).format('DD MMMM YYYY')
        }
    },
    data() {
        return {
            country: 'France',
            countries: [],
            covidData: {
                date: '',
                confirmed: 0,
                deaths: 0,
                recovered: 0,
                todayCases: 0,
                todayDeaths: 0,
                todayRecovered: 0
            }
        }
    },
    methods: {
        getData: async function() {
            const data = await fetch(API_URL, { "method": "GET" })
                .then(response => response.json())
                .then(data => {
                    this.countries = Object.keys(data)
                    const countryData = data[this.country]
                    const todayData = countryData[countryData.length - 1]
                    const yesterdayData = countryData[countryData.length - 2]

                    const diffData = {
                        todayCases: todayData.confirmed - yesterdayData.confirmed,
                        todayDeaths: todayData.deaths - yesterdayData.deaths,
                        todayRecovered: todayData.recovered - yesterdayData.recovered
                    }

                    this.covidData = Object.assign(this.covidData, todayData, diffData)
                    this.createGraph(countryData)
                })
        },
        createGraph(countryData) {
            const data = countryData.slice(15)
            const labels = data.map(stat => moment(stat.date).format('DD MMMM'))
            const deaths = data.map(stat => stat.deaths)
            const cases = data.map(stat => stat.confirmed)
            const recovered = data.map(stat => stat.recovered)

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
                    tooltips: {
                        mode: 'point'
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
        },

        updateGraph(e) {

        }
    }
})