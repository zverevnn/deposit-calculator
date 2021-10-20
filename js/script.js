
$( "#datepicker" ).datepicker({
    dateFormat: "dd.mm.yy"
});


let methods = new Methods();

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
let infobox = new Infobox({
    toggleElem: calculationDetailsButton,
    defaultCoordinates : {
        X : formCalculator.getBoundingClientRect().left + formCalculator.offsetWidth + 5,
        Y : formCalculator.getBoundingClientRect().top
    }
});


$(document).ready(function() {
    $('#form-calculator').submit(function(event) {
        event.preventDefault();
        let calculatedData = {
            depositDate: $('#datepicker').val(),
            depositAmount: removeSpaces( $('#deposit-amount-input').val() ),
            depositAmountAdd: removeSpaces( $('#deposit-amount-add-input').val() ),
            depositPeriodYears: $('#deposit-period-years').val(),
            isDepositAdd: $('input[name="is-deposit-add"]:checked').val(),
            capitalization: $('input[name="capitalization"]:checked').val()
        }

        $.ajax({
            method: 'POST',
            url: '../calc.php',
            data: calculatedData,
        })
        .done(function(answer){
            //console.log(answer);
            
            let result = (answer) ?  JSON.parse(answer) : '';

            calculationDetailsButton.hidden = result.error;
            console.log(result);
            infobox.calculate({
                error : result.error,
                tableRows : result.value.details,
                depositAmount : calculatedData.depositAmount, 
                percent : result.value.percent * 100,
                isDepositAdd : result.value.isDepositAdd,
                capitalization : result.value.capitalization
            });

            
            if (result.error) {
                $('#result-value').addClass("form-data-error");
            } else {
                $('#result-value').removeClass("form-data-error");
            }
            
            let resultTitle = (result.error) ? 'Ошибка! ' : 'Результат: ';
            let resultValue = (result.error) ? result.value[0] : infobox.finalDepositAmountFormatRub;

            $('#result-value .result-label').text(resultTitle);
            $('#result-value .result-value').text(resultValue);
            
        });

    })
});








