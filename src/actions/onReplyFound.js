import utils from '../utils'

export default function onReplyFound(replyEl, botList) {
  const authorEl = replyEl.querySelector('a.author')

  if (!authorEl) {
    return
  }

  const userID = authorEl.getAttribute('data-from-id')
  const bot = botList.findBot(userID)

  if (!bot) {
    return
  }

  const replyContentEl = replyEl.querySelector('.reply_content')
  const replyAuthorEl = replyEl.querySelector('.reply_author')

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