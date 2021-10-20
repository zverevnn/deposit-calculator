<?
    
    include ('navigation.php');

    // задаём идентификатор текущей страницы вручную, т.к. данном случае у меня готова всего одна страничка
    $page = (isset($_GET[$page])) ? $_GET[$page] : 'calculator';

    $navigation = new Navigation($page);

    // получаем массив с хлебными крошками
    $breadcrumbArr = $navigation -> getBreadcrumbArr();

    // получаем массив с элементами меню
    $menuArr = $navigation -> getMenuArr();

    // динамически фрмирующуюся часть html кода меню решил вынести в отдельную переменную, 
    // т.к. данный код будет использовать более одного раза. Меню в шапке и футере
    foreach($menuArr as $item) {

        // активным элементом меню считает тот элемент, 
        // идентификатор которого совпадает с идентификатором текущей страницы $page
        // или идентификатор которого совпадает с родителем текущей страницы $page

        if($item['active']) {
            $menuItems = $menuItems . '<li class="nav-active"><a href="#" title="' . $item['title'] . '">' . $item['title'] . '</a></li>';
        } else {
            $menuItems = $menuItems . '<li><a href="#" title="' . $item['title'] . '">' . $item['title'] . '</a></li>';
        }
        $menuItems = $menuItems . "\n";
    }

?>



<!DOCTYPE html>
<html lang="ru">

<head>
    <meta charset="UTF-8">
    <title>WORLD BANK</title>
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/ui-lightness/jquery-ui.css">
    <link rel="stylesheet" href="https://jqueryui.com/resources/demos/style.css">
    <link rel="stylesheet" href="css/style.css"> 
    <link rel="stylesheet" href="css/slider.css"> 
    <link rel="stylesheet" href="css/infobox.css"> 
    <link rel="shortcut icon" href="/images/favicon.ico" type="image/x-icon">
</head>

<body>

    <div class="wrapper">

        <header>

            <section id="header-section-1">
                    <a href="#" title="Перейти на главную страницу WORLD BANK" id="link-logo">
                        <img src="../images/header/logo.jpeg" alt="WORLD BANK">
                    </a>

                    <ul id="header-contacts">
                        <li><a href="tel:+78001005005" title="Позвонить: 8-800-100-5005">8-800-100-5005</a></li>
                        <li><a href="tel:+73452522000" title="Позвонить: +7 (3452) 522-000">+7 (3452) 522-000</a></li>
                    </ul>
            </section>

            <section id="nav-header">
                <nav>
                    <ul>
                        <?php echo $menuItems; ?>
                    </ul>
                </nav>
            </section>

            <section id="breadcrumb">
                <ul>
                    <!-- хлебные крошки -->
                    <?php foreach($breadcrumbArr as $item):?>
                        <?php if($item['page'] == $page):?>
                            <li><span class="breadcrumb-active"><?php echo $item['title']; ?></span></li>
                        <?php else: ?>
                            <li><a href="#" title="<?php echo $item['title']; ?>" > <?php echo $item['title'] ?></a></li>
                        <?php endif; ?>
                    <? endforeach;?>
                </ul>
            </section>

        </header>

        <div id="content">
            <section id="calculator">
                <form id="form-calculator">
                    <h1>Калькулятор</h1>
                    <div id="calculator-grid">
                        <div class="calculator-grid-row">
                            <div>Дата оформления вклада</div>
                            <div>
                                <input type="text" size="10" name = "date" id="datepicker">
                            </div>
                        </div>
                        <div class="calculator-grid-row">
                            <div>Сумма вклада</div>
                            <div>
                                <input type="text" size="10" name="deposit-amount" id="deposit-amount-input">
                            </div>
                            <div>
                                <div class="slider" id="deposit-amount-slider">
                                    <div class="slider-wrapper-track">
                                        <div class="slider-track">
                                            <div class="slider-thumb">
                                                <div class="slider-thumb-left-area"></div>
                                                <div class="slider-thumb-right-area"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="slider-labels">
                                        <div class="slider-label-left"></div>
                                        <div class="slider-label-right"></div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div class="calculator-grid-row">
                            <div>Срок вклада</div>
                            <div>
                                <select size="1" name="years" id="deposit-period-years">
                                    <option value="1">1 год</option>
                                    <option value="2">2 года</option>
                                    <option value="3">3 года</option>
                                    <option value="4">4 года</option>
                                    <option value="5">5 лет</option>
                                </select>
                            </div>
                        </div>

                        <div class="calculator-grid-row">
                            <div>Пополнение вклада</div>
                            <div>
                                <input type="radio" id="is-deposit-add-false" name="is-deposit-add" value="0" checked>
                                <label for="is-deposit-add-false">Нет</label>

                                <input type="radio" id="is-deposit-add-true" name="is-deposit-add" value="1">
                                <label for="is-deposit-add-true">Да</label>
                            </div>
                        </div>

                        

                        <div class="calculator-grid-row">

                            <div>Сумма пополнения вклада</div>

                            <div>
                                <input type="text" size="10" name="deposit-amount-add" id="deposit-amount-add-input">
                            </div>

                            <div>
                                <div class="slider" id="deposit-amount-add-slider">
                                    <div class="slider-wrapper-track">
                                        <div class="slider-track">
                                            <div class="slider-thumb">
                                                <div class="slider-thumb-left-area"></div>
                                                <div class="slider-thumb-right-area"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="slider-labels">
                                        <div class="slider-label-left"></div>
                                        <div class="slider-label-right"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="calculator-grid-row">
                            <div>Начисление процентов с учетом капитализации</div>
                            <div>
                                <input type="radio" id="capitalization-false" name="capitalization" value="0" checked>
                                <label for="capitalization-false">Нет</label>

                                <input type="radio" id="capitalization-true" name="capitalization" value="1">
                                <label for="capitalization-true">Да</label>
                            </div>
                        </div>

                        
                    </div>
                    <div id="calculator-result">
                        <div>
                            <input type="submit" id="btn-calculate" value="">
                            <span id="calculation-details-button" title="показать график начислений" hidden>График начислений</span>
                        </div>
                        <div id="result-value">
                            <span class="result-label">Результат: </span>
                            <span class="result-value">10 000 руб</span>
                        </div>
                        
                    </div>
                    
                </form>
            </section>
        </div>

            

        <footer>
            <section id="nav-footer">
                <nav>
                    <ul>
                        <?php echo $menuItems; ?>                   
                    </ul>
                </nav>
            </section>
        </footer>

    </div>


    
<script src="https://code.jquery.com/jquery-1.12.4.js"></script>
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
<script src="js/formComponents.js"></script>
<script src="js/infobox.js"></script>
<script src="js/script.js"></script>


</body>

</html>




