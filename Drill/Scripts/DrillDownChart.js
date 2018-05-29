//-------------создание элемента типа canvas для рисование на нём диаграммы------------
    var Canvas = document.createElement('canvas'); 
    Canvas.id = 'myChart';
    Canvas.height = '100';
document.getElementById('Chart').appendChild(Canvas); //вшм в ктором будет находится наша диаграмма
//--------------------------------------------------------------------------------------
    var ctx = document.getElementById("myChart").getContext('2d');// элемент оторый отвечает за то что будет построен объект на canvas
    var level = 0; //уровень диаграммы на котором находится пользователь
//инициализация массивов для данных на главном поле
    var MainData = [0];
    var MainLable = [""];
    var DrillDatal1 = [75, 48, 31, 26]; //статичные данные для уровня 1
var DrillLablel1 = ["Автор 1", "Автор 2", "Автор 3", "Автор 4"]; //статичные данные для уровня 1
var DrillDatal2 = [300, 400, 600]; //статичные данные для уровня 2
var DrillLablel2 = ["Книга 1", "Книга 2", "Книга 3"]; //статичные данные для уровня 2
var DrillData = new Array();
//------------------------Построение Диграммы------------------------
    var myChart = new Chart(ctx, { //создание самой диаграммы 
        type: 'pie', //тип диаграммы (pie,bar,и.т.п.)
        data: { //данные для потсроения
            labels: MainLable, //лэйблы (название секторов)
            datasets: [{
                label: '# of Votes',
                data: MainData, //данные для секторов
                backgroundColor: [ //цвет задается для сегментов либо вручную либо надо писать функцию которая будет его рандомить
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
        options: { // опции для нашей диаграммы
            segmentShowStroke: false,

            animation: { //анимация кругового появления

                animateRotate: false,
                animateScale: true
            },
            tooltips: { //положение тултипов на секторах

                xAlign: 'bottom'

            },
            showAllTooltips: true,
            title: { //название диаграммы
                display: true,
                text: 'Количество прочитанных книг'
            },
            onClick: function (e) { // событие которое вызывает функцию, создающие drill (обращение к полю по индексу)
                var activePoints = this.getElementsAtEvent(e);
                var selectedIndex = activePoints[0]._index;
                switch (this.data.datasets[0].data[selectedIndex]) { //switch для выбранных id рисовать новые данные соответсвиющие drill
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

function GetAllBooks() { //ajax запрос на получение книг
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


function WriteResponse(books) { // взятие книги и наполнение данных для построение диаграммы
    var i=0;
    $.each(books, function (index, book) {
        MainData[i] = book.Readed; //Загоняется число прочитанных
        MainLable[i] = book.Genre;  //загоняется лэйбл, соответствующий названию сектора 
        i++;
    }   
    );
    myChart.update(); //обновить диаграмму
}
//--------------------------------создание кнопки Бэк-------------------------
var BackButton = document.createElement('input');
BackButton.type = 'button';
BackButton.value = 'Back';
document.getElementById('Chart').appendChild(BackButton);
BackButton.style.display = 'none'
//----------------------------------------------------------------------------
//-----------------фукционал кнопки возврат-----------------------------------
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
//-----------------фукционал кнопки возврат--------------------------------------------
for (var j = 0; j <= MainData.length; j++) {
    DrillData[j] = new Array();
}
DrillData[0] = DrillDatal1;
//-------------------- Функиция для постоянного отображения тултипов на секторах даграммы-----------------------------
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
//--------------------------------------------------------------------------------------------------------------------