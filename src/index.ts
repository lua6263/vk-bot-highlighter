import configFactory from './configFactory'
import elementsFinderFactory from './elementsFinderFactory'
import botListsFactory from './botListsFactory'
import onReplyFound from './finderActions/onReplyFound'
import onPostFound from './finderActions/onPostFound'
import onFanFound from './finderActions/onFanFound'
import onLikeFound from './finderActions/onLikeFound'
import onProfileFound from './finderActions/onProfileFound'
import onFoundMobilePost from './finderActions/onFoundMobilePost'
import onFoundMobileProfile from './finderActions/onFoundMobileProfile'
import onFoundMobileReply from './finderActions/onFoundMobileReply'
import onFoundMobileFan from './finderActions/onFoundMobileFan'

const config = configFactory()
const botList = botListsFactory(config)

async function start() {
  await config.fetchConfig()
  await botList.fillLists()

  const finder = elementsFinderFactory(botList)

  finder.on('.reply', onReplyFound)
  finder.on('.post', onPostFound)
  finder.on('.fans_fan_row', onFanFound)
  finder.on('.like_tt_owner', onLikeFound)
  finder.on('#profile', onProfileFound)

  finder.on('.wall_item', onFoundMobilePost)
  finder.on('.owner_panel.profile_panel', onFoundMobileProfile);
  finder.on('.ReplyItem', onFoundMobileReply);
  finder.on('.pcont .inline_item', onFoundMobileFan);
}

start()
