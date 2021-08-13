// ==UserScript==
// @name         VK antibot
// @namespace    vk-metabot-user-js
// @description  Борьба с ботами вконтакте.
// @version      0.0.1
// @include      https://*vk.com/*
// @require      https://cdn.jsdelivr.net/npm/idb-keyval@5/dist/iife/index-min.js
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM.xmlHttpRequest
// @run-at       document-start
// ==/UserScript==

const VK_BOT_LIST_URL = 'http://api.gosvon.net/marking3/'
const CONFIG_URL = 'http://api.gosvon.net/marking3/main'
const IDB_KEY = 'botHighlighterSavedBases'
// TODO remove
const MAP_COLOR_BY_CODE = {
  '1': 'rgba(255,50,50,0.4)',
  '8': 'rgba(255,50,50,0.3)',
  '12': 'rgba(255,90,0,0.4)',
  '13': 'rgba(255,50,50,0.3)',
}

const http = GM_xmlhttpRequest || (GM && GM.xmlHttpRequest)
unsafeWindow.copyCheckLayout = copyCheckLayout

const config = configFactory()
const botLists = botListsFactory()

async function start() {
  await config.fetch()
  await botLists.fillLists()

  const finder = elementsFinderFactory()

  finder.on('.reply', onReplyFound)
  finder.on('.post', onPostFound)
  finder.on('.fans_fan_row', onFanFound)
  finder.on('.like_tt_owner', onLikeFound)
  finder.on('#profile', onProfileFound)

  finder.on('.wall_item', onFoundMobilePost)
  finder.on('.owner_panel.profile_panel', onFoundMobileProfile);
  finder.on('.ReplyItem', onFoundMobileReply);
  finder.on('.pcont .inline_item', onFoundMobileFan);

}
start()

function onReplyFound(replyEl) {
  const authorEl = replyEl.querySelector('a.author')

  if (!authorEl) {
    return
  }

  const userID = authorEl.getAttribute('data-from-id')
  const bot = botLists.findBot(userID)

  const replyContentEl = replyEl.querySelector('.reply_content')
  const replyAuthorEl = replyEl.querySelector('.reply_author')

  if (!bot) {
    const post = allParents(replyEl).find(el => el.classList.contains('post') || el.classList.contains('wl_post'))
    const postID = post ? post.getAttribute('data-post-id') : null

    replyAuthorEl.append(
      createLayoutFromString(`
        <i>
          <a onclick="copyCheckLayout(${userID}, '${postID}', this)">
            Копировать шаблон обращения
          </a>
        </i>
      `)
    )
    return
  }

  replyContentEl.style.background = MAP_COLOR_BY_CODE[bot.code]
  replyContentEl.style.borderLeft = `3px solid ${MAP_COLOR_BY_CODE[bot.code]}`
  replyContentEl.style.paddingLeft = '3px'

  replyAuthorEl.append(
    createLayoutFromString(`
      <i>
        <a target='_blank' href='https://gosvon.net/?usr=${userID}'>
          Комментарии
        </a>
        <a target='_blank' href='https://gosvon.net/photo.php?id=${userID}'>
          Карточка
        </a>
      </i>
    `)
  )
}

function onPostFound(postEl) {
  const userID = postEl.querySelector('a.author').getAttribute('data-from-id')

  if (!userID) {
    return
  }

  const bot = botLists.findBot(userID)

  if (!bot) {
    return
  }

  const postHeaderEl = postEl.querySelector('.post_header')
  const postAuthorEl = postEl.querySelector('.post_author')

  postHeaderEl.style.background = MAP_COLOR_BY_CODE[bot.code]
  postHeaderEl.style.borderLeft = `3px solid ${MAP_COLOR_BY_CODE[bot.code]}`
  postHeaderEl.style.paddingLeft = '3px'

  postAuthorEl.append(
    createLayoutFromString(`
      <i>
        <a target='_blank' href='https://gosvon.net/?usr=${userID}'>
          Комментарии
        </a>
        <a target='_blank' href='https://gosvon.net/photo.php?id=${userID}'>
          Карточка
        </a>
      </i>
    `)
  )
}

function onFanFound(fanEl) {
  const userID = fanEl.getAttribute('data-id')
  const bot = botLists.findBot(userID)

  if (!bot) {
    return
  }

  fanEl.style.background = MAP_COLOR_BY_CODE[bot.code]
  fanEl.style.borderLeft = `3px solid ${MAP_COLOR_BY_CODE[bot.code]}`
  fanEl.style.paddingLeft = '3px'

  fanEl.append(
    createLayoutFromString(`
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
    `)
  )
}

function onLikeFound(likeEl) {
  const userID = likeEl.getAttribute('href').substr(1)
  const bot = botLists.findBot(userID)

  if (!bot) {
    return
  }

  const userAvatarEl = likeEl.querySelector('.like_tt_image')

  userAvatarEl.style.opacity = '0.5'

  likeEl.style.borderRadius = '0'
  likeEl.style.background = 'red'
}

