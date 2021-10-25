/*
    функционал для показа детальной информации по вкладу в разрезе месяцев
    при успешном подсчете данных, появляется возможность посмотреть более подробную информацию
    нажав на соответствующую ссылку около кнопки 'рассчитать'

    в ТЗ такой фичи не было, но я решил её добавить, т.к. в "эталоне" https://fincult.info/calc/deposit/
    такая функция есть и здесь она тоже пригодится для большей 'прозрачности' процесса вычисления итогового значения
*/

class Infobox {
    constructor({toggleElem, defaultCoordinates}) {

        // переключатель 
        // данный элемент будет изменять видимость информационного блока при клике на него
        this.toggleElem = toggleElem;

        // координаты информационного блока по умолчанию
        this.defaultCoordinates = defaultCoordinates;

        this.keyUpEsc = this.keyUpEsc.bind(this);
        this.infoboxClose = this.infoboxClose.bind(this);
        this.toggleElemClick = this.toggleElemClick.bind(this);
        this.infoboxMouseDown = this.infoboxMouseDown.bind(this);
        this.infoboxMove = this.infoboxMove.bind(this);
        this.infoboxMouseUp = this.infoboxMouseUp.bind(this);

        // отслеживаем событие 'клик' по переключателю
        this.toggleElem.addEventListener('click', this.toggleElemClick);
    }

    infoboxRemove() {
        this.infobox.remove();
        this.infobox = undefined;
    }


    calculate({ error, tableRows, depositAmount, percent, isDepositAdd, capitalization }) {

        this.calculateSuccess = true;

        let infoboxShow = (this.infobox && !this.infobox.hidden);
        
        // на момент вызова метода 
        if (this.infobox) this.infoboxRemove();

        if (error) return; 
        
        // данные по капитализации вклада за каждый месяц 
        // [{date: '01.01.2021', percent: 100, total: 1100}, {}, {}]
        this.tableRows = tableRows;

        // сумма вклада
        this.depositAmount = +depositAmount;

        // процентная ставка
        this.percent = percent;

        // предусмотрено пополнение вклада
        this.isDepositAdd = isDepositAdd;

        // ежемесячная капитализация вклада
        this.capitalization = capitalization;
        
        // сумма процентов
        // передается в массиве tableRows за каждый месяц всего периоа вклада
        this.percentSum = +this.tableRows.reduce((prev, item) => item[Object.keys(item)[1]] + prev, 0);
        //this.percentSum = +this.tableRows.reduce((prev, item) => item[Object.keys(item)[1]].toFixed(2) + prev, 0);

        // последняя сумма остатка по вкладу
        let lastDepositAmount = this.tableRows[this.tableRows.length - 1];
        lastDepositAmount = lastDepositAmount[Object.keys(lastDepositAmount)[2]];

        // итоговая сумма к выплате (вклад + проценты)
        this.finalDepositAmount = +lastDepositAmount;
        this.finalDepositAmount += (this.capitalization) ? 0 : this.percentSum;

        // эффективная ставка
        // если проценты начисляются с учетом капитализации
        // (((1+(ставка % /12)) ^ кол-во месяцев -1)*100)/кол-во лет
        let quantityYears = (this.tableRows.length - 1) / 12;
        let quantityMonths = quantityYears * 12;
        this.finalPercent = this.percent / 100 / 12 + 1;
        this.finalPercent = Math.pow(this.finalPercent, quantityMonths);
        this.finalPercent = (this.finalPercent - 1) * 100 / quantityYears;

        // сумма к выплате 
        this.payoutAmount = lastDepositAmount;
        
        if (infoboxShow) this.infoboxToggle();  
    }
	
	toggleElemClick() {
		// запускаем переключатель видимости элемента 'информационный блок
        this.infoboxToggle();
	}
	
	infoboxMouseDown(event) {
		// работа с событиями, чтобы реализовать функционал перемещения объекта мышкой 
		this.infoboxShiftX = event.clientX - this.infobox.getBoundingClientRect().left;
        this.infoboxShiftY = event.clientY - this.infobox.getBoundingClientRect().top;

		event.preventDefault();
		document.addEventListener('mousemove', this.infoboxMove);
		document.addEventListener('mouseup', this.infoboxMouseUp);
	}
	
	infoboxMove(event) {
		// работа с событиями, чтобы реализовать функционал перемещения объекта мышкой

		this.infobox.style.left = this.getNewcoordinatesX(event.clientX - this.infoboxShiftX);
		this.infobox.style.top = this.getNewcoordinatesY(event.clientY - this.infoboxShiftY);
	}
	
