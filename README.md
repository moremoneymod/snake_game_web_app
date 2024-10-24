Данный проект представляет собой telegram web app.
В качестве игры была реализована змейка

Необходимое ПО: PyCharm, MySQL

# Инструкции по запуску:

- Создать в MySQL таблицу, код для создания приведен ниже
- Скачать проект себе в pycharm
- Создать ssl сертификат для запуска игры на локалхосте, инструкция ниже
- Устанавливаем все необходимые библиотеки, используя файл requirements.txt (в терминале прописываем команду `pip install -r requirements.txt`)
- В файле config.py указываем данные для подключения к базе данных (там уже указаны некоторые данные, включая токен бота)
- Запускаем бота (bot/bot.py) и вебсервер (web_app/web_server.py)
- В телеграм вбиваем имя бота: @snake_web_app_bot
- Боту отправлем команду /play

**Код для создания таблицы:**

`CREATE TABLE snake_game_progress (id SERIAL PRIMARY KEY, tg_user_id BIGINT UNIQUE,snake_position TEXT NOT NULL, food_position TEXT NOT NULL,direction TEXT NOT NULL, score INT NOT NULL);`

**Инструкция для создания сертификата:**

[Создаем самоподписанный сертификат](https://devcenter.heroku.com/articles/ssl-certificate-self)

Если на компьютере установлен git, то openssl будет находиться по адресу: `C:\Program Files\Git\usr\bin`
Через командную строку переходим по данному адресу и выполняем действия по инструкции, файлы будут находиться в этой же папке.
Два файла (их легко найти, если отсортировать файлы в папке по дате), **server.crt и server.key необходимо поместить в папку web_app проекта, чтобы web_server.py смог их использовать**

**Как реализовано сохранение прогресса:**
Игра сохраняет прогресс два способами:
- Используя локальное хранилище
- Сохраняет прогресс в базе данных

Прогресс сохраняется в локальном хранилище при каждом движении змейки,в базу данных - при каждом поедании фрукта
Если по какой-то причине база данных не будет работать, прогресс будет спокойно загружаться из локального хранилища
