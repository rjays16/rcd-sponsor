<template>
  <section>
    <div class="container mb-3 mt-3" v-loading="is_loading">
      <div class="row mb-3">
        <div class="col-lg-12 mb-3">
          <h4 class="avenir-regular d-inline-block mb-0 font-weight-bold">VEX Booth: {{ fullname }}</h4>
          <button class="btn btn-blue btn-export-chat text-uppercase float-right" @click="exportData">
            Export All Data
          </button>
        </div>
        <div class="col-lg-4 mb-3">
          <div class="bg-white corner-rounded p-3 text-center">
            <b class="avenir-regular">{{ form.total_vex_booth_visits }}</b>
            <p class="avenir-regular mb-1">Total VEX Booth Visits</p>
          </div>
        </div>
        <div class="col-lg-4 mb-3">
          <div class="bg-white corner-rounded p-3 text-center">
            <b class="avenir-regular">{{ form.total_delegate_collected_virtual_stamps }}</b>
            <p class="avenir-regular mb-1">Delegates Collected Virtual Stamps</p>
          </div>
        </div>
        <div class="col-lg-4 mb-3">
          <div class="bg-white corner-rounded p-3 text-center">
            <b class="avenir-regular">{{ form.total_started_chat }}</b>
            <p class="avenir-regular mb-1">Delegate Started a Chat</p>
          </div>
        </div>
        <div class="col-lg-4 mb-3">
          <div class="bg-white corner-rounded p-3 text-center">
            <b class="avenir-regular">{{ form.total_view_tour}}</b>
            <p class="avenir-regular mb-1">View on 360° Tour</p>
          </div>
        </div>
        <div class="col-lg-4 mb-3">
          <div class="bg-white corner-rounded p-3 text-center">
            <b class="avenir-regular">{{ form.total_view_company_profile }}</b>
            <p class="avenir-regular mb-1">Views on Company Profile</p>
          </div>
        </div>
        <div class="col-lg-4 mb-3">
          <div class="bg-white corner-rounded p-3 text-center">
            <b class="avenir-regular">{{ form.total_catalog }}</b>
            <p class="avenir-regular mb-1">Views on Catalog</p>
          </div>
        </div>
        <div class="col-lg-4 mb-3">
          <div class="bg-white corner-rounded p-3 text-center">
            <b class="avenir-regular">{{ form.total_clicks_brochures }}</b>
            <p class="avenir-regular mb-1">Total Clicks on Brochures</p>
          </div>
        </div>
        <div class="col-lg-4 mb-3">
          <div class="bg-white corner-rounded p-3 text-center">
            <b class="avenir-regular">{{ form.total_views_videos }}</b>
            <p class="avenir-regular mb-1">Total Views on Videos</p>
          </div>
        </div>
      </div>
    </div>
    <div class="container mb-3" v-loading="is_loading">
      <div class="row">
        <div class="col-lg-12 mb-2">
          <h4 class="avenir-regular font-weight-bold">Booth Resources</h4>
        </div>
        <div class="col-lg-4">
          <div class="bg-white corner-rounded p-3">
            <h4 class="avenir-regular mb-4">Brochures</h4>
            <div>
              <b-table class="text-center avenir-regular table"
                       hover
                       :items="brochure_items"
                       :fields="brochure_fields">
                <template v-slot:cell(link)="row">
                  <a class="link-label" :href="row.item.url">Brochure No. {{ row.item.id }}</a>
                </template>
              </b-table>
            </div>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="bg-white corner-rounded p-3">
            <h4 class="avenir-regular mb-4">Videos</h4>
            <div>
              <b-table class="text-center avenir-regular table"
                       hover
                       :items="video_items"
                       :fields="video_fields">
                <template v-slot:cell(link)="row">
                  <a class="link-label" :href="row.item.url">Video No. {{ row.item.id }}</a>
                </template>
              </b-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex"
import { disableButton } from "~/components/Helper/functions.js"
export default {
  name: "dashboard",
  data() {
    return {
      form: {
        sponsor_id: null,
        total_vex_booth_visits: null,
        total_delegate_collected_virtual_stamps: null,
        total_started_chat: null,
        total_view_tour: null,
        total_view_company_profile: null,
        total_catalog: null,
        total_clicks_brochures: null,
        total_views_videos: null,
      },

      brochure_fields: [
        { key: 'id', label: 'No',  sortable: false},
        { key: 'link', label: 'Name', sortable: true },
        { key: 'analytic_stats', label: 'Clicks', sortable: true, }
      ],
      brochure_items: [],

      video_fields: [
        { key: 'id', label: 'No', sortable: false },
        { key: 'link', label: 'Name', sortable: true },
        { key: 'analytic_stats', label: 'Views', sortable: true, }
      ],
      video_items: [],

      is_loading: true,
    }
  },
  computed: {
    ...mapGetters({
      fullname: 'auth/userFullname',
      user: 'auth/user',
    }),
  },
  methods: {
    getDataAnlytics() {
      this.$store.dispatch("sponsors/getDataAnalytics", this.user.sponsor.id)
        .then(res => {
          this.form.total_vex_booth_visits = res.data.total_visits
          this.form.total_delegate_collected_virtual_stamps = res.data.total_stamps
          this.form.total_started_chat = res.data.total_chatters
          this.form.total_view_tour = res.data.total_360_views
          this.form.total_view_company_profile = res.data.total_company_profile_views
          this.form.total_catalog = res.data.total_product_catalog_views
          this.form.total_clicks_brochures = res.data.total_brochures_views
          this.form.total_views_videos = res.data.total_video_views
          this.brochure_items = res.data.brochures
          this.video_items = res.data.videos

          this.is_loading = false
        })
        .catch(err => {
          this.$message.error(err)
          this.is_loading = false
        })
    },
    setNavbarTitle(title) {
      this.$store.commit('SET_NAVBAR_TITLE', title)
    },
    setNavbarIcon(icon) {
      this.$store.commit('SET_NAVBAR_ICON', icon)
    },
    setNavbarSubpageTitle(subtitle) {
      this.$store.commit('SET_NAVBAR_SUBPAGE_TITLE', subtitle)
    },
    exportData() {
      disableButton('.btn-export', true)
      this.$store.dispatch("sponsors/exportDataAnalytics", this.user.sponsor.id)
        .then(res => {
          // console.log(res.data)
          const url = URL.createObjectURL(new Blob([res.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', "analytics_report.xlsx")
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
    this.setNavbarTitle('Dashboard')
    this.setNavbarSubpageTitle('')
    this.setNavbarIcon('')

    setTimeout(() => {
      this.getDataAnlytics()
    }, 2000);
  }
}
</script>

<style scoped>
.corner-rounded h4 {
  color: grey;
}
.table {
  font-weight: bold;
}
@media screen and (max-width: 762px) {
  .col-lg-4 {
    padding-top: 2%;
  }
}
</style>
