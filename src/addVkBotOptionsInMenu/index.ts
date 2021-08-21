import utils from '@/utils'
import menuItemTemplate from 'raw-loader!./menuItem.template.html'
import modalTemplate from 'raw-loader!./settingsModal.template.html'
import openSettings from './openSettings'

export default function addVkBotOptionsInMenu() : void {
  const existingMenuItems = [...document.querySelectorAll('.top_profile_mrow')]
  const lastExistingMenuItem = existingMenuItems[existingMenuItems.length - 2]

  document.body.appendChild(
    utils.createLayoutFromString(modalTemplate),
  )

  lastExistingMenuItem.after(
    utils.createLayoutFromString(menuItemTemplate, {
      callOnClick: 'openVkBotsSettings',
    }),
  )

  utils.unsafeWindow.openVkBotsSettings = () => openSettings()
}
