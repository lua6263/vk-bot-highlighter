export default function onFoundMobileFan(fanEl, botList) {
  const userID = fanEl.className.match(/_u(\d+)/)[1]

  const bot = botList.findBot(userID)

  if (!bot) {
    return
  }

  fanEl.style.background = bot.background
  fanEl.style.borderLeft = `3px solid rgba(255,50,50,0.3)`
  fanEl.style.paddingLeft = "3px"
}