export const state = () => ({
    sessions: [],
});

export const getters = {
    getSessions: (state) => {
        return state.sessions;
    },
};

export const mutations = {
    SET_SESSIONS(state, data) {
        state.sessions = data;
    },
};

export const actions = {
    getSessions({ commit }, id) {
        return new Promise((resolve, reject) => {
            this.$axios.get(`/${id}/sessions`)
            .then(res => {
                resolve(res)
                commit('SET_SESSIONS', res.data);
            })
            .catch(err => {
                reject(err.response.data.message)
                commit('SET_SESSIONS', []);
            })
        })
    },
    getSession({}, data) {
        return new Promise((resolve, reject) => {
            this.$axios.get(`/${data["sponsor_id"]}/sessions/${data["id"]}`)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
        })
    },
};