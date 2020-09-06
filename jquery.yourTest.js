(function($) {
    //Создает cookie елси  их нет или они пусты
    function CreateCookie(attempts) {
        if ($.cookie('YourTest') == 'null' || !$.cookie('YourTest')) {
            $.cookie("YourTest", JSON.stringify({
                //Текущий вопрос
                currentQuestion: 0,
                //Количество попыток(для бесконечных попыток нужно задать отрицательное число)
                attempts: attempts,
            }));
        }
    };
    //Устанавливает новое значение для cookie
    function SetCookie(newCookie) {
        $.cookie('YourTest', JSON.stringify(newCookie));
    };

    //Возвращает cookie
    function GetCookie() {
        return JSON.parse($.cookie('YourTest'));
    };

    //Класс ошибки
    function YourTestExeption(message) {
        //Название ошибки
        this.name = "Your Test Exeption: ";
        //Текст ошибки
        this.message = message;
    };

    //Вызывает ошибки
    function ThrowExeption(conditions, message) {
        if (conditions) {
            throw new YourTestExeption(message);
        }
    };

    //Нажатие на текст рядом с check
    function SpanClikc(test, obj) {

        if ($(obj).siblings('.' + test.settings.checkClassName).prop("checked") && $(obj).siblings('.' + test.settings.checkClassName).attr('type') != 'radio') {

            $(obj).siblings('.' + test.settings.checkClassName).prop("checked", false);
            test.checked--;
            if (test.checked == 0) {
                $('.' + test.settings.jumpButtonClassName).attr('disabled', "disable");
            }

        } else if ($(obj).siblings('.' + test.settings.checkClassName).attr('type') != 'radio') {
            $(obj).siblings('.' + test.settings.checkClassName).prop("checked", true);
            test.checked++;
            $('.' + test.settings.jumpButtonClassName).attr('disabled', null);
        } else {
            $(obj).siblings('.' + test.settings.checkClassName).prop("checked", true);
            $('.' + test.settings.jumpButtonClassName).attr('disabled', null);
        }
    };

    //Нажатие на check
    function CheckClick(test, obj) {
        if (!$(obj).prop('checked') && $(obj).attr('type') != 'radio') {
            $(obj).prop('checked', false)
            test.checked--;
            if (test.checked == 0) {
                $('.' + test.settings.jumpButtonClassName).attr('disabled', "disable");
            }

        } else if ($(obj).attr('type') != 'radio') {

            $(obj).prop("checked", true);
            test.checked++;
            $('.' + test.settings.jumpButtonClassName).attr('disabled', null);
            return;
        } else {
            $('.' + test.settings.jumpButtonClassName).attr('disabled', null);
        }
    };

    //Нажатие на кнопку перехода
    function JumpButtonClick(test, currentQuestion) {
        var noMistakes = true;
        //Проверяет правильно ли ответили на все вопросы
        $('.' + test.settings.answerOptionsClassName + ' .' + test.settings.answerClassName + ' .' + test.settings.checkClassName).each(function(index, key) {
            if ($(key).prop("checked") != currentQuestion.answers[index].rigth) {
                noMistakes = false;
                return;
            }

        });

        //Проверяет были ли допущены ошибки
        if (!noMistakes) {
            test.cookie.attempts--;
            //Если была последняя попытка
            if (test.cookie.attempts == 0) {
                test.cookie = null;
                SetCookie(test.cookie)
                test.settings.testFailed();
                //Если еще остались попытки
            } else {
                SetCookie(test.cookie);
                test.settings.answerNotFaithful();
            }
            return;
        }

        test.cookie.currentQuestion++;

        //Проверяет был ли вопрос последним
        if (test.cookie.currentQuestion == test.questions.length) {
            test.cookie = null;
            SetCookie(test.cookie);
            test.settings.testFinished();
            return;
        }

        SetCookie(test.cookie);

        test.test.html('');

        test.createQuestion(test.questions[test.cookie.currentQuestion]);
    };

    //Конструктор
    function YourTest(test, options) {

        //Тест
        this.test = test;
        //Вопросы
        this.questions;
        //Настройки
        this.settings = $.extend({
            //Путь до файла с вопросами(обязателен к заполнению)
            pathToQuestions: null,
            //Название класса с текстом вопроса
            questionTextClassName: 'test__questionText',
            //Название класса прогресс бара
            progressBarClassName: 'test__progress',
            //Класс предупреждения о нескольких вопросах
            warningClassName: 'test__warning',
            //Название класса-контейнера для ответов на вопросы
            answerOptionsClassName: 'test__answerOption',
            //Название класса для класса для конкретного ответа
            answerClassName: "answerOption__answer",
            //Название класса checkBox и RadioButton 
            checkClassName: "answer__check",
            //Название класса кнопки перехода к следующему вопросу
            jumpButtonClassName: 'test__jump-btn',
            //Текст прогрес бара
            progressBarText: null,
            //Текст предупреждения о то что нужно выбрать несколько ответов
            warningText: "Выберите несколько вариантов ответов",
            //Текст для кнопки перехода
            jumpButtonText: 'Получить ответ',
            //Отвечает за сохранение последнего вопроса к которому приступил пользователь
            saveLastUserQuestion: true,
            //Количество попыток (для бесконечных попыток следует указать отрицательное число)
            numberOfAttempts: -1,
            //Функция для неправильного ответа пользователя
            answerNotFaithful: function() {
                alert("Не верный ответ");
            },
            //Функция для проваленого теста
            testFailed: function() {
                alert("Тест провален");
                location.reload();
            },
            //Функция для окончания теста
            testFinished: function() {
                alert("Тест окончен");
                location.reload();
            }

        }, options);

        CreateCookie(this.settings.numberOfAttempts);

        //Затирает coockie если указана настройка не запоминать вопрос,на котором остановился пользователь
        if (!this.settings.saveLastUserQuestion) {
            $.cookie('YourTest', null);
            CreateCookie(this.settings.numberOfAttempts);
        }

        //Cookie
        this.cookie = GetCookie();
        //Выбранных ответов
        this.checked = 0;
    };

    //Инициализация
    YourTest.prototype.init = async function() {

        try {
            this.checkSettings();
        } catch (e) {
            if (e.name != undefined && e.message != undefined) {
                console.error(e.name, e.message);
            }
            return;
        }

        try {
            this.questions = await this.checksQuestions();
        } catch (e) {
            if (e.name != undefined && e.message != undefined) {
                console.error(e.name, e.message);
            }
            return;
        }

        this.createQuestion(this.questions[this.cookie.currentQuestion], this.questions.length);
    };

    //Проверка настроек
    YourTest.prototype.checkSettings = function() {
        //Указан ли путь до файла с вопросами
        ThrowExeption(this.settings.pathToQuestions == null, "Путь до файла с вопросами не был указан");
        //Проверяет расширение файла с вопросами
        ThrowExeption(this.settings.pathToQuestions.substr(this.settings.pathToQuestions.lastIndexOf('.')) != ".json", "Файл с ответами толжен иметь расширение 'json'");
        //Проверяет имеет-ли saveLastUserQuestion тип bolean
        ThrowExeption(typeof(this.settings.saveLastUserQuestion) != "boolean", "Поле saveLastUserQuestion должно иметь тип bolean");
        //Проверяет является ли numberOfAttempts числом
        ThrowExeption(typeof(this.settings.numberOfAttempts) != "number", "Поле numberOfAttempts должно иметь тип number");
        //Проверяет не является-ли numberOfAttempts нулем
        ThrowExeption(this.settings.numberOfAttempts == 0, "numberOfAttempts не должно быть нулем");

    };

    //Проверка вопросов
    YourTest.prototype.checksQuestions = async function() {

        //Читает вопросы из файла
        var questions = await $.getJSON(this.settings.pathToQuestions);
        questions = questions;

        //Проверяет наличие и правильность заполнения всех полей вопросов
        for (var i = 0; i < questions.length; i++) {

            ThrowExeption(questions[i].oneAnswer == undefined, "Вопрос №" + Number(i + 1) + " - не найдено поле 'oneAnswer' или ему не задано значение.");

            ThrowExeption(questions[i].oneAnswer != true && questions[i].oneAnswer != false, "Поле 'oneAnswer' ответа №" + Number(j + 1) + " на вопрос №" + Number(i + 1) + " должно являться булевым значением");

            ThrowExeption(questions[i].question == undefined, "Вопрос №" + Number(i + 1) + " - не найдено поле 'question' или ему не задано значение.");

            ThrowExeption(questions[i].question.length <= 0 || typeof(questions[i].question) != "string", "Вопрос №" + Number(i + 1) + " - поле 'question' пустой или же не является строкой");

            ThrowExeption(questions[i].answers == undefined, "Вопрос №" + Number(i + 1) + " - не найдено поле 'answers' или ему не задано значение.");

            ThrowExeption(questions[i].answers.length <= 1 || !Array.isArray(questions[i].answers), "Вопрос №" + Number(i + 1) + " - поле 'answers' содержит меньше 2х ответов или же не является массивом");

            var countRigthAnswers = 0;
            //Проверяет наличие и правильность заполнения полей ответов на вопросы
            for (var j = 0; j < questions[i].answers.length; j++) {

                ThrowExeption(questions[i].answers[j].text == undefined, "Поле 'text' ответа №" + Number(j + 1) + " на вопрос №" + Number(i + 1) + " не найдено или ему не задано значение");

                ThrowExeption(questions[i].answers[j].text.length <= 0, "Поле 'text' ответа №" + Number(j + 1) + " на вопрос №" + Number(i + 1) + " пустое");

                ThrowExeption(questions[i].answers[j].rigth == undefined, "Поле 'rigth' ответа №" + Number(j + 1) + " на вопрос №" + Number(i + 1) + " не найдено или ему не задано значение");

                ThrowExeption(questions[i].answers[j].rigth != true && questions[i].answers[j].rigth != false, "Поле 'rigth' ответа №" + Number(j + 1) + " на вопрос №" + Number(i + 1) + " должно являться булевым значением");

                if (questions[i].answers[j].rigth) {
                    countRigthAnswers++;
                }
            }

            //Проверяет содержит-ли вопрос хотя бы один правильный ответ 
            ThrowExeption(countRigthAnswers == 0, "В вопросе №" + Number(i + 1) + " нет ни одного правильного ответа");

            //Проверяет в вопоросе с 1 вариантом ответа наличе только 1 варианта ответа
            ThrowExeption(questions[i].oneAnswer == true && countRigthAnswers > 1, "В попросе №" + Number(i + 1) + " больше 1 правильного ответа, хотя он помечен как вопрос с одним ответом");

            //Проверяет в вопоросе с несколькими вариантами ответа наличие нескольких вариантов ответа
            ThrowExeption(questions[i].oneAnswer == false && countRigthAnswers == 1, "В попросе №" + Number(i + 1) + " только 1 ответ, хотя он помечен как вопрос с несколькими вариантами ответов");
        }

        return questions;
    };

    //Отрисовка вопроса на странице
    YourTest.prototype.createQuestion = function(currentQuestion) {

        //Текст вопроса
        this.test.append('<h2 class="' + this.settings.questionTextClassName + '">' + currentQuestion.question + '</h2>');
        //Прогресс бар
        if (this.settings.progressBarText == null) {
            this.test.append('<div class="' + this.settings.progressBarClassName + '">Вопрос ' + Number(this.cookie.currentQuestion + 1) + ' из ' + this.questions.length + '</div>');
        } else {
            this.test.append('<div class="' + this.settings.progressBarClassName + '">' + this.settings.progressBarText + '</div>');
        }

        if (!currentQuestion.oneAnswer) {
            this.test.append('<p class="' + this.settings.warningClassName + '">' + this.settings.warningText + '</p>');
        }

        //Список с вопросами 
        this.test.append('<ul class="' + this.settings.answerOptionsClassName + ' "></ul>');

        //Вопросы
        for (var i = 0; i < currentQuestion.answers.length; i++) {

            if (currentQuestion.oneAnswer) {
                $('.' + this.settings.answerOptionsClassName).append('<li class="' + this.settings.answerClassName + '"><input type="radio" name="yourTest" class="' + this.settings.checkClassName + '"><span>' + currentQuestion.answers[i].text + '</span></li>')
            } else {
                $('.' + this.settings.answerOptionsClassName).append('<li class="' + this.settings.answerClassName + '"><input type="checkbox" class="' + this.settings.checkClassName + '"><span>' + currentQuestion.answers[i].text + '</span></li>')
            }
        }
        //Кнопка перехода к следующему вопросу
        this.test.append('<button class="' + this.settings.jumpButtonClassName + '">' + this.settings.jumpButtonText + '</button>');
        $('.' + this.settings.jumpButtonClassName).attr('disabled', 'disabled');

        var yourTest = this;

        //Устанавливает обработчик клика на span у check
        yourTest.test.find('.' + yourTest.settings.answerOptionsClassName + ' span').click(function() {
            SpanClikc(yourTest, this);
        }).css('cursor', 'pointer');

        //Устанавливает обработчик клика для check
        yourTest.test.find('.' + yourTest.settings.checkClassName).click(function() {
            CheckClick(yourTest, this);
        }).css("cursor", "pointer");

        //Устанавливает обработчик клика для jumpButton
        yourTest.test.find('.' + yourTest.settings.jumpButtonClassName).click(function() {
            JumpButtonClick(yourTest, currentQuestion);
        });
    };

    $.fn.yourTest = function(options) {

        //Инициализирует класс для работы с тестом
        var factory = new YourTest(this.first(), options);

        //Инициализирует тест
        factory.init();

        return this.first();
    };

    //Метод для получения количества оставшихся попыток
    $.fn.GetAttempts = function() {
        return GetCookie().attempts;
    }

    //Метод для получения номера вопроса на котором пользователь остановился
    $.fn.GetCurrentQuestion = function() {
        return GetCookie().currentQuestion;
    }
})(jQuery);