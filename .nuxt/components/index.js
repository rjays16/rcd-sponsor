export { default as Logo } from '../..\\components\\Logo.vue'
export { default as HelperFunctions } from '../..\\components\\Helper\\functions.js'
export { default as LayoutNavbar } from '../..\\components\\Layout\\Navbar.vue'
export { default as LayoutSidebar } from '../..\\components\\Layout\\Sidebar.vue'
export { default as ModalCancelledCallModal } from '../..\\components\\Modal\\CancelledCallModal.vue'
export { default as ModalSponsorAssets } from '../..\\components\\Modal\\SponsorAssets.vue'
export { default as ModalPasswordRequestReset } from '../..\\components\\Modal\\Password\\RequestReset.vue'

// nuxt/nuxt.js#8607
function wrapFunctional(options) {
  if (!options || !options.functional) {
    return options
  }

  const propKeys = Array.isArray(options.props) ? options.props : Object.keys(options.props || {})

  return {
    render(h) {
      const attrs = {}
      const props = {}

      for (const key in this.$attrs) {
        if (propKeys.includes(key)) {
          props[key] = this.$attrs[key]
        } else {
          attrs[key] = this.$attrs[key]
        }
      }

      return h(options, {
        on: this.$listeners,
        attrs,
        props,
        scopedSlots: this.$scopedSlots,
      }, this.$slots.default)
    }
  }
}
