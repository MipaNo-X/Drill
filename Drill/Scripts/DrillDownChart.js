//------------------------Построение Диграммы------------------------
var ctx = document.getElementById("myChart").getContext('2d');
var level = 0;
var BackButton = document.getElementById("C");
BackButton.style.display = 'none';
var MainData = [0];
var MainLable = [""];
var DrillDatal1 = [75,48,31,26];
var DrillLablel1 = ["Книга 1", "Книга 2", "Книга 3", "Книга 4"];
var DrillDatal2 = [300,400,600];
var DrillLablel2 = ["Уф 1","Уф 2","Уф 3"];
var myChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: MainLable,
        datasets: [{
            label: '# of Votes',
            data: MainData,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
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
// Получение всех книг по ajax-запросу
function GetAllBooks() {

    $("#createBlock").css('display', 'block');
    $("#editBlock").css('display', 'none');
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

// вывод полученных данных на экран
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