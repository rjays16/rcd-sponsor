<template>
  <div class="wrapper">
    <LayoutNavbar />
    <LayoutSidebar />

    <div class="content-wrapper">
      <Nuxt />
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      bodyAttrs: {
        class: "hold-transition layout-fixed layout-navbar-fixed"
      }
    };
  }
};
</script>