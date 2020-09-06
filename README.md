# YourTest

## Описание

Плагин предназначен для быстрого и легкого создания тестов.

---

## Важно!

Для работы плагина необнодимы :

1. Библиотека jQuery: https://jquery.com/download/
2. Плагин jQuery Cookie: https://plugins.jquery.com/cookie/

### Временно

На странице может находиться только один тест.

---

## Подключение

Плагин подключается в конец тега `body`.

### Пример:

```
<body>

	.
	.
	.

	<script type="text/javascript" src="jquery.yourTest.min.js"></script>

</body>
```

Плагин должен быть подключен после **jQuery** и **jQuery Cookie**.

---

## Начало работы

Для начала работы с плагином к блоку в котором будет находиться тест нужно применить метод yourTest.

### Пример:

```
	$('.someBlock').yourTest();
```
Для работы плагина нужно указать файл с вопросами (файл должен иметь формат json).

### Пример:

```
	$('.someBlock').yourTest({
		pathToQuestions:'data/questions.json';
	});
```

**Важно!**

Плагин не будет работать без файла с вопросами

---

## Организация файла с вопросами

<br>

### Поля файла:
<br>

Название | Тип | Описание
--- | --- | ---
**question** | string | Текст вопроса
**oneAnswer** | bolean | Сколько ответов в данном вопросе. *true* - один, *false* - несколько
**answers** | array | Содержит в себе варианты ответов на вопрос
<br>
<br>

### Массив с ответам:
<br>

Название | Тип | Описание
--- | --- | ---
**text** | string | Текст варианта ответа
**rigth** | bolean | Является ли данный ответ верным. *true* - ответ верный, *false* - ответ не верный

<br>
<br>

### Пример файла с вопросами :

```
[
	{
		"question":"Какое из пречисленных животных является символом Диснея?",
		"oneAnswer":true,
		"answers":[
			{
				"text":"Кошка",
				rigth:false
			},
			{
				"text":"Собака",
				"rigth":false
			},
			{
				"text":"Мышь",
				"rigth":true
			}
		]
	}
]
```

Каждый вопрос должен иметь аналогичную структуру (количество ответов на вопрос может быть любым) и хотя бы один правильный ответ.

---

## Настройки плагина
<br>

### Имена классов и текст:

<br>

Название | Значение по умолчанию | Описание
--- | --- | --- 
**questionTextClassName** | test__questionText | Класс с текстом вопроса
**progressBarClassName** | test__progress | Класс прогресс бара
**warningClassName** |  test__warning | Класс предупреждения о том, что вопрос имеет несколько вариантов ответа
**answerOptionsClassName** | test__answerOption | Класс - контейнер для ответов на вопросы
**answerClassName** | answerOption__answer | Класс ответа на вопрос
**checkClassName** |  answer__check | Класс checkBox и radioButton
**jumpButtonClassName** | test__jump-btn | Класс кнопки перехода к следующему вопросу
**progressBarText** | null | Текст для погресс бара (не рекомендуется менять)
**warningText** | Выберите несколько вариантов ответов | Текст предупреждающи о нескольких вариантах ответа на вопрос
**jumpButtonText** |  Получить ответ | Текст на кнопке перехода к следующему вопросу

<br>
<br>

### Настройки теста:
<br>

Название | Тип | Значение по умолчанию | Описание
--- | :---: | :---: | ---
**pathToQuestions** | string | null | Путь до файла с вопросами (**обязательно к заполнению!**)
**saveLastUserQuestion** | bolean | true | Сохранять ли номер последнего вопроса,к которому приступил пользователь. *true* - сохранять, *false* 											- не сохранять
**numberOfAttempts** | number | -1 | Количетво попыток прохождения теста.Уменьшается в случае неправильного ответа пользователя. Отрицательное 										значение означает, что тест нельзя провалить. Значение 0 не допускается

<br>
<br>

### Функции Feedback:

Название | Значение по умолчанию | Описание
--- | :---: | --- 
 **answerNotFaithful** | alert("Не верный ответ"); | Функция вызываемая в случае не правильного ответа пользователя
 **testFailed** | alert("Тест провален"); <br> location.reload(); | Функция вызываемая в случае если пользователь израсходовал все попытки
 **testFinished** | alert("Тест окончен"); <br> location.reload();| Функция вызываемая в случае если пользователь успешно прошел тест          				 

<br>

### Пример создания настроек:

```
$('.someBlock').yourTest({
	pathToQuestions:"data/questions.json",
	questionTextClassName:"question",
	saveLastUserQuestion:false,
	answerNotFaithful:function(){
		alert("Попробуй еще раз");
	}
});
```

