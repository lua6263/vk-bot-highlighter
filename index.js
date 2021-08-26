// ==UserScript==
// @name         VK antibot
// @namespace    vk-metabot-user-js
// @description  Борьба с ботами вконтакте.
// @version      0.0.1
// @include      https://*vk.com/*
// @connect      api.gosvon.net
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/utils.ts
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/* eslint-enable @typescript-eslint/naming-convention */
const http = GM_xmlhttpRequest || (GM && GM.xmlHttpRequest);
if (!http) {
    throw new Error('Unable to get supported cross-origin XMLHttpRequest function.');
}
/* harmony default export */ const utils = ({
    http(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                http({
                    url: options.url,
                    method: options.method || 'GET',
                    overrideMimeType: 'application/json; charset=windows-1251',
                    onload(response) {
                        return __awaiter(this, void 0, void 0, function* () {
                            resolve(response.responseText);
                        });
                    },
                });
            });
        });
    },
    unsafeWindow,
    setStorageValue: GM_setValue,
    getStorageValue: GM_getValue,
    allParents(element) {
        const parents = [element];
        while (parents[parents.length - 1].parentElement) {
            parents.push(parents[parents.length - 1].parentElement);
        }
        return parents.slice(1);
    },
    createLayoutFromString(template, vars = {}) {
        const html = Object.entries(vars)
            .reduce((acc, [key, value]) => acc.replace(`{{${key}}}`, value), template);
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.children[0];
    },
});

;// CONCATENATED MODULE: ./src/constants.ts
const VK_BOT_LIST_URL = 'http://api.gosvon.net/marking3/list';
const CONFIG_URL = 'http://api.gosvon.net/marking3/main2';

;// CONCATENATED MODULE: ./src/configFactory.ts
var configFactory_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


function configFactory() {
    let config = {
        botListVersion: '',
        marks: [],
    };
    function processRawConfig(rawConfig) {
        const marksFromRawTypes = rawConfig.types.map((rawTypeItem) => ({
            id: String(rawTypeItem.id),
            name: rawTypeItem.n,
            color: rawTypeItem.color,
            gradientDirection: null,
        }));
        const marksFromRawMarks = rawConfig.mark.map((rawMarkItem) => {
            const directionFromMarkId = rawMarkItem.id.split('_')[0];
            return {
                id: rawMarkItem.id,
                name: rawMarkItem.n,
                color: rawMarkItem.color,
                gradientDirection: {
                    d: 'vertical',
                    g: 'horizontal',
                }[directionFromMarkId],
            };
        });
        return {
            botListVersion: String(rawConfig.timestamp),
            marks: [
                ...marksFromRawTypes,
                ...marksFromRawMarks,
            ],
        };
    }
    function fetchConfig() {
        return configFactory_awaiter(this, void 0, void 0, function* () {
            const responseText = yield utils.http({ url: CONFIG_URL });
            config = processRawConfig(JSON.parse(responseText));
        });
    }
    function getConfig() {
        return config;
    }
    return {
        fetchConfig,
        getConfig,
    };
}

;// CONCATENATED MODULE: ./src/elementsFinderFactory.ts
function elementsFinderFactory() {
    const mapSelectorHandlers = {};
    let alreadyFoundElements = [];
    setInterval(() => {
        Object.entries(mapSelectorHandlers).forEach(([selector, handlers]) => {
            const newFoundElements = [...document.querySelectorAll(selector)]
                .filter((element) => !alreadyFoundElements.includes(element));
            newFoundElements.forEach((element) => {
                handlers.forEach((handler) => {
                    handler(element);
                });
            });
            alreadyFoundElements = [
                ...alreadyFoundElements,
                ...newFoundElements,
            ];
        });
    }, 300);
    function on(selector, foundHandler) {
        if (!mapSelectorHandlers[selector]) {
            mapSelectorHandlers[selector] = [];
        }
        mapSelectorHandlers[selector].push(foundHandler);
    }
    return {
        on,
    };
}

;// CONCATENATED MODULE: ./src/botListsFactory.ts
var botListsFactory_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


