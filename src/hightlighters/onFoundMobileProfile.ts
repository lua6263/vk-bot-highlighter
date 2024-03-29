import { IBotList } from '@/interfaces'
import utils from '@/utils'
import commonActionsTemplate from 'raw-loader!@/layouts/commonActions.html'
import commonMarksContainer from 'raw-loader!@/layouts/commonMarksContainer.html'

export default function onFoundMobileProfile(ownerPanelEl: HTMLElement, botList: IBotList) : void {
  const reportEl = document.querySelector('.ContextMenu__listItem a[href*=reports]')

  if (!reportEl) {
    return
  }

  const userID = reportEl.getAttribute('href').match(/user_id=(\d+)/)[1]

  const bot = botList.findBot(userID)

  if (!bot) {
    return
  }

  const ppContEl = ownerPanelEl.querySelector<HTMLElement>('.pp_cont')
  const opHeaderEl = ppContEl.querySelector<HTMLElement>('.op_header')
  const marksContainer = utils.createLayoutFromString(commonMarksContainer)
  opHeaderEl.after(marksContainer)

  bot.marks
    .map((mark, i) => utils.createLayoutFromString(`
      <i>
        ${i === 0 ? '(' : ''}
        ${mark.name}
        ${(i === bot.marks.length - 1) ? ')' : ', '}
      </i>
    `))
    .forEach((markEl) => marksContainer.appendChild(markEl))

  ppContEl.style.background = bot.background
  ppContEl.append(
    utils.createLayoutFromString(commonActionsTemplate, { userID }),
  )
}
