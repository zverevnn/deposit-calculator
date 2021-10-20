// элемент формы - слайдер/ползунок

class Slider {
    constructor({elementsId, input, min, max, sliderValue, methods}) {

        // определяем ключевые элементы слайдера
        this.slider = document.getElementById(elementsId + '-slider');
        this.input = document.getElementById(elementsId + '-input');
        this.track = this.slider.querySelector('.slider-track');
        this.labels = this.slider.querySelector('.slider-labels');
        this.thumb = this.slider.getElementsByClassName('slider-thumb')[0];
        this.getValueBetween = methods['getValueBetween'];
        this.getNumberWithSpaces = methods['getNumberWithSpaces'];

        // определяем свойства класса
        this.min = min;
        this.max = max;
        this.sliderValue = sliderValue;

        // добавить обработку событий для thumb
        // необходимо для реализации функционала перемещения указателя thumb с помощью перетаскивания мышью
        this.thumb.addEventListener('dragstart', this.thumbDragStart.bind(this));
        this.thumb.addEventListener('mousedown', this.thumbMouseDown.bind(this));

        // добавить обработку событий для thumb
        // необходимо для реализации функционала перемещения указателя thumb с помощью клика по области элемента track
        this.track.addEventListener('click', this.trackClick.bind(this));

        // добавить обработку событий для slider-labels
        // необходимо для реализации функционала перемещения указателя thumb с помощью клика по области label,
        // сожержащей информацию о минимальном или максимальном положении указателя thumb
        this.labels.addEventListener('click', this.labelClick.bind(this));
        
        // разность ширины элементов track и thumb
        this.rightEdge = this.track.clientWidth - this.thumb.offsetWidth;

        // задать стартовое значение слайдера
        this.setThumbPosition(this.sliderValue);

        // отслеживать событие изменения input text
        this.inputChange = this.inputChange.bind(this);
        this.input.addEventListener('inputChange', this.inputChange);
        
    }

    inputChange(event) {
        this.setThumbPosition(event.detail.value);
        //console.log(event.detail.value)
    }

    thumbDragStart(event) {
        // отменяем поведение по умолчанию при событии dragstart для элемента thumb
        event.preventDefault();
    }

    thumbMouseDown(event) {
        // обработка события mousedown для thumb

        // отмена действия по умолчанию
        event.preventDefault();

        // thumbShiftX - расстояние по оси Х, равное расстоянию на элементе указателя 
        // от его левой границы до точки, где произошло событие mousedown
        this.thumbShiftX = event.clientX - this.thumb.getBoundingClientRect().left;

        // назначить обработку событий на документ, 
        // чтобы можно было перемещать указатель thumb за счет перемещения указателя мыши по всему окну браузера
        this.thumbMouseMove = this.thumbMouseMove.bind(this);
        this.thumbMouseUp = this.thumbMouseUp.bind(this);
        document.addEventListener('mousemove', this.thumbMouseMove);
        document.addEventListener('mouseup', this.thumbMouseUp);
    }




    setThumbPosition(value) {
        //  задать положение указателя thumb

        // рассчитать новые координаты для thumb
        let newLeft = this.calculateNewCoordinatesForThumbValue(value);

        // применить новые координаты
        this.moveThumb(newLeft);

        // задать новое значение sliderValue
        this.setSliderValue(value);
    }

    labelClick(event) {
        // функция, срабатывающая при клике на элемент label, 
        // содержащий значение мин. и макс. положения указателя thumb в атрибуте data-value

        this.setThumbPosition(event.target.dataset.value);

        // сгенерировать событий sliderChange
        this.sliderChangeEvent();
    }

    thumbMouseMove(event) {
        // функция, срабатывающая во время ручного перетаскивания указателя слайдера

        // рассчитать новые координаты для thumb
        let newLeft = this.calculateNewCoordinatesForThumbEvent(event);

        // применить новые координаты
        this.moveThumb(newLeft);

        // рассчитать новое значение sliderValue на основе координат
        this.setSliderValue();

        // сгенерировать событий sliderChange
        this.sliderChangeEvent();
    }

    trackClick(event) {
        // функция, срабатывающая при клике на родительский элемент thumb
        // дополнительный способ изменения положения указателя thumb

        // не обрабатываем событие при клике на элемент, имеющий класс slider-thumb
        let isThumb = event.target.classList.contains('slider-thumb');
        if (isThumb) return;

        // рассчитать новые координаты для thumb
        let newLeft = this.calculateNewCoordinatesForThumbEvent(event);

        // применить новые координаты
        this.moveThumb(newLeft);

        // рассчитать новое значение sliderValue на основе координат
        this.setSliderValue();

        // сгенерировать событий sliderChange
        this.sliderChangeEvent();
        
    }