function botListsFactory(config, userSettings) {
    let botList = [];
    function processRawBotList(rawBotList) {
        return rawBotList
            .map((rawBotItem) => ({
            id: Number(rawBotItem.i),
            nickname: rawBotItem.n,
            marksIds: [
                rawBotItem.t,
                ...(rawBotItem.m ? [rawBotItem.m] : []),
            ],
        }));
    }
    function fetchBotList() {
        return botListsFactory_awaiter(this, void 0, void 0, function* () {
            const responseText = yield utils.http({ url: VK_BOT_LIST_URL });
            return processRawBotList(JSON.parse(responseText));
        });
    }
    function findBot(idOrNickname) {
        const matchId = String(idOrNickname).match(/^(id)?(\d{6,})$/);
        const id = matchId && Number(matchId[2]);
        let foundBot = null;
        if (!id) {
            foundBot = botList.find((bot) => bot.nickname === idOrNickname);
        }
        else {
            foundBot = botList.find((bot) => bot.id === id);
        }
        if (!foundBot) {
            return null;
        }
        const isEveryMarksDisabled = foundBot.marks.every((markItem) => userSettings.checkIsMarkDisabled(markItem.id));
        if (isEveryMarksDisabled) {
            return null;
        }
        return foundBot;
    }
    function fillLists() {
        return botListsFactory_awaiter(this, void 0, void 0, function* () {
            const configData = config.getConfig();
            const localBotListVersion = utils.getStorageValue('botHighlighterBotListVersion1') || 0;
            let newBotLists = [];
            if (configData.botListVersion === localBotListVersion) {
                newBotLists = JSON.parse(utils.getStorageValue('botHighlighterSavedBotList') || '[]');
            }
            else {
                newBotLists = yield fetchBotList();
                utils.setStorageValue('botHighlighterSavedBotList', JSON.stringify(newBotLists));
                utils.setStorageValue('botHighlighterBotListVersion1', configData.botListVersion);
            }
            const bots = newBotLists.map((bot) => {
                const marks = bot.marksIds
                    .map((botMarkItemId) => configData.marks.find((markItem) => markItem.id === botMarkItemId))
                    .filter(Boolean);
                const background = (() => {
                    if (marks.length === 1) {
                        return marks[0].color;
                    }
                    const percentShare = Math.round(100 / marks.length);
                    const gradientPointsString = marks.reduce((accStr, markItem, i) => {
                        const itemPercent = (i === marks.length - 1) ? 100 : percentShare * i;
                        return `${accStr}, ${markItem.color} ${itemPercent}%`;
                    }, '');
                    const gradientDirection = (() => marks
                        .find((markItem) => markItem.gradientDirection)
                        .gradientDirection)();
                    const gradientAngle = {
                        vertical: '0deg',
                        horizontal: '90deg',
                    }[gradientDirection];
                    return `linear-gradient(${gradientAngle}${gradientPointsString})`;
                })();
                return {
                    id: bot.id,
                    nickname: bot.nickname,
                    marks,
                    background,
                };
            });
            botList = bots;
        });
    }
    return {
        fillLists,
        findBot,
    };
}

;// CONCATENATED MODULE: ./node_modules/raw-loader/dist/cjs.js!./src/layouts/commonActions.html
/* harmony default export */ const commonActions = ("<i>\n    <a target='_blank' href='https://gosvon.net/?usr={{userID}}'>\n        Комментарии\n    </a>\n    <a target='_blank' href='https://gosvon.net/photo.php?id={{userID}}'>\n        Карточка\n    </a>\n</i>\n");
;// CONCATENATED MODULE: ./node_modules/raw-loader/dist/cjs.js!./src/layouts/commonMarksContainer.html
/* harmony default export */ const commonMarksContainer = ("<div class=\"vk-bot-marks\" style=\"display: inline-block;\"></div>\n");
;// CONCATENATED MODULE: ./src/hightlighters/onReplyFound.ts



function onReplyFound(replyEl, botList) {
    const authorEl = replyEl.querySelector('a.author');
    if (!authorEl) {
        return;
    }
    const userID = authorEl.getAttribute('data-from-id');
    const bot = botList.findBot(userID);
    if (!bot) {
        return;
    }
    const replyContentEl = replyEl.querySelector('.reply_content');
    const replyAuthorEl = replyEl.querySelector('.reply_author');
    replyContentEl.style.background = bot.background;
    replyContentEl.style.borderLeft = '3px solid rgba(255,50,50,0.3)';
    replyContentEl.style.paddingLeft = '3px';
    const marksEl = utils.createLayoutFromString(commonMarksContainer);
    authorEl.after(marksEl);
    bot.marks
        .map((mark, i) => utils.createLayoutFromString(`
      <i>
        ${i === 0 ? '(' : ''}
        ${mark.name}
        ${(i === bot.marks.length - 1) ? ')' : ', '}
      </i>
    `))
        .forEach((markEl) => marksEl.appendChild(markEl));
    replyAuthorEl.append(utils.createLayoutFromString(commonActions, { userID }));
}

