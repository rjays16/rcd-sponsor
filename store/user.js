export const state = () => ({
    user: [],
});

export const getters = {
    getUser: (state) => {
        return state.user;
    },
};

export const mutations = {
    SET_USER(state, data) {
        state.user = data;
    },
};

export const actions = {
    getUser({ commit }) {
        return new Promise((resolve, reject) => {
            this.$axios.get('/user')
            .then(res => {
                resolve(res)
                commit('SET_USER', res.data);
            })
            .catch(err => {
                reject(err.response.data.message)
            })
        })
    },
};