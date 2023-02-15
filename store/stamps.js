export const state = () => ({
    stamps: [],
});

export const getters = {
    getStamps: (state) => {
        return state.stamps;
    },
};

export const mutations = {
    SET_STAMPS(state, data) {
        state.stamps = data;
    },
};

export const actions = {
    getStamps({ commit }, id) {
        return new Promise((resolve, reject) => {
            this.$axios.get(`/${id}/stamps`)
            .then(res => {
                resolve(res)
                commit('SET_STAMPS', res.data);
            })
            .catch(err => {
                reject(err.response.data.message)
                commit('SET_STAMPS', []);
            })
        })
    },
    export({}, id) {
        return new Promise((resolve, reject) =>{
            this.$axios.get(`/${id}/stamps/export`, {
                responseType: 'blob'
            })
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
        })
    },
};