import { IBotList } from '@/interfaces'
import utils from '@/utils'

export default function onPostFound(postEl: HTMLElement, botList: IBotList): void {
  const userID = postEl.querySelector('a.author').getAttribute('data-from-id')

  if (!userID) {
    return
  }

  const bot = botList.findBot(userID)

  if (!bot) {
    return
  }

  const postHeaderEl = postEl.querySelector<HTMLElement>('.post_header')
  const postAuthorEl = postEl.querySelector<HTMLElement>('.post_author')

  postHeaderEl.style.background = bot.background
  postHeaderEl.style.borderLeft = '3px solid rgba(255,50,50,0.3)'
  postHeaderEl.style.paddingLeft = '3px'

  const authorEl = postEl.querySelector<HTMLElement>('.author')
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
    `),
  )
}
