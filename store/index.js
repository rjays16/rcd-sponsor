export const state = () => ({
    navbarTitle: "Sponsors",
    navbarSubpageTitle: "",
    navbarIcon: "",
    simpleDashView: true,
})


export const mutations = {
    SET_NAVBAR_TITLE(state, data) {
        state.navbarTitle = data;
    },
    SET_NAVBAR_SUBPAGE_TITLE(state, data) {
        state.navbarSubpageTitle = data;
    },    
    SET_NAVBAR_ICON(state, data) {
        state.navbarIcon = data;
    },
}