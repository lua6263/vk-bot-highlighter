export default function onLikeFound(likeEl, botList) {
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