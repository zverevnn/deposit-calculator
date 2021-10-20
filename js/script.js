
$( "#datepicker" ).datepicker({
    dateFormat: "dd.mm.yy"
});


let methods = new Methods();

// настраиваем работу слайдера (бегунка)
let sliderValue = {
    min: 1000,
    max: 3000000,
    default: 10000
}

new Slider({
    elementsId: 'deposit-amount',
    min: sliderValue.min,
    max: sliderValue.max,
    sliderValue: sliderValue.default,
    methods: methods
});

new NumberInputControl({
    elementsId: 'deposit-amount',
    min: sliderValue.min,
    max: sliderValue.max,
    value: sliderValue.default,
    methods: methods
});

new Slider({
    elementsId: 'deposit-amount-add',
    min: sliderValue.min,
    max: sliderValue.max,
    sliderValue: sliderValue.default,
    methods: methods
});

new NumberInputControl({
    elementsId: 'deposit-amount-add',
    min: sliderValue.min,
    max: sliderValue.max,
    value: sliderValue.default,
    methods: methods
});

new DateInputControl({
    id: 'datepicker',
});

function removeSpaces(value) {
    return value.replace(/\s/g, "");
}

let formCalculator = document.getElementById('form-calculator');
let calculationDetailsButton = document.getElementById('calculation-details-button');

// запускаем класс для показа подробной информации по вкладу в разрезе месяцев
// передаем кнопку-элемент, при нажатии на которую, соответствующий блок будет изменять свою видимость
// передаем координаты для блока 
let infobox = new Infobox({
    toggleElem: calculationDetailsButton,
    defaultCoordinates : {
        X : formCalculator.getBoundingClientRect().left + formCalculator.offsetWidth + 5,
        Y : formCalculator.getBoundingClientRect().top
    }
});


function getInputData() {
    // получить актуальные данные со всех input
    let result = {
        depositDate: $('#datepicker').val(),
        depositAmount: removeSpaces( $('#deposit-amount-input').val() ),
        depositAmountAdd: removeSpaces( $('#deposit-amount-add-input').val() ),
        depositPeriodYears: $('#deposit-period-years').val(),
        isDepositAdd: $('input[name="is-deposit-add"]:checked').val(),
        capitalization: $('input[name="capitalization"]:checked').val()
    }

    return result;
}

$(document).ready(function() {

    // сразу после готовности DOM рассчитываем и показываем результат
    // с дефолтными расчетными данными 
    processDataAjax(getInputData());

    let formCalculator = $('#form-calculator');

    // при событии submit рассчитываем и показываем результат
    // с входными данными, которые указал/не указал пользователь в соответствующих input 
    formCalculator.submit(function(event) {
        event.preventDefault();
        processDataAjax(getInputData());
    })
});

function setResultLabel({
    // функция показывает результат вычислений или ошибку 

    title = "Результат: ", 
    value = '', 
    error = false}) {

    $('#result-value .result-label').text(title);
    $('#result-value .result-value').text(value);

    if (error) {
        $('#result-value').addClass("form-data-error");
    } else {
        $('#result-value').removeClass("form-data-error");
    }
}

function processDataAjax(inputData) {
    // отправка/получение/обработка данных от calc.php

    $.ajax({
        method: 'POST',
        url: '../calc.php',
        data: inputData,
    })
    .done(function(answer){
        
        // в переменной result ожидаем объект 
        // с результатами вычислений или подробной информацией об ошибке
        // или false, если данные не получены

        let result = (answer) ?  JSON.parse(answer) : false;

        if (!result) {
            setResultLabel({
                title: 'Неизвестная ошибка', 
                error: true
            });

            infobox.calculate({error : true});
            calculationDetailsButton.hidden = true;
            return;
        }

        calculationDetailsButton.hidden = result.error;

        // запускаем соответствующий метод класса для генерации блока 
        // с подробной информацией по капитализации вклада по месяцам 
        // в случае result.error == true, метод отреагирует нужным образом
        infobox.calculate({
            error : result.error,
            tableRows : result.value.details,
            depositAmount : inputData.depositAmount, 
            percent : result.value.percent * 100,
            isDepositAdd : result.value.isDepositAdd,
            capitalization : result.value.capitalization
        });

        let resultTitle = (result.error) ? 'Ошибка! ' : 'Результат: ';
        let resultValue = (result.error) ? result.value[0] : infobox.finalDepositAmountFormatRub;

        // указываем результат вычислений или текст ошибки
        setResultLabel({
            value: resultValue, 
            title: resultTitle, 
            error: result.error
        });
        
    });
}







