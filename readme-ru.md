## Пример реакт-приложения на микрофронтендах (module federation plugin)

В этом репозитории пример как можно использовать Module Federation. Использован подход моно-репозитория с подмодулями для микросервисов / библиотек.

## Быстрый запуск

```sh
git clone https://github.com/EvgenyiFedotov/micro-frontend-react --recursive
cd ./micro-frontend-react
git submodule foreach 'git checkout master'
npm install
npm run start-dev
```

## Работа с git

## Добавление нового сервиса (микрофронтенда)

## Использование панели администратора

### Запуск отдельных микрофронтендов

### Ближайшие работы

- [x] АПИ контроллера
- [ ] Универсальность хука для подписки на сокет
- [ ] Подгрузка сервисов без запуска контроллера
- [ ] Add folder for COMMON modules
