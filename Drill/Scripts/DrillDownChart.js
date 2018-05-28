//------------------------Построение Диграммы------------------------
    var Canvas = document.createElement('canvas');
    Canvas.id = 'myChart';
    Canvas.height = '100';
    document.getElementById('Chart').appendChild(Canvas);
    var ctx = document.getElementById("myChart").getContext('2d');
    var level = 0;
    var MainData = [0];
    var MainLable = [""];
    var DrillDatal1 = [75, 48, 31, 26];
var DrillLablel1 = ["Автор 1", "Автор 2", "Автор 3", "Автор 4"];
    var DrillDatal2 = [300, 400, 600];
var DrillLablel2 = ["Книга 1", "Книга 2", "Книга 3"];
var DrillData = new Array();
    var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: MainLable,
            datasets: [{
                label: '# of Votes',
                data: MainData,
                backgroundColor: [
                    'rgba(255, 99, 132,1)',
                    'rgba(54, 162, 235,1)',
                    'rgba(255, 206, 86,1)',
                    'rgba(75, 192, 192,1)',
                    'rgba(153, 102, 255,1)',
                    'rgba(255, 159, 64,1)'
                ],
                borderColor: [
             
                ],
                borderWidth: 2
            }]
        },
        options: {
            segmentShowStroke: false,

            animation: {

                animateRotate: false,
                animateScale: true
            },
            tooltips: {

                xAlign: 'bottom'

            },
            showAllTooltips: true,
            title: {
                display: true,
                text: 'Количество прочитанных книг'
            },
            onClick: function (e) {
                var activePoints = this.getElementsAtEvent(e);
                var selectedIndex = activePoints[0]._index;
                switch (this.data.datasets[0].data[selectedIndex]) {
                    case MainData[0]:
                        this.data.datasets[0].data = DrillDatal1;
                        this.data.labels = DrillLablel1;
                        this.update();
                        BackButton.style.display = 'block';
                        level++;
                        break;
                    case DrillDatal1[0]:
                        this.data.datasets[0].data = DrillDatal2;
                        this.data.labels = DrillLablel2;
                        this.update();
                        level++;
                        break;
                }
            }
        }
    });

//------------------------Построение Диграммы------------------------
$(document).ready(function () {
    GetAllBooks();
});

function GetAllBooks() {
    $.ajax({
        url: '/api/values',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            WriteResponse(data);
        },
        error: function (x, y, z) {
            alert(x + '\n' + y + '\n' + z);
        }
    });
}


function WriteResponse(books) {
    var i=0;
    $.each(books, function (index, book) {
        MainData[i] = book.Readed;
        MainLable[i] = book.Genre;        
        i++;
    }   
    );
    myChart.update();
}

var BackButton = document.createElement('input');
BackButton.type = 'button';
BackButton.value = 'Back';
document.getElementById('Chart').appendChild(BackButton);
BackButton.style.display = 'none';

BackButton.onclick = function () {
    switch (level) {
        case 1:
            myChart.data.datasets[0].data = MainData;
            myChart.data.labels = MainLable;
            myChart.update();
            level--;
            this.style.display = 'none';
            break;
        case 2:
            myChart.data.datasets[0].data = DrillDatal1;
            myChart.data.labels = DrillLablel1;
            myChart.update();
            level--;
        break;
    }
};

for (var j = 0; j <= MainData.length; j++) {
    DrillData[j] = new Array();
}
DrillData[0] = DrillDatal1;

Chart.pluginService.register({
    beforeRender: function (chart) {
        if (chart.config.options.showAllTooltips) {
            chart.pluginTooltips = [];
            chart.config.data.datasets.forEach(function (dataset, i) {
                chart.getDatasetMeta(i).data.forEach(function (sector, j) {
                    chart.pluginTooltips.push(new Chart.Tooltip({
                        _chart: chart.chart,
                        _chartInstance: chart,
                        _data: chart.data,
                        _options: chart.options.tooltips,
                        _active: [sector]
                    }, chart));
                });
            });

            chart.options.tooltips.enabled = false;
        }
    },
    afterDraw: function (chart, easing) {
        if (chart.config.options.showAllTooltips) {
            if (!chart.allTooltipsOnce) {
                if (easing !== 1)
                    return;
                chart.allTooltipsOnce = true;
            }

            chart.options.tooltips.enabled = true;
            Chart.helpers.each(chart.pluginTooltips, function (tooltip) {
                tooltip.initialize();
                tooltip.update();
                tooltip.pivot();
                tooltip.transition(easing).draw();
            });
            chart.options.tooltips.enabled = false;
        }
    }
});