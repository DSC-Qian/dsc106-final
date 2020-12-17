document.addEventListener('DOMContentLoaded', function () {
    salesPromise = loadJSON('groceries_most_10.json')
    salesPromise.then(function (data) {
        plotColumn(data);
    })
    datesPromise = loadJSON('groceries_by_date.json');
    datesPromise.then(function (data) {
        plotArea(data);
    });
    groceriesPromise = loadJSON('groceries_categorized.json');
    groceriesPromise.then(function (data) {
        plotBubble(data);
    });
    plotHeatmap()
});

function plotArea(data) {
    let dates = []
    for (const [key, value] of Object.entries(data)){
        dates.push([Number(key), Number(value)])
    } 
    const area = Highcharts.chart('area-chart', {
        chart: {
            zoomType: 'x'
        },
        title: {
            text: 'Number of Grocery Purchases by Date'
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: 'Number of Products Sold'
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },

        series: [{
            type: 'area',
            name: 'Number of Products Sold',
            data: dates
        }]
    });
}

function plotBubble(data) {
    var pairs = [];
    for (const unit of Object.keys(data)) {
        let category = {name: unit, data: []}
        for (const [key, value] of Object.entries(data[unit])) {
            let temp = {name: key, value: value}
            category.data.push(temp)     
        }
        pairs.push(category)
    }
    groceries = pairs;
    const pie = Highcharts.chart('radial-chart', {
        chart: {
            type: 'packedbubble',
            height: '50%'
        },
        title: {
            text: 'Top 100 Groceries Purchased By Categories'
        },
        subtitle: {
            text: 'Click on bubbles to see details in each category'
        },
        tooltip: {
            useHTML: true,
            pointFormat: '<b>{point.name}:</b> {point.value}'
        },
        plotOptions: {
            packedbubble: {
                minSize: '30%',
                maxSize: '120%',
                zMin: 61,
                zMax: 2502,
                layoutAlgorithm: {
                    gravitationalConstant: 0.05,
                    splitSeries: true,
                    seriesInteraction: false,
                    dragBetweenSeries: false,
                    parentNodeLimit: true
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.name}',
                    filter: {
                        property: 'y',
                        operator: '>',
                        value: 250
                    },
                    style: {
                        color: 'black',
                        textOutline: 'none',
                        fontWeight: 'normal',
                        fontSize: 12
                    }
                }},
            series: {
                    events: {click: function(e) {
                            plotBar(e.point.series.userOptions)
                            }
                        }
                    }
        },
        series: pairs,
    });    
}

async function loadJSON(path) {
	let response = await fetch(path);
	let dataset = await response.json(); // Now available in global scope
	return dataset;
}

function plotBar(data) {
    let product = [];
    let sales = [];
    for (const unit of Object.keys(data.data)) {
        product.push(data.data[unit].name)
        sales.push(data.data[unit].value)
        
    }
    const bar = Highcharts.chart('bar-chart', {
        chart: {
            type: 'bar'
        },
        title: {
            text: data.name
        },
        xAxis: {
            categories: product,
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Number of Products Sold',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            formatter: function() {
                return this.point.y;
            }
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: false
                }
            }
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        series: [{
            data: sales
        }]
    });
}

function plotColumn(data) {
    for (const [key, value] of Object.entries(data)) {
        console.log(key)
    }
    const column = Highcharts.chart('column-chart', {
        chart: {
            type: 'column'
        },
        title: {
            text: '10 Most Purchased Grocery Products'
        },
        xAxis: {
            categories: ['whole milk',
            'other vegetables',
            'rolls/buns',
            'soda',
            'yogurt',
            'root vegetables',
            'tropical fruit',
            'bottled water',
            'sausage',
            'citrus fruit'],
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Numbers Sold'
            }
        },
        legend: {enabled: false},
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Numbers Sold',
            data: [2502, 1898, 1716, 1514, 1334, 1071, 1032, 933, 924, 812]
    
        }]
    });
}

