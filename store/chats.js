export const state = () => ({
    messages: [],
    attendees: [],
    searchAttendees: []
});

export const getters = {
    getMessages: (state) => {
        return state.messages;
    },
    getAttendees: (state) => {
        return state.attendees;
    },
    getSearchAttendees: (state) => {
        return state.searchAttendees;
    },
};

export const mutations = {
    SET_MESSAGES(state, data) {
        state.messages = data;
    },
    SET_ATTENDEES(state, data) {
        state.attendees = data;
    },
    SET_SEARCH_ATTENDEES(state, data) {
        state.searchAttendees = data;
    },
};

export const actions = {
    getAttendees({ commit }) {
        return new Promise((resolve, reject) => {
            this.$axios.get('chat/attendees')
            .then(res => {
                // commit('SET_ATTENDEES', res.data);
                resolve(res)
            })
            .catch(err => {
                reject(err.response.data.message)
            })
        })
    },
    getSearchAttendees({ commit }, data) {
        return new Promise((resolve, reject) => {
            this.$axios.get('chat/attendees', {params: data})
            .then(res => {
                // commit('SET_SEARCH_ATTENDEES', res.data)
                resolve(res)
            })
            .catch(err => {
                commit('SET_SEARCH_ATTENDEES', []);
                reject(err.response.data.message)
            })
        })
    },
    getMessages({commit}, data) {
        return new Promise((resolve, reject) => {
            this.$axios.get('chat/attendee-sponsor', {params: {'user_id': data.attendee_id}})
            .then(res => {
                commit('SET_MESSAGES', res.data);
            })
            .catch(err => {
                commit('SET_MESSAGES', []);
                reject(err.response.data.message)
            })
        })
    },
    sendMessage({}, data){
        return new Promise((resolve, reject) => {
            this.$axios.post('chat/send-message', {'receiver_id':data.receiver_id, 'message':data.message})
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
            this.$axios.get(`/${id}/chat/export`, {
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
    exportVisitorsOnly({}, id) {
        return new Promise((resolve, reject) =>{
            this.$axios.get(`/${id}/chat/export/visitors-only`, {
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