import { IBotList } from '@/interfaces'
import utils from '@/utils'

export default function onReplyFound(replyEl: HTMLElement, botList: IBotList) : void {
  const authorEl = replyEl.querySelector('a.author')

  if (!authorEl) {
    return
  }

  const userID = authorEl.getAttribute('data-from-id')
  const bot = botList.findBot(userID)

  if (!bot) {
    return
  }

  const replyContentEl = replyEl.querySelector<HTMLElement>('.reply_content')
  const replyAuthorEl = replyEl.querySelector<HTMLElement>('.reply_author')

  replyContentEl.style.background = bot.background
  replyContentEl.style.borderLeft = '3px solid rgba(255,50,50,0.3)'
  replyContentEl.style.paddingLeft = '3px'

  const marksEl = utils.createLayoutFromString('<div class="vk-bot-marks" style="display: inline-block;"></div>')
  authorEl.after(marksEl)
  bot.marks
    .map((mark, i) => utils.createLayoutFromString(`
      <i>
        ${i === 0 ? '(' : ''}
        ${mark.name}
        ${(i === bot.marks.length - 1) ? ')' : ', '}
      </i>
    `))
    .forEach((markEl) => marksEl.appendChild(markEl))

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
    `),
  )
}