    calculateNewCoordinatesForThumbEvent(event) {
        // рассчитать новые координаты по оси Х для указателя на слайдере

        // новые координаты по оси Х для указателя thumb = eventClientX - thumbShiftX - trackClientX
        // новые координаты могут рассчитываться при сценариях:
        // 1. перемещение указателя (thumb) мышкой. Событие mousemove
        // 2. клик по родительскому элементу thumb - track. Событие click

        // eventClientX - текущие координаты указателя мыши по оси X относительно окна браузера

        // thumbShiftX - расстояние по оси Х, равное расстоянию на элементе указателя 
        // от его левой границы до точки, где произошло событие mousedown
        // (рассчитывается только при событии mousemove на элементе thumb)

        // trackClientX - координаты по оси Х для левой границы родительского элемента thumb

        let eventClientX = event.clientX;
        let trackClientX = this.track.getBoundingClientRect().left;

        this.thumbShiftX = (event.type == 'mousemove') ? this.thumbShiftX : 0;
        let newCoordinatesX = eventClientX - this.thumbShiftX - trackClientX;

        // минимальное значение не может быть меньше нуля
        newCoordinatesX = (newCoordinatesX < 0) ? 0 : newCoordinatesX;
        // максимальное значение не может быть больше rightEdge
        // rightEdge - разность ширины элементов track и thumb
        newCoordinatesX = (newCoordinatesX > this.rightEdge) ? this.rightEdge : newCoordinatesX;

        return newCoordinatesX;
    }

    calculateNewCoordinatesForThumbValue(value) {
        // рассчитать новые координаты по оси Х для указателя на слайдере
        // функция рассчитывает новые координаты на основе переданного значения value

        // проверка переданного значения на предмен нахождения в диапазоне min - max
        value = this.getValueBetween(value, this.min, this.max);

        // рассчет новых координат
        let newCoordinatesX = this.rightEdge / (this.max - this.min) * (value - this.min);

        return newCoordinatesX;
    }

    sliderChangeEvent() {
        //  при сценариях, когда значение слаййдера изменяется пользователем
        //  генерируем событие sliderChange

        this.slider.dispatchEvent(new CustomEvent("sliderChange", {
            detail: { value: this.sliderValue}
        }));
    }

    calculateNewValue() {
        // рассчитать новое значение sliderValue в зависимости от положения указателя thumb

        // рассчет нового значения
        let trackClientX = this.track.getBoundingClientRect().left;
        let thumbClientX = this.thumb.getBoundingClientRect().left;
        let newValue = (thumbClientX - trackClientX) / (this.rightEdge / (this.max - this.min)) +  this.min;
        newValue = Math.round(newValue, 0);
        newValue = this.getValueBetween(newValue, this.min, this.max)

        return newValue;
    }

    setSliderValue(newValue) {
        // задать новое значение sliderValue
        // прописать новое значение sliderValue в title элемента thumb

        // если значение не передано, то получаем его рассчетным путем на основании положения указателя thumb
        this.sliderValue = (newValue == undefined) ? this.calculateNewValue() : this.getValueBetween(newValue, this.min, this.max);

        // изменить свойство title для элемента thumb
        this.thumb.setAttribute('title', this.getNumberWithSpaces(this.sliderValue));
    }

    moveThumb(newLeft) {
        // изменить свойство left для элемента thumb
        this.thumb.style.left = newLeft + 'px';
    }

    thumbMouseUp() {
        // при событии mouseup на указателе thumb
        // убираем обработку событий
        document.removeEventListener('mouseup', this.thumbMouseUp);
        document.removeEventListener('mousemove', this.thumbMouseMove);
    }

    get min() {
        return this._min;
    }

    get max() {
        return this._max;
    }

    set min(value) {
        // изменение минимальной отметки шкалы слайдера
        this._min = value;
        this.setMinMaxValue('left', this.min);
    }

    set max(value) {
        // изменение максимальной отметки шкалы слайдера
        this._max = value;
        this.setMinMaxValue('right', this.max);
    }

    setMinMaxValue(attribute, value) {
        // изменение минимальной или максимально отметки шкалы слайдера

        let label = this.slider.querySelector('.slider-label-' + attribute);

        // добавить пользовательский атрибут, содержащий минимальное/максимальное значение
        // атрибут будет использован для изменения положения указателя thumb при клике на элемент
        label.setAttribute('data-value', value);

        // определить функцию для преобразования value в зависимости от attribute
        let method = new Map([
            ['left', 'convertToRubles'],
            ['right', 'getNumberWithSpaces']
        ]);

        let modifiedValue = this[method.get(attribute)](value);

        // изменить надпись с мин. и макс. отметкой шкалы слайдера
        label.textContent = modifiedValue;

        // задать текст для title 
        label.setAttribute('title', 'Задать ' + modifiedValue);
    }