function onProfileFound() {
  const abuseActionEl = document.querySelector('.page_actions_item.PageActionItem--abuse')

  if (!abuseActionEl) {
    return
  }

  const userID = abuseActionEl.getAttribute('onclick').match(/\d+/)[0]
  const bot = botLists.findBot(userID)

  if (!bot) {
    return
  }

  const pagePhotoEl = document.querySelector('.page_photo');
  pagePhotoEl.style.background = MAP_COLOR_BY_CODE[bot.code]

  const pageNameEl = document.querySelector('.page_name');

  pageNameEl.insertAdjacentElement('afterend', createLayoutFromString(`
    <i>
      <a target='_blank' href='https://gosvon.net/?usr=${userID}'>
        Комментарии
      </a>
      <a target='_blank' href='https://gosvon.net/photo.php?id=${userID}'>
        Карточка
      </a>
    </i>
  `))
}

function onFoundMobilePost(mobilePostEl) {
  const wiHeadLink = mobilePostEl.querySelector('.wi_head a')

  if (!wiHeadLink) {
    return
  }

  const userID = wiHeadLink.className.substr(4);
  const bot = botLists.findBot(userID)

  if (!bot) {
    return
  }

  const postHeaderEl = mobilePostEl.querySelector('.wi_head');

  postHeaderEl.style.background = MAP_COLOR_BY_CODE[bot.code]
  postHeaderEl.style.borderLeft = `3px solid ${MAP_COLOR_BY_CODE[bot.code]}`
  postHeaderEl.style.paddingLeft = "3px"

  postHeaderEl.append(
    createLayoutFromString(`
      <i>
        <a target='_blank' href='https://gosvon.net/?usr=${userID}'>
          Комментарии
        </a>
        <a target='_blank' href='https://gosvon.net/photo.php?id=${userID}'>
          Карточка
        </a>
      </i>"
    `)
  );
}

function onFoundMobileProfile(ownerPanelEl) {
  const reportEl = document.querySelector('.ContextMenu__listItem a[href*=reports]')

  if (!reportEl) {
    return
  }

  const userID = reportEl.getAttribute('href').match(/owner_id=(\d+)/)[1]

  const bot = botLists.findBot(userID)

  if (!bot) {
    return
  }

  const ppContEl = ownerPanelEl.querySelector('.pp_cont')

  ppContEl.style.background = MAP_COLOR_BY_CODE[bot.code]
  ppContEl.append(
    createLayoutFromString(`
      <i>
        <a target='_blank' href='https://gosvon.net/?usr=${userID}'>
          Комментарии
        </a>
        <a target='_blank' href='https://gosvon.net/photo.php?id=${userID}'>
          Карточка
        </a>
      </i>
    `)
  );
}

function onFoundMobileReply(replyEl) {
  const userID = replyEl.querySelector('.ReplyItem__action').getAttribute('onclick').match(/(\d+)\)/)[1]

  const bot = botLists.findBot(userID)

  if (!bot) {
    return
  }

  const replyHeaderEl = replyEl.querySelector('.ReplyItem__header')

  replyHeaderEl.style.background = MAP_COLOR_BY_CODE[bot.code]
  replyHeaderEl.style.borderLeft = `3px solid ${MAP_COLOR_BY_CODE[bot.code]}`
  replyHeaderEl.style.paddingLeft = "3px"

  replyHeaderEl.append(
    createLayoutFromString(`
      <i>
        <a target='_blank' href='https://gosvon.net/?usr=${userID}'>
          Комментарии
        </a>
        <a target='_blank' href='https://gosvon.net/photo.php?id=${userID}'>
          Карточка
        </a>
      </i>
    `)
  )
}

function onFoundMobileFan(fanEl) {
  const userID = fanEl.className.match(/_u(\d+)/)[1]

  const bot = botLists.findBot(userID)

  if (!bot) {
    return
  }

  fanEl.style.background = MAP_COLOR_BY_CODE[bot.code]
  fanEl.style.borderLeft = `3px solid ${MAP_COLOR_BY_CODE[bot.code]}`
  fanEl.style.paddingLeft = "3px"
}

function allParents(element) {
  const parents = [element]
  while (parents[parents.length - 1].parentElement) {
    parents.push(parents[parents.length - 1].parentElement)
  }
  return parents.slice(1)
}

function createLayoutFromString(string) {
  const div = document.createElement('div')
  div.innerHTML = string

  return div.children[0]
}

