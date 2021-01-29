// ==UserScript==
// @name         VK antibot
// @namespace    vk-metabot-user-js
// @description  Борьба с ботами вконтакте.
// @version      0.0.1
// @include      https://*vk.com/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM.xmlHttpRequest
// @run-at       document-start
// ==/UserScript==

const VK_BOT_LIST_URL = 'http://api.gosvon.net/marking2'
const MAP_COLOR_BY_CODE = {
  '1': 'rgba(255,50,50,0.4)',
  '8': 'rgba(255,50,50,0.3)',
  '12': 'rgba(255,90,0,0.4)',
  '13': 'rgba(255,50,50,0.3)',
}

unsafeWindow.copyCheckLayout = copyCheckLayout
const botList = botListFactory()

async function start() {
  await botList.fetch()

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

  const bot = botList.findBot(userID)

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
  const bot = botList.findBot(userID)

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
  const abuseActionEl = document.querySelector('.page_actions_item.PageActionItem--abuse')

  if (!abuseActionEl) {
    return
  }

  const userID = abuseActionEl.getAttribute('onclick').match(/\d+/)[0]
  const bot = botList.findBot(userID)

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
  const bot = botList.findBot(userID)

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

  const bot = botList.findBot(userID)

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

  const bot = botList.findBot(userID)

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

  const bot = botList.findBot(userID)

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

function botListFactory() {
  let botsArray = []

  function processStringBotList(stringList) {
    return stringList
      .split('\n')
      .map(row => {
        const [ id, nickname, code ] = row.split('|')

        return {
          id: Number(id),
          nickname: nickname === '-' ? null : nickname,
          code
        }
      })
  }

  function fetch() {
    const http = GM_xmlhttpRequest || (GM && GM.xmlHttpRequest)

    if (!http) {
      return Promise.reject("Unable to get supported cross-origin XMLHttpRequest function.")
    }

    return new Promise((resolve) => {
      http({
        method: "GET",
        url: VK_BOT_LIST_URL,
        onload(response) {
          botsArray = processStringBotList(response.responseText)
          resolve()
        }
      })
    })
  }

  function findBot(idOrNickname) {
    const matchId = String(idOrNickname).match(/^(id)?(\d{6,})$/)
    const id = matchId && Number(matchId[2])

    if (!id) {
      return botsArray.find(bot => {
        return bot.nickname === idOrNickname
      })
    }

    return botsArray.find(bot => {
      return bot.id === id
    })
  }

  return {
    fetch,
    findBot
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