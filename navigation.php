<?
	class Navigation {

		private $breadcrumbArr;
		private $menuArr;
		function __construct($page, $defaultPage = 'calculator', $pageStructureFileName = 'settings/pages.json') {
			$this -> pageStructure = json_decode(file_get_contents( __DIR__ . DIRECTORY_SEPARATOR . $pageStructureFileName ), true);
			$this -> page = $page ? $page : $defaultPage;
			$this -> currentPage = $this -> page;
			$this -> breadcrumbArr = [];
			$this -> menuArr = [];
			$this -> pageStructureEdit();
			$this -> generateBreadcrumbArr($this -> page);
			$this -> generateMenuArr($this -> page);

		}

		private function pageStructureEdit() {
			
			// добавляем в массив идентификатор страницы
			foreach ($this -> pageStructure as $key => $value) {
				$this -> pageStructure[$key]['page'] = $key;
			}

			// добавляем в массив информацию об активности элемента
			foreach ($this -> pageStructure as $key => $value) {
				if ($value['page'] == $this -> page or $value['page'] == $this -> pageStructure[$this -> page]['parent']) {
					$this -> pageStructure[$key]['active'] = true;
				}
			}

		}

		private function generateBreadcrumbArr($page) {
			if (array_key_exists($page, $this -> pageStructure)) {
				array_unshift($this -> breadcrumbArr, $this -> pageStructure[$page]);
				if ($this -> pageStructure[$page]['parent']) {
					$this -> generateBreadcrumbArr($this -> pageStructure[$page]['parent']);
				}
			}
		}

		private function generateMenuArr() {
			// в меню попадает только главная страница и ближайшие потомки
			foreach($this -> pageStructure as $key => $item) {
				if ($item['parent'] == 'main' or $item['parent'] == false) {
					array_push($this -> menuArr, $item);
				}
			}

		}

		function getBreadcrumbArr() {
			return (empty($this -> breadcrumbArr)) ? false : $this -> breadcrumbArr;
		}

		function getMenuArr() {
			return (empty($this -> menuArr)) ? false : $this -> menuArr;
		}

	}

?>
	