import cookies from "~/node_modules/js-cookie";

export const state = () => ({
	token: null,
	role: null,
	user: {
		id: 1,
		first_name: "",
		last_name: "",
		phone: "",
		email: "",
		street: "",
		city: "",
		state: "",
		zipcode: "",
		profile_photo: require("~/static/img/blank.png"),
		sponsor: {
			id: null,
			type: 4
		}
	},
});

export const getters = {
	isLoggedIn: state => {
		return !!state.token;
	},
	user: state => {
		return state.user;
	},
	userFullname: state => {
		return state.user.first_name;
	}
};

export const mutations = {
	SET_TOKEN(state, token) {
		state.token = token;
	},
	REMOVE_TOKEN(state) {
		state.token = null;
	},
	SET_USER(state, data) {
		state.user = data;
	}
};

export const actions = {
	setToken({ commit }, { token }) {
		this.$axios.setToken(token, "Bearer");
		cookies.set("rcd-sponsor-x-access-token", token, {
			expires: new Date(new Date().getTime() + 86400 * 1000)
		});
		commit("SET_TOKEN", token);
	},
	login({ dispatch }, data) {
		return new Promise((resolve, reject) => {
			this.$axios.post("/login", data)
			.then(res => {
				let token = res.data.token;
				dispatch("setToken", { token });
				resolve(res);
			})
			.catch(err => {
				reject(err);
			});
		});
	},
	logout({ commit }) {
		return new Promise((resolve, reject) => {
			this.$axios.post("/logout")
			.then(res => {
				cookies.remove("rcd-sponsor-x-access-token");
				commit("REMOVE_TOKEN");
				this.$axios.setToken(false);
				resolve(res);
			})
			.catch(err => {
				cookies.remove("rcd-sponsor-x-access-token");
				commit("REMOVE_TOKEN");
				this.$axios.setToken(false);
				reject(err);
			});
		});
	},
	async check({ commit }, { token }) {
		this.$axios.setToken(token, "Bearer");
		const expiryTime = new Date(new Date().getTime() + 86400 * 1000);
		cookies.set("rcd-sponsor-x-access-token", token, { expires: expiryTime });
		commit("SET_TOKEN", token);
		const res = await this.$axios.get("/user");
		commit("SET_USER", res.data);
	},
	removeToken({ commit }) {
		this.$axios.setToken(false);
		cookies.remove("rcd-sponsor-x-access-token");
		commit("REMOVE_TOKEN");
	},
	sendPasswordResetRequest({}, data) {
		return new Promise((resolve, reject) => {
			this.$axios.post("/password/reset-request", data)
			.then(res => {
				resolve(res);
			})
			.catch(err => {
				reject(err.response.data.message);
			});
		});
	}
};