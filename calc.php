<? 
	class Calculator {

		private $dataNames;
		private $done;
		private $calculationResult;

		function __construct($properties) {

			// массив, содержащий результат выполнения скрипта
			//$this -> done = ['error' => false, 'value' => '-'];

			// создать ключевые свойства объекта на основании переданных в конструктор параметров
			/*
			$this -> depositDateMin = '01.01.2010';
			$this -> depositDateMax = '31.12.9999';
			$this -> depositAmountMin = 1000; 
			$this -> depositAmountMax = 3000000;
			$this -> depositAmountAddMin = 1000; 
			$this -> depositAmountAddMax = 3000000;
			$this -> depositPeriodYearsMin = 1;
			$this -> depositPeriodYearsMax = 5;
			$this -> $percent = 0.1
			*/
			$this -> addProperties($properties);

			// список ключевых свойств класса, задаваемых пользователем
			$this -> dataNames = [
				'depositDate',         // Дата оформления вклада
				'depositAmount',       // Сумма вклада
				'depositAmountAdd',    // Сумма пополнения вклада
				'depositPeriodYears',  // Срок вклада
				'isDepositAdd',        // Пополнение вклада
				'capitalization'       // Начисление процентов с учетом капитализации
			];

			// инициализация POST переменных
			$this -> addPOSTData($this -> dataNames);

			// проверка ключевых свойств класса
			$this -> checkVariables();

			// завершаем выполнение метода, если набор полученых переменных неполный
			if ($this -> done['error']) return;

			$this -> calculationResult = [];

			/*
			$this -> depositPeriodYears = 1;
			$this -> percent = 0.1;
			$this -> calculate(new DateTime('2023-12-25'));
			*/

			$this -> calculate(new DateTime($this -> depositDate));

			$result = [
				'percent' => $this -> percent,
				'isDepositAdd' => $this -> isDepositAdd == true,
				'capitalization' => $this -> capitalization == true,
				'details' => $this -> calculationResult
			];

			$this -> done['value'] = $result;
		}


		private function calculate($date, $previousDate = false, $amountPreviousMonth = 0, $index = 1) {
			
			// $date - дата расчета процентов по вкладу
			// $amountPreviousMonth - сумма на счете на конец прошлого месяца
			// $index - индекс указывает на количество вызовов данного метода

			// $срок вклада в месяцах
			$monthsN = $this -> depositPeriodYears * 12 + 1;

			// дата открытия вклада
			$depositDate = new DateTime($this -> depositDate);

			// сумма вклада
			$depositAmount = $this -> depositAmount;

			// сумма пополнения вклада
			$depositAmountAdd = $this -> depositAmountAdd;

			// опция пополнения вклада
			$isDepositAdd =  $this -> isDepositAdd;

			// опция начисления процентов с учетом капитализации
			$capitalization = $this -> capitalization;

			// процентная ставка 
			$percent = $this -> percent;

			$amountPercent = 0;

			if ($previousDate) {

				// год, на который приходился вклад
				$yearPrev = $previousDate -> format("Y");

				// месяц, на который приходился вклад
				$month = $previousDate -> format("m");

				// количество дней в месяце, на который приходился вклад
				$daysN = date('t', mktime(0, 0, 0, $month, 1, $yearPrev)); 

				// количество дней в году, на который приходится предыдущая/расчетная дата
				$daysYPrev = $this -> getDaysYear($yearPrev);
				$daysY = $this -> getDaysYear($date -> format("Y"));

				// если текущий месяц == январь, то 
				// есть вероятность, что на текущую дату и дату прошлого месяца разное количество дней в году
				// на этот случай, при вычислении $amountPercent к количеству дней в году прибавляем дополнительное значение $daysYPrevAddedValue
				$daysYPrevAddedValue = ($month == 12) ? ($daysY - $daysYPrev) * ($previousDate -> format('d') / $daysN) : 0;

				// формула расчета капитализации процентов по вкладу
				$amountPercent = $amountPreviousMonth * $daysN * ($percent / ($daysYPrev + $daysYPrevAddedValue));
			} 

			switch (true) {

			    case (!$isDepositAdd && !$capitalization):
			    	// если пополнение вклада не предусмотрено и
					// начисление % с учетом капиталиции не предусмотрено

					$amountTotal = $depositAmount;
			        break;

			    case ($isDepositAdd && !$capitalization):
			    	// если пополнение вклада предусмотрено и
					// начисление % с учетом капиталиции не предусмотрено

					$amountTotal = ($index > 1) ? $amountPreviousMonth + $depositAmountAdd : $depositAmount;
			        break;

			    case (!$isDepositAdd && $capitalization):
			    	// если пополнение вклада не предусмотрено и
					// начисление % с учетом капиталиции предусмотрено

					$amountTotal = ($index > 1) ? $amountPreviousMonth + $amountPercent : $depositAmount;
			        break;

			    case ($isDepositAdd && $capitalization):
			    	// если пополнение вклада предусмотрено и
					// начисление % с учетом капиталиции предусмотрено

					$amountTotal = ($index > 1) ? $amountPreviousMonth + $depositAmountAdd  + $amountPercent : $depositAmount;
			        break;
			}

			$result = [
				'date' => $date -> format('d.m.Y'),
				'amountPercent' => $amountPercent,
				'amountTotal' => $amountTotal
			];

			array_push($this -> calculationResult, $result);
						
			if ($index < $monthsN) {
				// получаем следующую расчетную дату
				$nextDate = $this -> getDateAddMonths(clone $date, $depositDate -> format("d"));
				$this -> calculate($nextDate, $date, $amountTotal, ++$index);
			}

		}

		private function getDaysYear($year) {
			// определить количество дней в году
			// в високосном году 366 дней, в обычном 365
			return ($year % 4 == 0 && ( $year % 100 != 0 || $year % 400 == 0 )) ? 366 : 365;
		}

		private function getDateAddMonths($date, $d, $addMonthN = 1){
			// метод увеличивает дату на заданное количество месяцев

			// $date - класс даты, к котороу нужно прибавить n месяцев
			// $d - число, которое нужно получить
			// $addMonthN - количество месяцев, которое нужно прибавить к дате

			// изменяем число на первое, чтобы при дальнейшем увеличении даты на 1 месяц
			// точно получился следующий месяц
			$date -> modify('first day of this month');

			// увеличиваем дату на n месяцев
			$date -> add(new DateInterval('P' . $addMonthN . 'M'));

			// получаем количество дней в месяце
			$month = $date -> format("m");
			$year = $date -> format("Y");

			$daysInMonth = date('t', mktime(0, 0, 0, $month, 1, $year));
			//$daysInMonth = cal_days_in_month(CAL_GREGORIAN, $month, $year);

			// вычисляем число новой даты
			// оно не может превышать количество дней в месяце
			$addDay = min($d, $daysInMonth);

			// формируем новую дату
			$date -> add(new DateInterval('P'. --$addDay.'D'));

			return $date;
		}


		
		private function checkVariables() {

			// проверка ключевых свойств класса

			$error = false;
			$errorMessage = [];

			// проверка даты
			if (!$this -> isCorrectDate($this -> depositDate, $this -> depositDateMin, $this -> depositDateMax)) {
				$error = true;
				array_push($errorMessage, 
					'Укажите корректную дату оформления вклада');
			}

			// проверка суммы вклада
			if (!$this -> isNumber($this -> depositAmount, $this -> depositAmountMin, $this -> depositAmountMax)) {
				$error = true;
				array_push($errorMessage, 
					'Укажите корректную сумму вклада');
			}

			// проверка периода вклада
			if (!$this -> isNumber($this -> depositPeriodYears, $this -> depositPeriodYearsMin, $this -> depositPeriodYearsMax)) {
				$error = true;
				array_push($errorMessage, 
					'Укажите корректный срок вклада');
			}

			// проверка суммы пополнения вклада, если предусмотрена опция пополнения вклада
			if ($this -> isDepositAdd) {

				// проверка суммы пополнения вклада
				if (!$this -> isNumber($this -> depositAmountAdd, $this -> depositAmountAddMin, $this -> depositAmountAddMax)) {
					$error = true;
					array_push($errorMessage, 
						'Укажите корректную сумму пополнения вклада');
				}

			}
			
			$this -> done['error'] = $error;
			$this -> done['value'] = $errorMessage;
		}


		private function addPOSTData($dataNames) {

			// создание указанных свойств класса из глоб массива POST
			foreach ($dataNames as $name) {
				$this -> $name = isset($_POST[$name]) ? $_POST[$name] : '';
			}
		}

		private function addProperties($properties) {

			// создание свойств класса из массива
			foreach ($properties as $key => $property) {
		        $this -> $key = $property;
		    }
		}

		private function isDate($value) {

			// проверка $value на соответствие шаблону 'ДД.ММ.ГГГГ' и корректность в целом
			$patternDate = '/^\d{2}\.\d{2}.\d{4}$/';
			
			// если строка не соответствует шаблону даты ДД.ММ.ГГГГ
			if (!preg_match($patternDate, $value)) return false;

			// разбиваем дату на массив с элементами ДД, ММ, ГГГГ
			$dateParts = explode(".", $value);

			// проверяем дату на корректность
			return checkdate($dateParts[1], $dateParts[0], $dateParts[2]);
		}	

		private function isCorrectDate($value, $min, $max) {
			$isBetween = $this -> isBetween(new DateTime($value), new DateTime($min), new DateTime($max));
			$isDate = $this -> isDate($value);
			return $isBetween && $isDate;
		}


		private function isNumber($value, $min, $max) {
			if ( !(is_numeric($value) && is_int(+$value)) ) return false;
			return $this -> isBetween($value, $min, $max);
		}

		private function isBetween($value, $min, $max) {
			//	проверка $value на целое число и нахождение в диапазоне min - max
			return ($min <= $value) && ($value <= $max);
		}
			
		public function getResult() {
			// метод возвращает объект JSON с результатами вычислений
			return json_encode($this -> done, JSON_UNESCAPED_UNICODE);
		}

	}


	$calculator = new Calculator(getCalcProperties());
	echo $calculator -> getResult();
	

	function getCalcProperties($url = 'settings/calc_properties.txt', $separator = ' = ') {
		// вернуть массив свойство => значение из файла

		$values = file($url);
		$properties = [];

		foreach($values as $value) {
			$keyValue = explode($separator, $value);
			$properties += [$keyValue[0] => trim($keyValue[1])];
		}
		
		return $properties;
	}

	
?>
