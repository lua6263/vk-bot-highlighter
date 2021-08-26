import { IBotList } from '@/interfaces'
import utils from '@/utils'
import commonActionsTemplate from 'raw-loader!@/layouts/commonActions.html'

export default function onFoundMobileReply(replyEl: HTMLElement, botList: IBotList) : void {
  const replyUserNameEl = replyEl.querySelector('.ReplyItem__name')

  if (!replyUserNameEl) {
    return
  }

  const userID = replyUserNameEl.getAttribute('href').substr(1)
  const bot = botList.findBot(userID)

  if (!bot) {
    return
  }

  const marksEl = utils.createLayoutFromString(`
    <div
      class="vk-bot-marks"
      style="
        display: inline-block;
        font-size: 12px;
      "></div>
  `)
  replyUserNameEl.after(marksEl)
  bot.marks
    .map((mark, i) => utils.createLayoutFromString(`
      <i>
        ${i === 0 ? '(' : ''}
        ${mark.name}
        ${(i === bot.marks.length - 1) ? ')' : ', '}
      </i>
    `))
    .forEach((markEl) => marksEl.appendChild(markEl))

  const replyHeaderEl = replyEl.querySelector<HTMLElement>('.ReplyItem__header')

  replyHeaderEl.style.background = bot.background
  replyHeaderEl.style.borderLeft = '3px solid rgba(255,50,50,0.3)'
  replyHeaderEl.style.paddingLeft = '3px'

  replyHeaderEl.append(
    utils.createLayoutFromString(commonActionsTemplate, { userID }),
  )
}
