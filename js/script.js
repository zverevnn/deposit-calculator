let xhttp = new XMLHttpRequest();
    
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        getAnswer(this.responseText)
    }
}
    
function getAnswer(data) {
    let result = document.querySelector('#result-value');
    result.innerHTML = (Number(data)).toLocaleString('ru') + " руб";
}

let form = document.querySelector('#calculator');

form.onsubmit = function(e) {
    e.preventDefault();
    
    let date = document.querySelector('input[name=date]').value;
    let summn = parseInt(document.querySelector('input[name=summn]').value);
    let years = parseInt(document.querySelector('select[name=years]').value);
    let isSummadd = document.querySelector('#radio2').checked;
    let summadd = parseInt(document.querySelector('input[name=summadd]').value);
    summadd = (isSummadd) ? summadd : 0; 
    
    if ( isNaN(summn) || (isSummadd && isNaN(summadd)) || notDate(date)) {
        alert('Пожалуйста, заполните корректно все поля и повторите попытку');
        getAnswer(0);
        return false;
    }
    
    if (summn < 1000 || summn > 3000000 || (isSummadd && (summadd < 1000 || summadd > 3000000))) {
        alert('Сумма вклада/пополнения должна быть в диапазоне 1 тыс - 3 млн рублей');
        return false;
    }
    
    
    calc(date, summn, summadd, years);
}

function calc(date, summn, summadd, years) {
    xhttp.open("POST", window.location["origin"] + '/calc.php', true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send('date=' + date + '&summn=' + summn + '&summadd=' + summadd + '&years=' + years);
}

function notDate(value){
    var arrD = value.split(".");
    arrD[1] -= 1;
    var d = new Date(arrD[2], arrD[1], arrD[0]);
    if ((d.getFullYear() == arrD[2]) && (d.getMonth() == arrD[1]) && (d.getDate() == arrD[0])) {
        return false;
    } else {
        return true;
    }
}

$( function() {
    
    $( "#datepicker" ).datepicker({
        dateFormat: "dd.mm.yy"
    });
});