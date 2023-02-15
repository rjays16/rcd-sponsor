<template>
	<div class="content-header" id="visitors">
		<div class="container-fluid">
			<div class="container-fluid py-2">
				<div class="row">
					<div class="col-12 pl-0">
						<button class="btn btn-blue btn-export border" @click="exportLogs">
							Export Logs
						</button>
					</div>
				</div>
			</div>
		</div>
		<div class="container-fluid">
			<div class="container-fluid mt-2 bg-white corner-rounded p-3">
				<div class="row filters my-3">
                    <div class="col-4">
                        <el-input v-model="searchTerm" placeholder="Search..." @input="search" suffix-icon="el-icon-search" clearable />
                    </div>
                </div>
				<div class="row">
					<b-table
						hover 
						:items="visitors"
						:fields="fields"
						:per-page="perPage"
						:current-page="currentPage"
						:filter="logCriteria"
						:responsive="true"
						:busy="isBusy"
						class="m-2"
						:show-empty="rows == 0"
						@filtered="onFiltered">
						<template slot="table-busy">
							<div class="text-center text-success my-2">
								<b-spinner class="align-middle"></b-spinner>
								<strong>Loading...</strong>
							</div>
						</template>
						<template v-slot:cell(created_at)="row">
							{{ new Date(row.item.created_at) | moment("MMMM D, YYYY") }}
						</template>
						<template #empty>
							<div class="text-center">
								No visitors found.
							</div>
						</template>
					</b-table>
					<div class="w-100 m-2" v-if="rows > 0">  
						<b-pagination
							v-model="currentPage"
							:total-rows="rows"
							:per-page="perPage"
							class="float-right green-pagination"
							prev-text="Previous"
							next-text="Next"
							first-number
							last-number
						></b-pagination>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from "vuex"
import { disableButton } from "~/components/Helper/functions.js"
export default {
	middleware: "auth",
	data() {
		return {
			searchTerm: null,
			
			fields: [
				{ key: 'user.first_name', label: 'First Name', tdClass: "align-middle", sortable: true },
				{ key: 'user.last_name', label: 'Last Name', tdClass: "align-middle", sortable: true },
                { key: 'created_at', label: 'Date Visited', tdClass: "align-middle", sortable: true },
			],
			
			rows: 0,
			currentPage: 1,
			perPage: 10,
			logCriteria: '',
            visitorFilterTimeout: null,
			isBusy: true,
		}
	},
	computed: {
		...mapGetters({
            visitors: 'visitors/getVisitors',
			user: 'auth/user',
        }),
	},
	methods: {
        setNavbarTitle(title) {
            this.$store.commit('SET_NAVBAR_TITLE', title)
        },
		setNavbarIcon(icon) {
            this.$store.commit('SET_NAVBAR_ICON', icon)
        },
		setNavbarSubpageTitle(subtitle) {
            this.$store.commit('SET_NAVBAR_SUBPAGE_TITLE', subtitle)
        },
		search() {
            this.isBusy = true
            clearTimeout(this.visitorFilterTimeout)
            this.visitorFilterTimeout = setTimeout(() => {
                this.logCriteria = this.searchTerm
                this.isBusy = false
            }, 300)
        },
		onFiltered(filtered_items) {
			this.rows = filtered_items.length
        	this.currentPage = 1
		},
		getVisitors() {
			this.$store.dispatch("visitors/getVisitors", this.user.sponsor.id)
			.then(res => {
				this.rows = this.visitors.length
				this.isBusy = false
			})
			.catch(err => {
				this.$message.error(err)
				this.isBusy = false
			})
		},
		exportLogs() {
            disableButton('.btn-export', true)
			this.$store.dispatch("visitors/export", this.user.sponsor.id)
			.then(res => {
				const url = URL.createObjectURL(new Blob([res.data]))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', "visitors.xlsx")
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
				disableButton('.btn-export', false)
			})
			.catch(err => {
				this.$message.error('Could not export the file. Please contact the site admin.')
				disableButton('.btn-export', false)
			})
        }
	},
    async fetch() {
		this.setNavbarTitle('Visitors')
		this.setNavbarSubpageTitle('')
		this.setNavbarIcon('')

		setTimeout(() => {
			this.getVisitors()
		}, 1000);
    } 
}
</script>