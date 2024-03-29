import { IBotList } from '@/interfaces'
import utils from '@/utils'
import commonActionsTemplate from 'raw-loader!@/layouts/commonActions.html'
import commonMarksContainer from 'raw-loader!@/layouts/commonMarksContainer.html'

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

  const marksEl = utils.createLayoutFromString(commonMarksContainer)
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
    utils.createLayoutFromString(commonActionsTemplate, { userID }),
  )
}