;// CONCATENATED MODULE: ./src/hightlighters/onPostFound.ts



function onPostFound(postEl, botList) {
    const userID = postEl.querySelector('a.author').getAttribute('data-from-id');
    if (!userID) {
        return;
    }
    const bot = botList.findBot(userID);
    if (!bot) {
        return;
    }
    const postHeaderEl = postEl.querySelector('.post_header');
    const postAuthorEl = postEl.querySelector('.post_author');
    postHeaderEl.style.background = bot.background;
    postHeaderEl.style.borderLeft = '3px solid rgba(255,50,50,0.3)';
    postHeaderEl.style.paddingLeft = '3px';
    const authorEl = postEl.querySelector('.author');
    const marksEl = utils.createLayoutFromString(commonMarksContainer);
    authorEl.after(marksEl);
    bot.marks
        .map((mark, i) => utils.createLayoutFromString(`
      <i>
        ${i === 0 ? '(' : ''}
        ${mark.name}
        ${(i === bot.marks.length - 1) ? ')' : ', '}
      </i>
    `))
        .forEach((markEl) => marksEl.appendChild(markEl));
    postAuthorEl.append(utils.createLayoutFromString(commonActions, { userID }));
}

;// CONCATENATED MODULE: ./src/hightlighters/onFanFound.ts

function onFanFound(fanEl, botList) {
    const userID = fanEl.getAttribute('data-id');
    const bot = botList.findBot(userID);
    if (!bot) {
        return;
    }
    fanEl.style.background = bot.background;
    fanEl.style.borderLeft = '3px solid rgba(255,50,50,0.3)';
    fanEl.style.paddingLeft = '3px';
    fanEl.append(utils.createLayoutFromString(`
      <center>
        <i>
          <a target='_blank' href='https://gosvon.net/?usr=${userID}'>
            Комментарии
          </a>
          <a target='_blank' href='https://gosvon.net/photo.php?id=${userID}'>
            Карточка
          </a>
        </i>
      </center>
    `));
}

;// CONCATENATED MODULE: ./src/hightlighters/onLikeFound.ts
function onLikeFound(likeEl, botList) {
    const userID = likeEl.getAttribute('href').substr(1);
    const bot = botList.findBot(userID);
    if (!bot) {
        return;
    }
    const userAvatarEl = likeEl.querySelector('.like_tt_image');
    userAvatarEl.style.opacity = '0.5';
    likeEl.style.borderRadius = '0';
    likeEl.style.background = 'red';
}

;// CONCATENATED MODULE: ./src/hightlighters/onProfileFound.ts


function onProfileFound(_, botList) {
    const abuseActionEl = document.querySelector('.PageActionCell[data-task-click="ProfileAction/abuse"]');
    if (!abuseActionEl) {
        return;
    }
    const userID = abuseActionEl.getAttribute('data-user_id');
    const bot = botList.findBot(userID);
    if (!bot) {
        return;
    }
    const pagePhotoEl = document.querySelector('.page_photo');
    pagePhotoEl.style.background = bot.background;
    const pageNameEl = document.querySelector('.page_name');
    pageNameEl.insertAdjacentElement('afterend', utils.createLayoutFromString(commonActions, { userID }));
}

;// CONCATENATED MODULE: ./src/hightlighters/onFoundMobilePost.ts


function onFoundMobilePost(mobilePostEl, botList) {
    const wiHeadLink = mobilePostEl.querySelector('.wi_head a');
    if (!wiHeadLink) {
        return;
    }
    const userID = wiHeadLink.className.substr(4);
    const bot = botList.findBot(userID);
    if (!bot) {
        return;
    }
    const postHeaderEl = mobilePostEl.querySelector('.wi_head');
    postHeaderEl.style.background = bot.background;
    postHeaderEl.style.borderLeft = '3px solid rgba(255,50,50,0.3)';
    postHeaderEl.style.paddingLeft = '3px';
    postHeaderEl.append(utils.createLayoutFromString(commonActions, { userID }));
}

;// CONCATENATED MODULE: ./src/hightlighters/onFoundMobileProfile.ts



