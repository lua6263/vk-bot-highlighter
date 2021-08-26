import { IConfig, IUserSettings } from '@/interfaces'
import utils from '@/utils'
import menuItemTemplate from 'raw-loader!./menuItem.template.html'
import modalTemplate from 'raw-loader!./settingsModal.template.html'

export default function addVkBotOptionsInMenu(config: IConfig, userSettings: IUserSettings) : void {
  const existingMenuItems = [...document.querySelectorAll('.top_profile_mrow')]
  const lastExistingMenuItem = existingMenuItems[existingMenuItems.length - 2]

  utils.unsafeWindow.vkBotMarks = config.getConfig().marks

  document.body.appendChild(
    utils.createLayoutFromString(modalTemplate, {
      checkboxes: config.getConfig().marks.reduce((acc, mark) => {
        const isEnabled = !userSettings.checkIsMarkDisabled(mark.id)

        return `
            ${acc}

            <div
              class="checkbox ${isEnabled ? 'on' : ''}"
              onclick="
                checkbox(this);
                changeVkBotMarkEnabledState('${mark.id}', isChecked(this))
              "
              role="checkbox"
              ${isEnabled ? 'aria-checked="true"' : ''}
              tabindex="0"
              style="
                margin-bottom: 10px;
              "
          >
              <div class="vk_checkbox_caption">
                  ${mark.name}
              </div>
          </div>
        `
      }, ''),
    }),
  )

  lastExistingMenuItem.after(
    utils.createLayoutFromString(menuItemTemplate, {
      callOnClick: 'openVkBotsSettings',
    }),
  )

  utils.unsafeWindow.openVkBotsSettings = () => {
    document.querySelector<HTMLElement>('.VkBotsSettingsModal').style.display = 'block'
  }

  utils.unsafeWindow.changeVkBotMarkEnabledState = (markId: string, isEnabledRaw: '' | 1) => {
    const isEnabled = Boolean(isEnabledRaw)

    if (isEnabled) {
      userSettings.enableMark(markId)
    } else {
      userSettings.disableMark(markId)
    }
  }

  utils.unsafeWindow.closeVkBotSettings = () => {
    document.querySelector<HTMLElement>('.VkBotsSettingsModal').style.display = 'none'
  }
}