function getPointCategoryName(point, dimension) {
    var series = point.series,
        isY = dimension === 'y',
        axis = series[isY ? 'yAxis' : 'xAxis'];
    return axis.categories[point[isY ? 'y' : 'x']];
}

function plotHeatmap() {
    const heatmap = Highcharts.chart('heatmap', {

        chart: {
            type: 'heatmap',
            marginTop: 40,
            marginBottom: 80,
            plotBorderWidth: 1
        },


        title: {
            text: 'Number of customers each day of the week by month '
        },

        xAxis: {
            categories: ['January', 'February', 'March', 'April', 'May', 'June','July','August','September','October','November','December']
        },

        yAxis: {
            categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday','Saturday','Sunday'],
            title: null,
            reversed: true
        },

        accessibility: {
            point: {
                descriptionFormatter: function (point) {
                    var ix = point.index + 1,
                        xName = getPointCategoryName(point, 'x'),
                        yName = getPointCategoryName(point, 'y'),
                        val = point.value;
                    return ix + '. ' + xName + ' sales ' + yName + ', ' + val + '.';
                }
            }
        },

        colorAxis: {
            min: 140,
            minColor: '#FFFFFF',
            maxColor: Highcharts.getOptions().colors[0]
        },

        legend: {
            align: 'right',
            layout: 'vertical',
            margin: 0,
            verticalAlign: 'top',
            y: 25,
            symbolHeight: 300
        },

        tooltip: {
            formatter: function () {
                return '<b>' +
                    this.point.value + '</b> customers in total on <br><b>' + getPointCategoryName(this.point, 'y') + 's in </b>' + '<b>' + getPointCategoryName(this.point, 'x')+ '</b>';
            }
        },

        series: [{
            name: 'Number of customers',
            borderWidth: 1,
            data: [
            [0, 0, 161], [0, 1, 164], [0, 2, 187], [0, 3, 226], [0, 4, 192], [0, 5, 193], [0, 6, 168], 
            [1, 0, 165], [1, 1, 171], [1, 2, 173], [1, 3, 183], [1, 4, 159], [1, 5, 181], [1, 6, 161], 
            [2, 0, 190], [2, 1, 175], [2, 2, 159], [2, 3, 173], [2, 4, 158], [2, 5, 171], [2, 6, 208], 
            [3, 0, 133], [3, 1, 183], [3, 2, 231], [3, 3, 190], [3, 4, 153], [3, 5, 163], [3, 6, 171], 
            [4, 0, 145], [4, 1, 172], [4, 2, 154], [4, 3, 198], [4, 4, 217], [4, 5, 198], [4, 6, 203],
            [5, 0, 207], [5, 1, 166], [5, 2, 151], [5, 3, 179], [5, 4, 183], [5, 5, 184], [5, 6, 185],
            [6, 0, 170], [6, 1, 203], [6, 2, 208], [6, 3, 187], [6, 4, 186], [6, 5, 149], [6, 6, 169],
            [7, 0, 179], [7, 1, 178], [7, 2, 174], [7, 3, 201], [7, 4, 194], [7, 5, 202], [7, 6, 205],
            [8, 0, 148], [8, 1, 194], [8, 2, 184], [8, 3, 144], [8, 4, 161], [8, 5, 148], [8, 6, 165],
            [9, 0, 182], [9, 1, 146], [9, 2, 188], [9, 3, 189], [9, 4, 197], [9, 5, 178], [9, 6, 180],
            [10, 0, 185], [10, 1, 153], [10, 2, 175], [10, 3, 187], [10, 4, 163], [10, 5, 206], [10, 6, 203],
            [11, 0, 168], [11, 1, 201], [11, 2, 193], [11, 3, 167], [11, 4, 163], [11, 5, 139], [11, 6, 167],
            ],
            dataLabels: {
                enabled: true,
                color: '#000000'
            }
        }],

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    yAxis: {
                        labels: {
                            formatter: function () {
                                return this.value.charAt(0);
                            }
                        }
                    }
                }
            }]
        }
    })
}