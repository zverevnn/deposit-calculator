<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>WORLD BANK</title>
    <link rel="stylesheet" href="css/style.css">
    
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/ui-lightness/jquery-ui.css">
    <link rel="stylesheet" href="https://jqueryui.com/resources/demos/style.css">
    
</head>
<body>

    <header>
    
        <a href="#" title="главная страница" class="link-logo"><img src="images/header/logo.png" alt="logo WORLD BANK"></a>
        <div class="contacts">
            <p>8-800-100-5005</p>
            <p>+7 (3452) 522-000</p>
        </div>

        <ul id="header-menu" class="menu">
            <li><a href="#">Кредитные краты</a></li>
            <li><a href="#" class="active">Вклады</a></li>
            <li><a href="#">Дебетовая карта</a></li>
            <li><a href="#">Страхование</a></li>
            <li><a href="#">Друзья</a></li>
            <li><a href="#">Интернет-банк</a></li>
        </ul>
        
    </header>
    
    <div class="content">
        <form id="calculator">
            
            
            <table>
            
                <thead>
                    <tr>
                        <th colspan="3"><h3>Калькулятор</h3></th>
                    </tr>
                </thead>
                
                <tbody>
                
                    <tr>
                        <td>
                            <p>Дата оформления вклада</p>
                        </td>
                        <td>
                            <input type="text" size="10" value = "01.01.2021" name = "date" id="datepicker" >
                        </td>
                        <td></td>
                    </tr>
                    
                    <tr>
                        <td>
                            <p>Сумма вклада</p>
                        </td>
                        <td>
                            <input type="text" size="10" value = "10000" name = "summn">
                        </td>
                        <td>
                            <!-- 
                            <input type="range" min="1000" max="3000000" step="1000" value="1000"> 
                            <span class="range-thumb-min range-thumb-label">1 тыс. руб.</span>
                            <span class="range-thumb-max range-thumb-label">3 000 000</span>
                            -->
                        </td>
                    </tr>
                    
                    <tr>
                        <td>
                            <p>Срок вклада</p>
                        </td>
                        <td>
                            <select size="1" name="years">
                                <option value="1">1 год</option>
                                <option value="2">2 года</option>
                                <option value="3">3 года</option>
                                <option value="4">4 года</option>
                                <option value="5">5 лет</option>
                            </select>
                        </td>
                        <td></td>
                    </tr>
                    
                    <tr>
                        <td>
                            <p>Пополнение вклада</p>
                        </td>
                        <td>
                            <input name="isSummadd" type="radio" value="false" checked id="radio1"><label for="radio1">Нет</label>
                            <input name="isSummadd" type="radio" id="radio2"><label for="radio2">Да</label>
                        </td>
                        <td></td>
                    </tr>
                    
                    <tr>
                        <td>
                            <p>Сумма пополнения вклада</p>
                        </td>
                        <td>
                            <input type="text" size="10" value = "10000" name="summadd">
                        </td>
                        <td>
                            <!-- 
                            <input type="range" min="1000" max="3000000" step="1000" value="1000"> 
                            <span class="range-thumb-min range-thumb-label">1 тыс. руб.</span>
                            <span class="range-thumb-max range-thumb-label">3 000 000</span> 
                            -->
                        </td>
                    </tr>
                    
                </tbody>
                
            </table>
            
            <input type="submit" value="">
            <p id="result">
                <span class="result">Результат: </span>
                <span id="result-value">10 000 руб</span>
            </p>
            
        </form>
    </div>
    
    <div id="footer-wrapper">
        <footer>
            <ul id="footer-menu" class="menu">
                <li><a href="#">Кредитные краты</a></li>
                <li><a href="#">Вклады</a></li>
                <li><a href="#">Дебетовая карта</a></li>
                <li><a href="#">Страхование</a></li>
                <li><a href="#">Друзья</a></li>
                <li><a href="#">Интернет-банк</a></li>
            </ul>
        </footer>
    </div>
    
    <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <script src="js/script.js"></script>
    
</body>
</html>






