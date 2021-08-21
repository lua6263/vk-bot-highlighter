import { IBotList } from '@/interfaces'

export default function onLikeFound(likeEl: HTMLElement, botList: IBotList) : void {
  const userID = likeEl.getAttribute('href').substr(1)
  const bot = botList.findBot(userID)

  if (!bot) {
    return
  }

  const userAvatarEl = likeEl.querySelector<HTMLElement>('.like_tt_image')

  userAvatarEl.style.opacity = '0.5'

  likeEl.style.borderRadius = '0'
  likeEl.style.background = 'red'
}