	infoboxMouseUp() {
		// работа с событиями, чтобы реализовать функционал перемещения объекта мышкой 
		document.removeEventListener('mouseup', this.infoboxMouseUp);
		document.removeEventListener('mousemove', this.infoboxMove);
		
		// текущие кординаты
		this.defaultCoordinates.X = this.infobox.getBoundingClientRect().left;
		this.defaultCoordinates.Y = this.infobox.getBoundingClientRect().top;
	}
	
	getNewcoordinatesX(X) {
		let maxRight = document.documentElement.clientWidth - this.infobox.offsetWidth;
		let newX = (X > maxRight) ? maxRight : X;
		newX = (X < 0) ? 0 : newX;
		
		return newX + 'px';		
	}
	
	getNewcoordinatesY(Y) {
		let maxBottom = document.documentElement.clientHeight - this.infobox.offsetHeight;
		let newY = (Y > maxBottom) ? maxBottom : Y;
		newY = (Y < 0) ? 0 : newY;
		
		return newY + 'px';		
	}
	
	setDefaultCoordinatesInfobox() {
		this.infobox.style.left = this.getNewcoordinatesX(this.defaultCoordinates.X);
		this.infobox.style.top = this.getNewcoordinatesY(this.defaultCoordinates.Y);
	}
	

    infoboxToggle() {

        if (!this.calculateSuccess) return;
		
		// если информационный блок еще не сгенерирован, 
		// то генерируем его и задаём атрибут hidden = trues
        if (!this.infobox) {
			// сгенерировать информационный блок
			// this.infobox
            this.generateInfobox();	
        }
		
		// если эелемнт не виден, то делаем его видимым
        this.infobox.hidden = !this.infobox.hidden;
		
		// если элеимент виден
		if (!this.infobox.hidden) {
			
            // при каждом показе элемента проверяем его координаты, чтобы подходили к размеру экрана
			this.setDefaultCoordinatesInfobox();
		
			// работа с событиями, чтобы реализовать функционал перемещения объекта мышкой 
			this.infoboxHeaderTitle.addEventListener('mousedown', this.infoboxMouseDown);
		} else {
			// если элемент не виден
			
			// работа с событиями, чтобы реализовать функционал перемещения объекта мышкой 
			this.infoboxHeaderTitle.removeEventListener('mousedown', this.infoboxMouseDown);
		}


        if (!this.infobox.hidden) {

            // скрытие информационного блока при отпускании клавиши Esc или кнопки мыши
            document.addEventListener('keyup', this.keyUpEsc, {once: true});
            this.infoboxHeaderClose.addEventListener('mouseup', this.infoboxClose, {once: true});
            //document.addEventListener('mousedown', this.keyUpEsc, {once: true});
        }
    }

    keyUpEsc(event) {
        // скрытие информационного блока при отпускании клавиши Esc

        if (event.key == 'Escape') {
            this.infoboxToggle();
        }
    }

    infoboxClose(event) {
        // скрытие информационного блока при отпускании кнопки мыши
        this.infoboxToggle();
    }

    generateInfobox() {
        // сгенерировать информационный блок

        // сгенерировать элементы с указанием основных итоговых показателей по вкладу
        // this.infoboxHeaderLabel
        this.generateinfoboxHeaderLabel();

        // сгенерировать заголовок таблицы
        // this.tableHeader
        this.generateTableHeader();

        // сгенерировать общие итоги таблицы
        // this.tableTotalResult
        this.generateTableTotalResult();

        // сгенерировать основную часть таблицы - строки/периоды с информацией о капитализации вклада
        // this.infoboxRows
        this.generateTableBody();

        // сгенерировать таблицу целиком - заголовки + основная часть + строка итогов
        // this.infoboxRows
        this.generateTable();

        // сгенерировать информационный блок (Элементы)
        this.generateInfoboxElem();

        document.body.append(this.infobox);
    }