    convertToRubles(value) {
        // преобразовать число к максимально возможной еднице измерения
        // 2000 > 2 тыс. руб.
        // 3000000 > 3 млн. руб.

        let categories = new Map([
            [1000000000, ' млрд. руб.'],
            [1000000, ' млн. руб.'],
            [1000, ' тыс. руб.']
        ]);

        for (let category of categories.keys()) {
            if (value >= category) {
                return value / category + ' ' + categories.get(category);
            }                
        }

        return value + ' руб.';
    }
}

class Methods {
    // класс с набором методов

    getValueBetween(value, min, max) {
    // функция возвращает переданное значение value в диапазоне min и max
    switch (true) {
        case (value >= this.min && value <= this.max):
            return value;
        case (value < this.min):
            return this.min;
        case (value > this.max):
            return this.max;
    }
}

    getNumberWithSpaces(value) {
        // добавить разделитель групп разрядов
        // 2250000 > 2 250 000
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
}

class NumberInputControl {
// контролль ввода чисел в input type text

    constructor({ elementsId, min, max, value, methods, type }) {
        this.input = document.getElementById(elementsId + '-input');
        this.slider = document.getElementById(elementsId + '-slider');
        this.min = min;
        this.max = max;
        this.getValueBetween = methods['getValueBetween'];
        this.getNumberWithSpaces = methods['getNumberWithSpaces'];

        this.onInput = this.onInput.bind(this);
        this.input.addEventListener('input', this.onInput);

        this.onInput = this.onBlur.bind(this);
        this.input.addEventListener('blur', this.onInput);

        // если число находится за границами диапазона, то возвращаем ближайшее к min, max число
        this.value = this.getValueBetween(value, this.min, this.max);

        this.changeValue();

        this.sliderChange = this.sliderChange.bind(this);
        this.slider.addEventListener('sliderChange', this.sliderChange);
    }    

    sliderChange(event) {
        this.value = event.detail.value;
        this.changeValue();
    }

    get value() {
        return this.value_;
    }

    set value(value) {
        this.value_ = value;
        this.formattedValue = this.getNumberWithSpaces(this.value);
    }

    onInput() {
        // получить значение input.value
        let currentValue = this.input.value;

        // фильтр по числам
        // qwe123rty1 > 1231
        let newValue = +this.returnOnlyNumber(this.input.value);

        // если newValue = 0
        newValue = (+newValue) ? newValue : '';

        this.value = newValue;

        this.changeValue();

        this.inputChangeEvent();
    } 

    onBlur() {
        // при потере фокуса осуществляем проверку числа на предмет нахождения в диапаоне min и max

        // если число находится за границами диапазона, то возвращаем ближайшее к min, max число
        this.value = this.getValueBetween(this.value, this.min, this.max);

        this.changeValue();

        this.inputChangeEvent();
    }

    inputChangeEvent() {
        //  при сценариях, когда значение input изменяется пользователем
        //  генерируем событие inputChange

        this.input.dispatchEvent(new CustomEvent("inputChange", {
            detail: { value: this.value}
        }));
    }

    changeValue() {
        // задать новое значение input.value
        this.input.value = this.formattedValue;
    }

    returnOnlyNumber(value) {
        let numbers = value.split('').filter(item => /\d/.test(item));
        return numbers.join('');
    }

}

class DateInputControl {
    constructor({ id, defaultValue }) {

        this.element = document.getElementById(id);

        // задаём дату по умолчанию
        // если дата не указана в парамере defaultValue, то берем сегодняшнюю дату
        this.defaultValue = (defaultValue) ? defaultValue : this.getDate(new Date);

        this.setValue(this.defaultValue);

        // отслеживаем событие потери фокуса элемента input Date
        this.onBlur = this.onBlur.bind(this);
        this.element.addEventListener('blur', this.onBlur);

    }

    onBlur() {
        // при потере фокуса выполняется проверка даты на корректность
        // критерий - дата должна быть датой
        let patternDDMMYYYY = /(\d{2})\.(\d{2})\.(\d{4})/;
        let date = new Date(this.element.value.replace(patternDDMMYYYY,'$3-$2-$1'));
        let newDateValue = (date == 'Invalid Date') ? this.defaultValue : this.element.value;
        this.setValue(newDateValue);
    }   

    setValue(value) {
        // задать дату элементу
        this.element.value = value;
    }

    getDate(date) {
        var dd = String(date.getDate()).padStart(2, '0');
        var mm = String(date.getMonth() + 1).padStart(2, '0');
        var yyyy = date.getFullYear();
        date = dd + '.' + mm + '.' + yyyy;
        return date;
    }

        


}