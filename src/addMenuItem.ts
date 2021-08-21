import utils from './utils'

export default function addMenuItem() : void {
  const existingMenuItems = [...document.querySelectorAll('.top_profile_mrow')]
  const lastExistingMenuItem = existingMenuItems[existingMenuItems.length - 2]

  lastExistingMenuItem.after(utils.createLayoutFromString(`
        <a
            class="top_profile_mrow"
            onclick="alert('HUY')"
        >
            VK боты
        </a>
  `))
}