    generateInfoboxElem() {
        // сгенерировать информационный блок

        let div = document.createElement('div');

        this.infobox = div.cloneNode();
        this.infobox.className = 'infobox';
        this.infobox.hidden = true;

        let infoboxHeader = div.cloneNode();
        infoboxHeader.className = 'infobox-header';

        let headerSection1 = div.cloneNode();

        this.infoboxHeaderTitle = div.cloneNode();
        this.infoboxHeaderTitle.className = 'infobox-header-title';
        this.infoboxHeaderTitle.textContent = 'Результаты расчета';

        this.infoboxHeaderClose = div.cloneNode();
        this.infoboxHeaderClose.className = 'infobox-header-close';
        this.infoboxHeaderClose.innerHTML = '&#10006';
        this.infoboxHeaderClose.setAttribute('title', 'Закрыть (Esc)');

        headerSection1.append(this.infoboxHeaderTitle, this.infoboxHeaderClose);
        infoboxHeader.append(headerSection1, this.infoboxHeaderLabel);
        this.infobox.append(infoboxHeader, this.infoboxRows);
    }

    generateTableHeader() {
        // сгенерировать заголовок таблицы

        let html = '<li>Дата</li><li>Начислено процентов</li><li>Остаток вклада</li>';
        this.tableHeader = document.createElement('ul');
        this.tableHeader.insertAdjacentHTML('beforeend', html);
    }

    generateTableBody() {
        // сгенерировать основную часть таблицы - строки/периоды с информацией о капитализации вклада

        this.tableBody = new DocumentFragment();
        let rowHTML = '';

        for (let rowObj of this.tableRows) {
            let keys = Object.keys(rowObj);
            let td1 = rowObj[keys[0]];
            let td2 = this.formatRubles(rowObj[keys[1]]);
            let td3 = this.formatRubles(rowObj[keys[2]]);
            rowHTML += '<ul><li>' + td1 + '</li><li>' + td2 + '</li><li>' + td3 + '</li></ul>';
        }

        this.infoboxRows = document.createElement('div');
        this.infoboxRows.className = 'infobox-rows';
        this.infoboxRows.insertAdjacentHTML('beforeend', rowHTML);
    }

    generateTableTotalResult() {
        // сгенерировать общие итоги таблицы
		
        let html = '<li>Итого:</li><li>' + this.percentSumFormat + '</li><li>' + this.payoutAmountFormat + '</li>';
        this.tableTotalResult = document.createElement('ul');
        this.tableTotalResult.insertAdjacentHTML('beforeend', html);
    }

    generateTable() {
        // сгенерировать таблицу целиком - заголовки + основная часть + строка итогов
		
        this.infoboxRows.prepend(this.tableHeader);
        this.infoboxRows.append(this.tableTotalResult);
    }


    get finalDepositAmountFormat() {
        return this.formatRubles(this.finalDepositAmount);
    }

    get finalDepositAmountFormatRub() {
        return this.formatRubles2(this.finalDepositAmount);
    }

    get payoutAmountFormat() {
        return this.formatRubles(this.payoutAmount);
    }

    get percentSumFormat() {
        return this.formatRubles(this.percentSum);
    }

    generateinfoboxHeaderLabel() {
        // сгенерировать элементы с указанием основных итоговых показателей по вкладу

        let value = '';
        let html = '';

        // сумма к выплате
        value = this.payoutAmountFormat;
        html = '<ul><li>сумма к выплате</li><li>' + value + '</li></ul>';
        
        // эффективная ставка
        // будем показывать только в случае, если отличается от процентной ставки
        value = this.formatPercent(this.finalPercent);
        html += (this.capitalization) ? '<ul><li>Эффективная ставка</li><li>' + value + '</li></ul>' : '';

        // процентная ставка
        value = this.formatPercent(this.percent);
        html += '<ul><li>процентная ставка</li><li>' + value + '</li></ul>';

        // сумма процентов
        value = this.percentSumFormat;
        html += '<ul><li>сумма процентов</li><li>' + value + '</li></ul>';

        this.infoboxHeaderLabel = document.createElement('div');
        this.infoboxHeaderLabel.className = 'infobox-header-label';
        this.infoboxHeaderLabel.insertAdjacentHTML('beforeend', html);
    }

    formatRubles(value) {
        // преобразоват в денежный формат
        // 10000 > 10 000 ₽
        return this.getNumberWithSpaces(parseFloat(value).toFixed(2)) + ' ₽';
    }

    formatRubles2(value) {
        // преобразоват в денежный формат
        // 10000 > 10 000 руб
        return this.getNumberWithSpaces(Math.round(value, 2)) + ' руб';
    }

    formatPercent(value) {
        // преобразовать в процентный формат
        // 10 > 10.00 %
        return parseFloat(value).toFixed(2) + ' %';
    }

    getNumberWithSpaces(value) {
        // добавить разделитель групп разрядов
        // 2250000 > 2 250 000
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
}

