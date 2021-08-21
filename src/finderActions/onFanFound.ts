import { IBotList } from '@/interfaces'
import utils from '../utils'

export default function onFanFound(fanEl: HTMLElement, botList: IBotList) : void {
  const userID = fanEl.getAttribute('data-id')
  const bot = botList.findBot(userID)

  if (!bot) {
    return
  }

  fanEl.style.background = bot.background
  fanEl.style.borderLeft = '3px solid rgba(255,50,50,0.3)'
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
    `),
  )
}
