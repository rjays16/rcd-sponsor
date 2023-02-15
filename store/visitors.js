export const state = () => ({
    visitors: [],
});

export const getters = {
    getVisitors: (state) => {
        return state.visitors;
    },
};

export const mutations = {
    SET_VISITORS(state, data) {
        state.visitors = data;
    },
};

export const actions = {
    getVisitors({ commit }, id) {
        return new Promise((resolve, reject) => {
            this.$axios.get(`/${id}/visit-logs`)
            .then(res => {
                resolve(res)
                commit('SET_VISITORS', res.data);
            })
            .catch(err => {
                reject(err.response.data.message)
                commit('SET_VISITORS', []);
            })
        })
    },
    getVisitorCount({}, id) {
        return new Promise((resolve, reject) => {
            this.$axios.get(`/${id}/visit-logs/count`)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err.response.data.message)
            })
        })
    },
    export({}, id) {
        return new Promise((resolve, reject) =>{
            this.$axios.get(`/${id}/visit-logs/export`, {
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