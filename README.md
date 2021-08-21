# Скрипт для подсветки ботов ВК

## Разработка
Вставьте следующий скрипт в Tempermonkey
```
// ==UserScript==
// @name         VK antibot DEV
// @namespace    vk-metabot-user-js
// @description  Подсветка ботов ВКонтакте.
// @version      0.0.1
// @include      https://*vk.com/*
// @connect      api.gosvon.net
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at       document-start
// @require      http://localhost:5000/main.js
// ==/UserScript==
```

затем запустите

`npm run dev`
