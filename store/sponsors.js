export const state = () => ({
	sponsors: [],

	platinum_type: 1,
	gold_type: 2,
	silver_type: 3,
	bronze_type: 4
});

export const actions = {
	getSponsor({}, id) {
		return new Promise((resolve, reject) => {
			this.$axios.get(`/${id}/information`)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
		})
	},
	update({}, data) {
		return new Promise((resolve, reject) => {
			this.$axios.post(`/${data.get('id')}/information`, data)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err.response.data.message)
			})
		})
	},
	getDataAnalytics({}, id) {
		return new Promise((resolve, reject) => {
			this.$axios.get(`/${id}/analytics`)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err.response.data.message)
			})
		})
	},
	exportDataAnalytics({}, id) {
        return new Promise((resolve, reject) =>{
            this.$axios.get(`/${id}/analytics/export`, {
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