function onFoundMobileProfile(ownerPanelEl, botList) {
    const reportEl = document.querySelector('.ContextMenu__listItem a[href*=reports]');
    if (!reportEl) {
        return;
    }
    const userID = reportEl.getAttribute('href').match(/user_id=(\d+)/)[1];
    const bot = botList.findBot(userID);
    if (!bot) {
        return;
    }
    const ppContEl = ownerPanelEl.querySelector('.pp_cont');
    const opHeaderEl = ppContEl.querySelector('.op_header');
    const marksContainer = utils.createLayoutFromString(commonMarksContainer);
    opHeaderEl.after(marksContainer);
    bot.marks
        .map((mark, i) => utils.createLayoutFromString(`
      <i>
        ${i === 0 ? '(' : ''}
        ${mark.name}
        ${(i === bot.marks.length - 1) ? ')' : ', '}
      </i>
    `))
        .forEach((markEl) => marksContainer.appendChild(markEl));
    ppContEl.style.background = bot.background;
    ppContEl.append(utils.createLayoutFromString(commonActions, { userID }));
}

;// CONCATENATED MODULE: ./src/hightlighters/onFoundMobileReply.ts


function onFoundMobileReply(replyEl, botList) {
    const replyUserNameEl = replyEl.querySelector('.ReplyItem__name');
    if (!replyUserNameEl) {
        return;
    }
    const userID = replyUserNameEl.getAttribute('href').substr(1);
    const bot = botList.findBot(userID);
    if (!bot) {
        return;
    }
    const marksEl = utils.createLayoutFromString(`
    <div
      class="vk-bot-marks"
      style="
        display: inline-block;
        font-size: 12px;
      "></div>
  `);
    replyUserNameEl.after(marksEl);
    bot.marks
        .map((mark, i) => utils.createLayoutFromString(`
      <i>
        ${i === 0 ? '(' : ''}
        ${mark.name}
        ${(i === bot.marks.length - 1) ? ')' : ', '}
      </i>
    `))
        .forEach((markEl) => marksEl.appendChild(markEl));
    const replyHeaderEl = replyEl.querySelector('.ReplyItem__header');
    replyHeaderEl.style.background = bot.background;
    replyHeaderEl.style.borderLeft = '3px solid rgba(255,50,50,0.3)';
    replyHeaderEl.style.paddingLeft = '3px';
    replyHeaderEl.append(utils.createLayoutFromString(commonActions, { userID }));
}

;// CONCATENATED MODULE: ./src/hightlighters/onFoundMobileFan.ts
function onFoundMobileFan(fanEl, botList) {
    const userID = fanEl.className.match(/_u(\d+)/)[1];
    const bot = botList.findBot(userID);
    if (!bot) {
        return;
    }
    fanEl.style.background = bot.background;
    fanEl.style.borderLeft = '3px solid rgba(255,50,50,0.3)';
    fanEl.style.paddingLeft = '3px';
}

;// CONCATENATED MODULE: ./node_modules/raw-loader/dist/cjs.js!./src/addVkBotOptionsInMenu/menuItem.template.html
/* harmony default export */ const menuItem_template = ("<a\n    class=\"top_profile_mrow\"\n    onclick=\"{{callOnClick}}()\"\n>\n    VK боты\n</a>\n");
;// CONCATENATED MODULE: ./node_modules/raw-loader/dist/cjs.js!./src/addVkBotOptionsInMenu/settingsModal.template.html
/* harmony default export */ const settingsModal_template = ("<div>\n    <div\n        id=\"box_layer_wrap\"\n        class=\"VkBotsSettingsModal scroll_fix_wrap fixed\"\n        style=\"\n            width: 100%;\n            height: 100%;\n            display: none;\n        \"\n    >\n        <div\n            id=\"box_layer\"\n            style=\"padding-bottom: 0;\"\n        >\n            <div\n                class=\"popup_box_container\"\n                tabindex=\"0\"\n                style=\"\n                    width: 100%;\n                    max-width: 650px;\n                    height: auto;\n                    margin-top: 100px;\n                \"\n            >\n                <div class=\"box_layout\">\n                    <div class=\"box_title_wrap\">\n                        <div\n                            class=\"box_x_button\"\n                            aria-label=\"Закрыть\"\n                            tabindex=\"0\"\n                            role=\"button\"\n                            onclick=\"closeVkBotSettings()\"\n                        ></div>\n\n                        <div class=\"box_title\">\n                            Подсветка ботов ВК\n                        </div>\n                    </div>\n\n                    <div\n                        class=\"box_body box_no_buttons\"\n                        style=\"\n                            height: 400px;\n                            overflow: auto;\n                        \"\n                    >\n                        <div class=\"settings_line clear_fix\">\n\n                            <div class=\"settings_labeled_text vk_settings_block vk_settings_block_left fl_l\">\n\n                                {{checkboxes}}\n\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n");
;// CONCATENATED MODULE: ./src/addVkBotOptionsInMenu/index.ts



