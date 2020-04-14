/**
 * Made by D0rian <dorian.beauchesne@icloud.com>
 * Source of data : Johns Hopkins University Center for Systems Science and Engineering (JHU CSSE)
 */

// TODO:
// - Pourcentage de la population du pays

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
            data: undefined,
            chart: undefined,
            dayScale: 40,
            maxDaysScale: 0,
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
        async getData(e) {
            const data = await fetch(API_URL, { "method": "GET" })
                .then(response => response.json())
                .then(data => {
                    this.data = data
                    this.countries = Object.keys(this.data)
                })
            this.getCountryInfo()
            this.createGraph()
        },
        getCountryInfo() {
            const countryData = this.data[this.country]
            const todayData = countryData[countryData.length - 1]
            const yesterdayData = countryData[countryData.length - 2]

            const diffData = {
                todayCases: todayData.confirmed - yesterdayData.confirmed,
                todayDeaths: todayData.deaths - yesterdayData.deaths,
                todayRecovered: todayData.recovered - yesterdayData.recovered
            }

            this.covidData = Object.assign(this.covidData, todayData, diffData)
            this.maxDaysScale = countryData.length

        },
        createGraph() {
            const { labels, cases, deaths, recovered } = this.getCountryDataset()
            if (this.chart) this.chart.destroy()

            this.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: `Nombre de cas en ${this.country}`,
                        backgroundColor: 'transparent',
                        borderColor: '#304ffe',
                        data: cases,
                        radius: 3,
                        pointStyle: 'cross',
                        pointHitRadius: 6
                    }, {
                        label: `Nombre de mort en ${this.country}`,
                        backgroundColor: 'transparent',
                        borderColor: '#9b0000',
                        data: deaths,
                        radius: 3,
                        pointStyle: 'cross',
                        pointHitRadius: 6
                    }, {
                        label: `Nombre de guéris en ${this.country}`,
                        backgroundColor: 'transparent',
                        borderColor: '#4caf50',
                        data: recovered,
                        radius: 3,
                        pointStyle: 'cross',
                        pointHitRadius: 6
                    }]
                },
                options: {
                    aspectRatio: 2.5,
                    fill: false,
                    animation: {
                        duration: 600,
                        easing: 'easeOutQuad'
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
        updateCountry() {
            this.getCountryInfo()
            this.updateGraph()
        },
        getCountryDataset() {
            const countryData = this.data[this.country]
            const data = countryData.slice(this.maxDaysScale - this.dayScale)
            const labels = data.map(stat => moment(stat.date).format('DD MMMM'))
            const deaths = data.map(stat => stat.deaths)
            const cases = data.map(stat => stat.confirmed - stat.recovered)
            const recovered = data.map(stat => stat.recovered)
            return { labels, cases, deaths, recovered }
        },
        updateGraph(e) {
            const { labels, cases, deaths, recovered } = this.getCountryDataset()
            this.chart.data.labels = labels
            this.chart.data.datasets[0].data = cases
            this.chart.data.datasets[0].label = `Nombre de cas en ${this.country}`
            this.chart.data.datasets[1].data = deaths
            this.chart.data.datasets[1].label = `Nombre de mort en ${this.country}`
            this.chart.data.datasets[2].data = recovered
            this.chart.data.datasets[2].label = `Nombre de guéris en ${this.country}`
            this.chart.options.animation.duration = 0
            this.chart.update()
        }
    }
})