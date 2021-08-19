// ==UserScript==
// @name         VK antibot
// @namespace    vk-metabot-user-js
// @description  Борьба с ботами вконтакте.
// @version      0.0.1
// @include      https://*vk.com/*
// @connect      api.gosvon.net
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM.xmlHttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// ==/UserScript==

const VK_BOT_LIST_URL = 'http://api.gosvon.net/marking3/list'
const CONFIG_URL = 'http://api.gosvon.net/marking3/main2'

const http = GM_xmlhttpRequest || (GM && GM.xmlHttpRequest)
unsafeWindow.copyCheckLayout = copyCheckLayout

const utils = {
  allParents(element) {
    const parents = [element]
    while (parents[parents.length - 1].parentElement) {
      parents.push(parents[parents.length - 1].parentElement)
    }
    return parents.slice(1)
  },

  createLayoutFromString(string) {
    const div = document.createElement('div')
    div.innerHTML = string

    return div.children[0]
  }
}

const config = configFactory()
const botList = botListsFactory()

async function start() {
  await config.fetchConfig()
  await botList.fillLists()

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
  const bot = botList.findBot(userID)

  const replyContentEl = replyEl.querySelector('.reply_content')
  const replyAuthorEl = replyEl.querySelector('.reply_author')

  if (!bot) {
    const post = utils.allParents(replyEl).find(el => el.classList.contains('post') || el.classList.contains('wl_post'))
    const postID = post ? post.getAttribute('data-post-id') : null

    replyAuthorEl.append(
      utils.createLayoutFromString(`
        <i>
          <a onclick="copyCheckLayout(${userID}, '${postID}', this)">
            Копировать шаблон обращения
          </a>
        </i>
      `)
    )
    return
  }

  replyContentEl.style.background = bot.background
  replyContentEl.style.borderLeft = `3px solid rgba(255,50,50,0.3)`
  replyContentEl.style.paddingLeft = '3px'

  replyAuthorEl.append(
    utils.createLayoutFromString(`
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

  const bot = botList.findBot(userID)

  if (!bot) {
    return
  }

  const postHeaderEl = postEl.querySelector('.post_header')
  const postAuthorEl = postEl.querySelector('.post_author')

  postHeaderEl.style.background = bot.background
  postHeaderEl.style.borderLeft = `3px solid rgba(255,50,50,0.3)`
  postHeaderEl.style.paddingLeft = '3px'

  postAuthorEl.append(
    utils.createLayoutFromString(`
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
  const bot = botList.findBot(userID)

  if (!bot) {
    return
  }

  fanEl.style.background = bot.background
  fanEl.style.borderLeft = `3px solid rgba(255,50,50,0.3)`
  fanEl.style.paddingLeft = '3px'

  fanEl.append(
    utils.createLayoutFromString(`
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
  const bot = botList.findBot(userID)

  if (!bot) {
    return
  }

  const userAvatarEl = likeEl.querySelector('.like_tt_image')

  userAvatarEl.style.opacity = '0.5'

  likeEl.style.borderRadius = '0'
  likeEl.style.background = 'red'
}

function onProfileFound() {
  const abuseActionEl = document.querySelector('.PageActionCell[data-task-click="ProfileAction/abuse"]')

  if (!abuseActionEl) {
    return
  }

  const userID = abuseActionEl.getAttribute('data-user_id')
  const bot = botList.findBot(userID)

  if (!bot) {
    return
  }

  const pagePhotoEl = document.querySelector('.page_photo');
  pagePhotoEl.style.background = bot.background

  const pageNameEl = document.querySelector('.page_name');

  pageNameEl.insertAdjacentElement('afterend', utils.createLayoutFromString(`
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
  const bot = botList.findBot(userID)

  if (!bot) {
    return
  }

  const postHeaderEl = mobilePostEl.querySelector('.wi_head');

  postHeaderEl.style.background = bot.background
  postHeaderEl.style.borderLeft = `3px solid rgba(255,50,50,0.3)`
  postHeaderEl.style.paddingLeft = "3px"

  postHeaderEl.append(
    utils.createLayoutFromString(`
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

  const bot = botList.findBot(userID)

  if (!bot) {
    return
  }

  const ppContEl = ownerPanelEl.querySelector('.pp_cont')

  ppContEl.style.background = bot.background
  ppContEl.append(
    utils.createLayoutFromString(`
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

  const bot = botList.findBot(userID)

  if (!bot) {
    return
  }

  const replyHeaderEl = replyEl.querySelector('.ReplyItem__header')

  replyHeaderEl.style.background = bot.background
  replyHeaderEl.style.borderLeft = `3px solid rgba(255,50,50,0.3)`
  replyHeaderEl.style.paddingLeft = "3px"

  replyHeaderEl.append(
    utils.createLayoutFromString(`
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

  const bot = botList.findBot(userID)

  if (!bot) {
    return
  }

  fanEl.style.background = bot.background
  fanEl.style.borderLeft = `3px solid rgba(255,50,50,0.3)`
  fanEl.style.paddingLeft = "3px"
}

function botListsFactory() {
  let botList = []

  function processRawBotList(rawBotList) {
    return rawBotList
      .map(rawBotItem => ({
        id: Number(rawBotItem.i),
        nickname: rawBotItem.n,
        marksIds: [
          rawBotItem.t,
          ...(rawBotItem.m ? [rawBotItem.m] : [])
        ]
      }))
  }

  function fetchBotList() {
    if (!http) {
      return Promise.reject("Unable to get supported cross-origin XMLHttpRequest function.")
    }

    return new Promise((resolve, reject) => {
      http({
        method: "GET",
        url: VK_BOT_LIST_URL,
        onload(response) {
          if (response.status !== 200) {
            reject()
            return;
          }

          const botList = processRawBotList(JSON.parse(response.responseText))
          resolve(botList)
        }
      })
    })
  }

  function findBot(idOrNickname) {
    const matchId = String(idOrNickname).match(/^(id)?(\d{6,})$/)
    const id = matchId && Number(matchId[2])

    // TODO искать только по включенным в настройках
    let foundBot = null
    if (!id) {
      foundBot = botList.find(bot => {
        return bot.nickname === idOrNickname
      })
    } else {
      foundBot = botList.find(bot => {
        return bot.id === id
      })
    }

    return foundBot
  }

  async function fillLists() {
    const configData = config.getConfig();
    const localBotListVersion = GM_getValue('botHighlighterBotListVersion1') || 0

    let newBotLists = []

    if (configData.botListVersion === localBotListVersion) {
      newBotLists = JSON.parse(GM_getValue('botHighlighterSavedBotList') || '[]')
    } else {
      newBotLists = await fetchBotList()
      GM_setValue('botHighlighterSavedBotList', JSON.stringify(newBotLists))
      GM_setValue('botHighlighterBotListVersion1', configData.botListVersion)
    }

    newBotLists = newBotLists.map(bot => {
      const marks = bot.marksIds
        .map(
          botMarkItemId => configData.marks.find(
            markItem => markItem.id === botMarkItemId
          ),
        )
        .filter(Boolean)

      const background = (() => {
        if (marks.length === 1) {
          return marks[0].color
        }

        const percentShare = Math.round(100 / marks.length)
        const gradientPointsString = marks.reduce((accStr, markItem, i) => {
          let itemPercent = (i === marks.length - 1) ? 100 : percentShare * i
          return accStr + `, ${markItem.color} ${itemPercent}`
        }, '')

        const gradientAngle = {
          'vertical': '0deg',
          'horizontal': '90deg',
        }[bot.gradientDirection]

        return `linear-gradient(${gradientAngle}, ${gradientPointsString})`
      })()

      return {
        ...bot,
        marks,
        background,
      }
    })

    botList = newBotLists
  }

  return {
    fillLists,
    findBot
  }
}

function configFactory() {
  let config = {
    botListVersion: null,
    marks: [],
  }

  function processRawConfig(rawConfig) {
    const marksFromTypes = rawConfig.types.map((rawTypeItem) => ({
      id: rawTypeItem.id,
      name: rawTypeItem.name,
      color: rawTypeItem.color,
      gradientDirection: null
    }))

    const marksFromMark = rawConfig.mark.map((rawMarkItem) => ({
      id: rawMarkItem.id,
      name: rawMarkItem.name,
      color: rawMarkItem.color,
      gradientDirection: {
        d: 'vertical',
        g: 'horizontal'
      }[rawMarkItem.id.split('_')[0]] || 'vertical'
    }))

    return {
      botListVersion: rawConfig.timestamp,
      marks: [
        ...marksFromTypes,
        ...marksFromMark,
      ]
    }
  }

  function fetchConfig() {
    if (!http) {
      return Promise.reject("Unable to get supported cross-origin XMLHttpRequest function.")
    }

    return new Promise((resolve) => {
      http({
        method: "GET",
        url: CONFIG_URL,
        async onload(response) {
          config = processRawConfig(JSON.parse(response.responseText))
          resolve()
        }
      })
    })
  }

  function getConfig() {
    return config
  }

  return {
    fetchConfig,
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