function addVkBotOptionsInMenu(config, userSettings) {
    const existingMenuItems = [...document.querySelectorAll('.top_profile_mrow')];
    const lastExistingMenuItem = existingMenuItems[existingMenuItems.length - 2];
    utils.unsafeWindow.vkBotMarks = config.getConfig().marks;
    document.body.appendChild(utils.createLayoutFromString(settingsModal_template, {
        checkboxes: config.getConfig().marks.reduce((acc, mark) => {
            const isEnabled = !userSettings.checkIsMarkDisabled(mark.id);
            return `
            ${acc}

            <div
              class="checkbox ${isEnabled ? 'on' : ''}"
              onclick="
                checkbox(this);
                changeVkBotMarkEnabledState('${mark.id}', isChecked(this))
              "
              role="checkbox"
              ${isEnabled ? 'aria-checked="true"' : ''}
              tabindex="0"
              style="
                margin-bottom: 10px;
              "
          >
              <div class="vk_checkbox_caption">
                  ${mark.name}
              </div>
          </div>
        `;
        }, ''),
    }));
    lastExistingMenuItem.after(utils.createLayoutFromString(menuItem_template, {
        callOnClick: 'openVkBotsSettings',
    }));
    utils.unsafeWindow.openVkBotsSettings = () => {
        document.querySelector('.VkBotsSettingsModal').style.display = 'block';
    };
    utils.unsafeWindow.changeVkBotMarkEnabledState = (markId, isEnabledRaw) => {
        const isEnabled = Boolean(isEnabledRaw);
        if (isEnabled) {
            userSettings.enableMark(markId);
        }
        else {
            userSettings.disableMark(markId);
        }
    };
    utils.unsafeWindow.closeVkBotSettings = () => {
        document.querySelector('.VkBotsSettingsModal').style.display = 'none';
    };
}

;// CONCATENATED MODULE: ./src/userSettingsFactory.ts

function userSettingsFactory() {
    const settings = utils.getStorageValue('botHighlighterSettings') || {
        disabledMarks: [],
    };
    function saveSettings() {
        utils.setStorageValue('botHighlighterSettings', settings);
    }
    function disableMark(markId) {
        settings.disabledMarks = [...settings.disabledMarks, markId];
        saveSettings();
    }
    function enableMark(markId) {
        settings.disabledMarks = settings.disabledMarks.filter((markIdItem) => markIdItem === markId);
        saveSettings();
    }
    function checkIsMarkDisabled(markId) {
        return settings.disabledMarks.includes(markId);
    }
    return {
        enableMark,
        disableMark,
        checkIsMarkDisabled,
    };
}

;// CONCATENATED MODULE: ./src/index.ts
var src_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};














const userSettings = userSettingsFactory();
const config = configFactory();
const botList = botListsFactory(config, userSettings);
function start() {
    return src_awaiter(this, void 0, void 0, function* () {
        yield config.fetchConfig();
        yield botList.fillLists();
        const finder = elementsFinderFactory();
        finder.on('#top_profile_menu', () => addVkBotOptionsInMenu(config, userSettings));
        finder.on('.reply', (el) => onReplyFound(el, botList));
        finder.on('.post', (el) => onPostFound(el, botList));
        finder.on('.fans_fan_row', (el) => onFanFound(el, botList));
        finder.on('.like_tt_owner', (el) => onLikeFound(el, botList));
        finder.on('#profile', (el) => onProfileFound(el, botList));
        finder.on('.wall_item', (el) => onFoundMobilePost(el, botList));
        finder.on('.owner_panel.profile_panel', (el) => onFoundMobileProfile(el, botList));
        finder.on('.ReplyItem', (el) => onFoundMobileReply(el, botList));
        finder.on('.pcont .inline_item', (el) => onFoundMobileFan(el, botList));
    });
}
start();

/******/ })()
;