function botListsFactory() {
  let botLists = null

  function processStringBotList(stringList) {
    return stringList
      .split('\n')
      .map(row => {
        const [ id, nickname, mark ] = row.split('|')

        return {
          id: Number(id),
          nickname: nickname === '-' ? null : nickname,
          mark
        }
      })
  }

  function fetch(type) {
    if (!http) {
      return Promise.reject("Unable to get supported cross-origin XMLHttpRequest function.")
    }

    return new Promise((resolve, reject) => {
      http({
        method: "GET",
        url: VK_BOT_LIST_URL + type,
        onload(response) {
          if (response.status !== 200) {
            reject()
            return;
          }

          const botList = processStringBotList(response.responseText)
          resolve(botList)
        }
      })
    })
  }

  function findBot(idOrNickname) {
    const matchId = String(idOrNickname).match(/^(id)?(\d{6,})$/)
    const id = matchId && Number(matchId[2])

    // TODO искать только по включенным в настройках
    const fullList = Object.values(botLists).flat()

    if (!id) {
      return fullList.find(bot => {
        return bot.nickname === idOrNickname
      })
    }

    return fullList.find(bot => {
      return bot.id === id
    })
  }

  async function fillLists() {
    const savedBotLists = await idbKeyval.get(IDB_KEY) || {}
    const configData = config.getConfig();

    const newBotLists = {}
    const requests = []
    for (const type in configData.typesInfo) {
      const savedBotListItem = savedBotLists[type] || []

      if (savedBotListItem.length === configData.typesInfo[type].count) {
        newBotLists[type] = savedBotListItem
        continue;
      }

      // TODO запрашивать только те типы, которые включены в настройках
      requests.push(
        fetch(type)
          .then((fetchedBotList) => {
            newBotLists[type] = fetchedBotList
          })
          .catch(() => {
            newBotLists[type] = savedBotListItem
          })
      )
    }

    await Promise.all(requests)

    await idbKeyval.set(IDB_KEY, newBotLists)
    botLists = newBotLists
  }

  return {
    fillLists,
    findBot
  }
}

function configFactory() {
  let config = {
    typesInfo: {},
    marksInfo: {},
  }

  function processStringConfig(stringConfig) {
    return stringConfig
      .split('\n\n')
      .reduce((acc, stringBlock) => {
        const matchResult = stringBlock.match(/^\[(.+?)\]\n(.+)/s)
        const blockTitle = matchResult?.[1]
        const blockBody = matchResult?.[2]

        if (blockTitle === 'types') {
          const rows = blockBody.split('\n')
          return {
            ...acc,
            typesInfo: rows.reduce((rowsAcc, row) => {
              const [type, label, count] = row.split('|')

              // TODO УДАЛИТЬ временное решение пока приходят "..."
              if (isNaN(type)) {
                return rowsAcc
              }

              return {
                ...rowsAcc,
                [type]: {
                  label,
                  count: Number(count)
                }
              }
            }, {})
          }
        }

        if (blockTitle === 'mark') {
          const rows = blockBody.split('\n')
          return {
            ...acc,
            marksInfo: rows.reduce((rowsAcc, row) => {
              const [mark, label, color] = row.split('|')

              // TODO УДАЛИТЬ временное решение пока приходят "..."
              if (mark === '...') {
                return rowsAcc
              }

              return {
                ...rowsAcc,
                [mark]: {
                  label,
                  color
                }
              }
            }, {})
          }
        }

        return acc
      }, {
        typesInfo: {},
        marksInfo: {},
      })
  }

  function fetch() {
    if (!http) {
      return Promise.reject("Unable to get supported cross-origin XMLHttpRequest function.")
    }

    return new Promise((resolve) => {
      http({
        method: "GET",
        url: CONFIG_URL,
        async onload(response) {
          config = processStringConfig(response.responseText)
          resolve()
        }
      })
    })
  }

  function getConfig() {
    return config
  }

  return {
    fetch,
    getConfig
  }
}

function elementsFinderFactory() {
  let mapSelectorHandlers = {}
  let alreadyFoundElements = []

  setInterval(() => {
    Object.entries(mapSelectorHandlers).forEach(([selector, handlers]) => {
      const newFoundElements = [...document.querySelectorAll(selector)]
        .filter(element => !alreadyFoundElements.includes(element))

      newFoundElements.forEach(element => {
        handlers.forEach(handler => {
          handler(element)
        })
      })

      alreadyFoundElements = [
        ...alreadyFoundElements,
        ...newFoundElements
      ]
    })
  }, 300)

  function on(selector, foundHandler) {
    if (!mapSelectorHandlers[selector]) {
      mapSelectorHandlers[selector] = []
    }

    mapSelectorHandlers[selector].push(foundHandler)
  }

  return {
    on
  }
}

function copyCheckLayout(userID, postID, el) {
  const text = prompt('Описание поведения')

  if (!text) {
    return
  }

  GM_setClipboard("https://vk.com/id" + userID + "\r\r" + text + "\rhttps://vk.com/feed?w=wall" + postID)
  const currentText = el.innerText
  el.innerText = 'Скопировано'

  setTimeout(() => {
    el.innerText = currentText
  }, 1500)
}