<template>
  <div class="content-header" id="booth-information">
    <div class="container-fluid">
      <div class="container-fluid mt-2 main">
        <div class="row justify-content-center">
          <div class="col-lg-8 col-md-12">
            <div class="bg-white corner-rounded p-3">
              <div class="mb-3">
                <label>Name</label>
                <el-input placeholder="Name" v-model="$v.form.name.$model" />
                <div v-if="$v.form.name.$dirty">
                  <div class="note color-FF2C2C" v-if="!$v.form.name.required">
                    Required Field
                  </div>
                  <div class="note color-FF2C2C" v-if="!$v.form.name.maxLength">
                    Max of {{ $v.form.name.$params.maxLength.max }} characters.
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label>Email</label>
                <el-input placeholder="Email" v-model="$v.form.email.$model" />
                <div v-if="$v.form.email.$dirty">
                  <div class="note color-FF2C2C" v-if="!$v.form.email.required">
                    Required Field
                  </div>
                  <div class="note color-FF2C2C" v-if="!$v.form.email.maxLength">
                    Max of {{ $v.form.email.$params.maxLength.max }} characters.
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label>Phone</label>
                <VueTelInput
                  v-model="$v.form.phone.$model"
                  :required="true"
                  :autofocus="false"
                  :validCharactersOnly="true"
                  :disabledFetchingCountry="true"
                  class="el-phone w-100"
                  placeholder="Phone"
                  defaultCountry="PH" />
                <div v-if="$v.form.phone.$dirty">
                  <div class="note color-FF2C2C" v-if="!$v.form.phone.maxLength">
                    Max of {{ $v.form.phone.$params.maxLength.max }} characters.
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label>Address</label>
                <el-input type="textarea" v-model="form.address" :rows="8" :maxlength="500" show-word-limit />
              </div>

              <div class="mb-3">
                <label>Description</label>
                <vue-editor v-model="$v.form.description.$model" class="description-editor" />
                <div v-if="$v.form.description.$dirty">
                  <div class="note color-FF2C2C" v-if="!$v.form.description.maxLength">Max of {{ $v.form.description.$params.maxLength.max }} characters.</div>
                </div>
              </div>

              <div class="mb-3">
                <label>Logo</label>
                <div class="image-upload regular">
                  <img v-if="logo_img_url || form.logo" :src="logo_img_url || form.logo" class="avatar" />
                  <i v-else class="far fa-image"></i>
                  <el-upload class="avatar-uploader" action="/" accept="image/png, image/jpeg, image/jpg" :auto-upload="false" :show-file-list="false" :on-change="onChangeLogo"> 
                    <div class="choose-blue-bar text-left py-2 px-3">
                      <button class="btn btn-white regular">
                        Choose File
                      </button>
                      <span v-if="form.logo">{{ form.logo.name }}</span>
                      <span v-else>No file chosen</span>
                    </div>
                  </el-upload>

                  <div v-if="form.logo" class="text-left mt-3">
                    <button class="btn btn-red" @click="deleteLogo()">
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              <!-- <div class="mb-3">
                <label>Interactive Profile</label>
                <el-input type="textarea" v-model="form.interactive_profile" :rows="4" :maxlength="500" show-word-limit />
              </div> -->

              <div class="mb-3">
                <label>Website</label>
                <el-input placeholder="Website" v-model="$v.form.website.$model" />
                <div v-if="$v.form.website.$dirty">
                  <div class="note color-FF2C2C" v-if="!$v.form.website.maxLength">
                    Max of{{ $v.form.website.$params.maxLength.max }} characters.
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label>Announcement (Running Text Ad)</label>
                <el-input type="textarea" v-model="form.announcement" :rows="4" :maxlength="150" show-word-limit />
              </div>

              <div class="mb-3">
                <label>Representative's Name</label>
                <el-input placeholder="Representative's Name" v-model="$v.form.rep_name.$model" />
                <div v-if="$v.form.rep_name.$dirty">
                  <div class="note color-FF2C2C" v-if="!$v.form.rep_name.maxLength">
                    Max of{{ $v.form.rep_name.$params.maxLength.max }} characters.
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label>Representative's Phone</label>
                <el-input placeholder="Representative's Phone" v-model="$v.form.rep_phone.$model" />
                <div v-if="$v.form.rep_phone.$dirty">
                  <div class="note color-FF2C2C" v-if="!$v.form.rep_phone.maxLength">
                    Max of{{ $v.form.rep_phone.$params.maxLength.max }} characters.
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label>Representative's Landline Number</label>
                <el-input placeholder="Representative's Landline Number" v-model="$v.form.rep_landline.$model" />
                <div v-if="$v.form.rep_landline.$dirty">
                  <div class="note color-FF2C2C" v-if="!$v.form.rep_landline.maxLength">
                    Max of{{ $v.form.rep_landline.$params.maxLength.max }} characters.
                  </div>
                </div>
              </div>

              <div class="text-right mt-4">
                <button class="btn btn-blue" @click="openPreviewBoothModal()">
                  Preview
                </button>
                <button class="btn btn-green btn-save" @click="recheckInputs">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog :visible.sync="is_preview_modal_visible" :show-close="false" width="90%" title="Preview" class="preview-dialog" top="5vh">
      <div class="preview-dialog-container">
        <div :class="`booth-design-${form.booth_design_id}`" v-if="!show_360_view">
          <div class="announcement">
            <h1>{{ form.announcement ? form.announcement : "Welcome to " + form.name +" booth!" }}</h1>
          </div>
          
          <img :src="form.booth_design.photo" />

          <div class="assets vcc-banner-img">
            <div class="platinum assets" v-if="form.sponsor_type_id == platinum_type">
              <a href="#" class="product-catalog"></a>
              <a href="#" class="product-profile"></a>
              <a href="#" class="product-video product-video-1" data-class="video-1"></a>
              <a href="#" class="product-video product-video-2" data-class="video-2"></a>
              <a href="#" class="product-video product-video-3" data-class="video-3"></a>
              <a href="#" class="product-video product-video-4" data-class="video-4"></a>
              <a href="#" class="product-brochure product-brochure-1" data-class="brochure-1"></a>
              <a href="#" class="product-brochure product-brochure-2" data-class="brochure-2"></a>
              <a href="#" class="product-brochure product-brochure-3" data-class="brochure-3"></a>
              <a href="#" class="product-brochure product-brochure-4" data-class="brochure-4"></a>
              <a href="#" class="product-brochure product-brochure-5" data-class="brochure-5"></a>
              <a href="#" class="product-brochure product-brochure-6" data-class="brochure-6"></a>
              <a href="#" class="product-brochure product-brochure-7" data-class="brochure-7"></a>
              <a href="#" class="product-brochure product-brochure-8" data-class="brochure-8"></a>
            </div>

            <div class="gold assets" v-else-if="form.sponsor_type_id == gold_type">
              <a href="#" class="product-catalog"></a>
              <a href="#" class="product-profile"></a>
              <a href="#" class="product-video product-video-1" data-class="video-1"></a>
              <a href="#" class="product-video product-video-2" data-class="video-2"></a>
              <a href="#" class="product-video product-video-3" data-class="video-3"></a>
              <a href="#" class="product-brochure product-brochure-1" data-class="brochure-1"></a>
              <a href="#" class="product-brochure product-brochure-2" data-class="brochure-2"></a>
              <a href="#" class="product-brochure product-brochure-3" data-class="brochure-3"></a>
              <a href="#" class="product-brochure product-brochure-4" data-class="brochure-4"></a>
              <a href="#" class="product-brochure product-brochure-5" data-class="brochure-5"></a>
              <a href="#" class="product-brochure product-brochure-6" data-class="brochure-6"></a>
              <a href="#" class="product-brochure product-brochure-7" data-class="brochure-7"></a>
              <a href="#" class="product-brochure product-brochure-8" data-class="brochure-8"></a>
            </div>
            
            <div class="silver assets" v-else-if="form.sponsor_type_id == silver_type">
              <a href="#" class="product-catalog"></a>
              <a href="#" class="product-profile"></a>
              <a href="#" class="product-video product-video-1" data-class="video-1"></a>
              <a href="#" class="product-video product-video-2" data-class="video-2"></a>
              <a href="#" class="product-brochure product-brochure-1" data-class="brochure-1"></a>
              <a href="#" class="product-brochure product-brochure-2" data-class="brochure-2"></a>
              <a href="#" class="product-brochure product-brochure-3" data-class="brochure-3"></a>
              <a href="#" class="product-brochure product-brochure-4" data-class="brochure-4"></a>
              <a href="#" class="product-brochure product-brochure-5" data-class="brochure-5"></a>
              <a href="#" class="product-brochure product-brochure-6" data-class="brochure-6"></a>
              <a href="#" class="product-brochure product-brochure-7" data-class="brochure-7"></a>
              <a href="#" class="product-brochure product-brochure-8" data-class="brochure-8"></a>
            </div>

            <div class="bronze assets" v-else>
              <a href="#" class="product-profile"></a>
              <a href="#" class="product-brochure product-brochure-1" data-class="brochure-1"></a>
              <a href="#" class="product-brochure product-brochure-2" data-class="brochure-2"></a>
              <a href="#" class="product-brochure product-brochure-3" data-class="brochure-3"></a>
              <a href="#" class="product-brochure product-brochure-4" data-class="brochure-4"></a>
            </div>
          </div>
        </div>
        
        <div class="vcc-360-view" v-if="show_360_view" v-html="form.kuula_iframe">
        </div>

        <div class="vcc-switch-btn">
          <a class="clickable" @click="toggle360View()">
            Switch to<br>
            <span v-if="!show_360_view">360&#176; Tour View</span>
            <span v-else>3D Tour View</span>
          </a>
        </div>
      </div>

      <div class="container booth-content">
        <div class="row">
          <div class="col-md-6 color-000000 px-3">
            <img :src="form.logo ? form.logo : ''" alt="" class="sponsor-logo mt-2">
            <h1 class="text-uppercase font-weight-bolder">{{ form.name }}</h1>
            <p>{{ form.website }}</p>
            <p>{{ form.address }}</p>

            <h1 class="font-weight-bold">ABOUT US</h1>
            <p class="color-000000 word-break break-word" v-html="form.description"></p>
          </div>
          <div class="col-md-6 px-3">
            <ModalSponsorAssets :brochures="brochures" :videos="videos" :product_catalog="product_catalog" :interactive_profile="interactive_profile" />
            <div class="contacts color-000000">
              <h1 class="font-weight-bold">CONTACT OUR REPRESENTATIVE</h1>
              <p>{{ form.email }}</p>
              <p>Mobile: {{ form.rep_phone ? form.rep_phone : ''}}</p>
              <p>Landline: {{ form.rep_landline ? form.rep_landline : '' }}</p>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <button type="button" class="btn btn-secondary" @click="is_preview_modal_visible = false">Cancel</button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { required, maxLength } from "vuelidate/lib/validators";
import { createFormData, disableButton } from "~/components/Helper/functions.js";
import { VueTelInput } from "vue-tel-input";
export default {
  middleware: "auth",
  components: { VueTelInput },
  data() {
    return {
      form: {
        name: null,
        email: null,
        phone: null,
        address: null,
        description: null,
        type: null,
        logo: null,
        interactive_profile: null,
        main_banner: null,
        website: null,
        announcement: null,
        rep_name: null,
        rep_phone: null,
        rep_landline: null,
        slug: null,

        booth_design_id: 2,
        booth_design: {
          photo: null,
        },
      },
      previewImage: "1",

      logo_img_url: "",
      logo_img_url_change: false,
      logo_img_url_deleted: false,

      interactive_profile_img_url: "",
      interactive_profile_img_url_change: false,
      interactive_profile_img_url_deleted: false,

      image_types: ["image/png", "image/jpg", "image/jpeg"],
      file_max: 10000000,

      is_preview_loading: true,
      is_preview_modal_visible: false,

      show_360_view: false,

      brochures: [{
        title: null,
        img: null,
        class: null
      }],
      videos: [{
        title: null,
        url: 'https://vimeo.com/event/2243209/embed',
        class: null
      }],

      product_catalog: null,
      interactive_profile: null,

      platinum_type: this.$store.state.sponsors.platinum_type,
      gold_type: this.$store.state.sponsors.gold_type,
      silver_type: this.$store.state.sponsors.silver_type,
      bronze_type: this.$store.state.sponsors.bronze_type,
    };
  },
  computed: {
    ...mapGetters({
      user: "auth/user"
    })
  },
  validations: {
    form: {
      name: {
        required,
        maxLength: maxLength(255)
      },
      email: {
        required,
        maxLength: maxLength(255)
      },
      phone: {
        maxLength: maxLength(255)
      },
      address: {
        maxLength: maxLength(255)
      },
      description: {
        maxLength: maxLength(700)
      },
      type: {
        required
      },
      facebook_url: {
        maxLength: maxLength(255)
      },
      website: {
        maxLength: maxLength(255)
      },
      announcement: {
        maxLength: maxLength(150)
      },
      rep_name: {
        maxLength: maxLength(255)
      },
      rep_phone: {
        maxLength: maxLength(191)
      },
      rep_landline: {
        maxLength: maxLength(191)
      }
    }
  },
  methods: {
    setNavbarTitle(title) {
      this.$store.commit("SET_NAVBAR_TITLE", title);
    },
    setNavbarIcon(icon) {
      this.$store.commit("SET_NAVBAR_ICON", icon);
    },
    setNavbarSubpageTitle(subtitle) {
      this.$store.commit("SET_NAVBAR_SUBPAGE_TITLE", subtitle);
    },
    onChangeLogo(file) {
      this.validateFile(file.raw, "photo", result => {
        if (result == true) {
          this.form.logo = file.raw;
          this.logo_img_url = URL.createObjectURL(file.raw);
          this.logo_img_url_change = true;
        }
      });
    },
    onChangeInteractiveProfile(file) {
      this.validateFile(file.raw, "photo", result => {
        if (result == true) {
          this.form.interactive_profile = file.raw;
          this.interactive_profile_img_url = URL.createObjectURL(file.raw);
          this.interactive_profile_img_url_change = true;
        }
      });
    },
    validateFile(file, type, callback) {
      let valid_types = this.image_types;
      if (!file) {
        callback(false);
      } else if (file.size > this.file_max) {
        this.$message.error("File is too big!");
        callback(false);
      } else if (!valid_types.includes(file.type)) {
        this.$message.error("Invalid file type");
        callback(false);
      } else {
        callback(true);
      }
    },
    deleteLogo() {
      this.form.banner = null;
      this.logo_img_url = null;
      this.logo_img_url_change = true;
      this.logo_img_url_deleted = true;
    },
    deleteInteractiveProfile() {
      this.form.interactive_profile = null;
      this.interactive_profile_img_url = null;
      this.interactive_profile_img_url_change = true;
      this.interactive_profile_img_url_deleted = true;
    },
    getSponsor() {
      this.$store
        .dispatch("sponsors/getSponsor", this.user.sponsor.id)
        .then(res => {
          let data = res.data
          let sponsor_data = data.sponsor
          let user_data = sponsor_data.user

          this.form.id = sponsor_data.id
          this.form.name = sponsor_data.name
          this.form.address = sponsor_data.address
          this.form.description = sponsor_data.description
          this.form.phone = sponsor_data.phone
          this.form.sponsor_type_id = sponsor_data.type.id
          this.form.type = sponsor_data.type
          this.form.logo = sponsor_data.logo
          this.form.interactive_profile = sponsor_data.interactive_profile
          this.form.booth_design_id = sponsor_data.booth_design_id
          this.form.booth_design.photo = sponsor_data.booth_design.photo
          this.form.website = sponsor_data.website
          this.form.announcement = sponsor_data.announcement
          this.form.rep_name = sponsor_data.rep_name
          this.form.rep_phone = sponsor_data.rep_phone
          this.form.rep_landline = sponsor_data.rep_landline
          this.form.slug = sponsor_data.slug
          this.form.kuula_iframe = sponsor_data.kuula_iframe

          this.videos = data.videos
          this.brochures = data.brochures
          this.product_catalog = data.product_catalogues.length ? data.product_catalogues[0].url : ""
          this.interactive_profile = sponsor_data.interactive_profile

          this.form.email = user_data.email
        })
        .catch(err => {
          console.error(err)
        });
    },
    recheckInputs() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$message.error("Please fill in the required fields.");
      } else {
        this.save();
      }
    },
    save() {
      disableButton(".btn-save", true);
      let properties = Object.keys(this.form);
      let form = createFormData(this.form, properties);

      if(this.form.phone == null) {
        form.delete("phone");
        properties.filter(property => property !== "phone");
      }

      if(this.form.description == null) {
        form.delete("description");
        properties.filter(property => property !== "description");
      }

      if(this.form.website == null) {
        form.delete("website");
        properties.filter(property => property !== "website");
      }

      if(this.form.address == null) {
        form.delete("address");
        properties.filter(property => property !== "address");
      }

      if(this.form.announcement == null) {
        form.delete("announcement");
        properties.filter(property => property !== "announcement");
      }

      if(this.form.rep_name == null) {
        form.delete("rep_name");
        properties.filter(property => property !== "rep_name");
      }

      if(this.form.rep_phone == null) {
        form.delete("rep_phone");
        properties.filter(property => property !== "rep_phone");
      }

      if(this.form.rep_landline == null) {
        form.delete("rep_landline");
        properties.filter(property => property !== "rep_landline");
      }

      this.$store.dispatch("sponsors/update", form)
      .then(res => {
        this.$message.success(res.data.message);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch(err => {
        this.$message.error(err);
        disableButton(".btn-save", false);
      });
    },
    openPreviewBoothModal() {
      this.is_preview_modal_visible = !this.is_preview_modal_visible;
      this.is_preview_loading = !this.is_preview_loading;
    },
    getLogoCSS() {
      return `background-image: url("${this.form.logo}"); background-repeat: no-repeat; background-size:100% 100%;background-color:#fff`;
    },
    toggle360View() {
      this.show_360_view = !this.show_360_view
    }
  },
  async fetch() {
    this.setNavbarTitle("My Booth");
    this.setNavbarSubpageTitle("Booth Information");
    this.setNavbarIcon('');

    setTimeout(() => {
      this.getSponsor();
    }, 1000);
  },
};
</script>

<style>
.el-dialog__body {
  padding: 0px 20px;
}
</style>

<style lang="scss" scoped>
/* ANNOUNCEMENT CSS */
.announcement {
  position: absolute;
  left: 5%;
  top: 13.5%;
  max-width: 1200px;
  width: 55%;
  background-color: #ffffff;
  border-radius: 30px;
  padding: 15px;
  height: 50px;
  overflow: hidden;
  z-index: 2;
  h1 {
    color: #000000;
    font-weight: 700;
    font-size: 1.2rem;
    width: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: 0;
    white-space: nowrap;
    line-height: 46px;
    animation: announce 15s linear infinite;
  }
}
.vcc-switch-btn, .vcc-switch-btn-360 {
  max-width: 320px;
  width: 100%;
  position: absolute;
  bottom: 5%;
  right: 0;
  left: 0;
  margin: 0 auto;
  text-align: center;
  a {
    text-transform: uppercase;
    color: #fff;
    background-color: #005b97;
    border-radius: 20px;
    display: inline-block;
    padding: 8px 30px;
    font-weight: 300;
    line-height: 25px;
    text-decoration: none;
    max-width: 320px;
    width: 100%;
    cursor: pointer;
    span {
      font-weight: 700;
      font-size: 25px;
    }
  }
}
.sponsor-logo {
  max-height: 100px;
  width: 100%;
  object-fit: contain;
}
.booth-content {
  padding-top: 30px;
  padding-bottom: 30px;
  h1 {
    margin-top: 50px;
    font-weight: 700;
    color: #065E99;
    margin-bottom: 20px;
    font-family: system-ui;
  }
  p {
    font-size: 1.5rem;
    line-height: normal;
  }
}
.contacts {
  padding: 25px 0px;
}
.vcc-banner-container {
  position: relative;
}
.description-editor {
  ::v-deep {
    .ql-link, .ql-code-block, .ql-image, .ql-video {
      display: none;
    }
  }
}

/***** Start of Booth Assets *****/
.vcc-banner-img .assets a {
  border: 2px solid #00ccff;
  animation-name: blinking;
  animation-duration: 1s;
  animation-iteration-count: 100;
}
.vcc-banner-img .assets a:hover {
  border: 3px solid #00ccff;
}
// Start of Platinum
.platinum {
  &.assets {
    .product-catalog {
      position: absolute;
      display: block;
      width: 7.9%;
      height: 24.2%;
      top: 45.5%;
      left: 74.9%;
    }
    .product-profile {
      position: absolute;
      display: block;
      width: 11.2%;
      height: 11.7%;
      top: 48.5%;
      left: 51.5%;
    }
    .product-video-1 {
      position: absolute;
      display: block;
      width: 7.7%;
      height: 8.2%;
      top: 45%;
      left: 29.6%;
    }
    .product-video-2 {
      position: absolute;
      display: block;
      width: 7.7%;
      height: 8.2%;
      top: 45%;
      left: 38.8%;
    }
    .product-video-3 {
      position: absolute;
      display: block;
      width: 7.7%;
      height: 8.2%;
      top: 54.4%;
      left: 29.6%;
    }
    .product-video-4 {
      position: absolute;
      display: block;
      width: 7.7%;
      height: 8.2%;
      top: 54.4%;
      left: 38.8%;
    }
    .product-brochure-1 {
      position: absolute;
      display: block;
      width: 2.4%;
      height: 3.7%;
      top: 62.4%;
      left: 47.1%;
    }
    .product-brochure-2 {
      position: absolute;
      display: block;
      width: 2.4%;
      height: 3.7%;
      top: 67%;
      left: 47.1%;
    }
    .product-brochure-3 {
      position: absolute;
      display: block;
      width: 2.4%;
      height: 3.7%;
      top: 71.5%;
      left: 47.1%;
    }
    .product-brochure-4 {
      position: absolute;
      display: block;
      width: 2.4%;
      height: 3.7%;
      top: 76.1%;
      left: 47.1%;
    }
    .product-brochure-5 {
      position: absolute;
      display: block;
      width: 2.4%;
      height: 3.7%;
      top: 62.4%;
      left: 69.8%;
    }
    .product-brochure-6 {
      position: absolute;
      display: block;
      width: 2.4%;
      height: 3.7%;
      top: 67%;
      left: 69.8%;
    }
    .product-brochure-7 {
      position: absolute;
      display: block;
      width: 2.4%;
      height: 3.7%;
      top: 71.5%;
      left: 69.8%;
    }
    .product-brochure-8 {
      position: absolute;
      display: block;
      width: 2.4%;
      height: 3.7%;
      top: 76.1%;
      left: 69.8%;
    }
  }
}
// End of Platinum

// Start of Gold
.gold {
  &.assets {
    .product-catalog {
      position: absolute;
      display: block;
      width: 7.3%;
      height: 22.8%;
      top: 46.1%;
      left: 22.5%;
    }
    .product-profile {
      position: absolute;
      display: block;
      width: 11.2%;
      height: 11.7%;
      top: 49.1%;
      left: 54.3%;
    }
    .product-video-1 {
      position: absolute;
      display: block;
      width: 6%;
      height: 6.3%;
      top: 45.2%;
      left: 39.6%;
    }
    .product-video-2 {
      position: absolute;
      display: block;
      width: 6%;
      height: 6.3%;
      top: 52.6%;
      left: 39.6%;
    }
    .product-video-3 {
      position: absolute;
      display: block;
      width: 6%;
      height: 6.3%;
      top: 60%;
      left: 39.6%;
    }
    .product-video-4 {
      position: absolute;
      display: block;
      width: 7.7%;
      height: 8.2%;
      top: 54.4%;
      left: 38.8%;
    }
    .product-brochure-1 {
      position: absolute;
      display: block;
      width: 2.4%;
      height: 3.7%;
      top: 62.9%;
      left: 51.1%;
    }
    .product-brochure-2 {
      position: absolute;
      display: block;
      width: 2.4%;
      height: 3.7%;
      top: 67.2%;
      left: 51.1%;
    }
    .product-brochure-3 {
      position: absolute;
      display: block;
      width: 2.4%;
      height: 3.7%;
      top: 71.5%;
      left: 51.1%;
    }
    .product-brochure-4 {
      position: absolute;
      display: block;
      width: 2.4%;
      height: 3.7%;
      top: 76%;
      left: 51.1%;
    }
    .product-brochure-5 {
      position: absolute;
      display: block;
      width: 2.4%;
      height: 3.7%;
      top: 63.1%;
      left: 72.2%;
    }
    .product-brochure-6 {
      position: absolute;
      display: block;
      width: 2.4%;
      height: 3.7%;
      top: 67.3%;
      left: 72.2%;
    }
    .product-brochure-7 {
      position: absolute;
      display: block;
      width: 2.4%;
      height: 3.7%;
      top: 71.5%;
      left: 72.2%;
    }
    .product-brochure-8 {
      position: absolute;
      display: block;
      width: 2.4%;
      height: 3.7%;
      top: 76%;
      left: 72.2%;
    }
  }
}   
// End of Gold

// Start of Silver
.silver {
  &.assets {
    .product-catalog {
      position: absolute;
      display: block;
      width: 5.7%;
      height: 17.6%;
      top: 42.6%;
      left: 35.4%;
    }
    .product-profile {
        position: absolute;
        display: block;
        width: 10.5%;
        height: 11.2%;
        top: 46.1%;
        left: 44.1%;
    }
    .product-video-1 {
      position: absolute;
      display: block;
      width: 7.6%;
      height: 8.2%;
      top: 42.5%;
      left: 57%;
    }
    .product-video-2 {
      position: absolute;
      display: block;
      width: 7.6%;
      height: 8.2%;
      top: 51.7%;
      left: 57%;
    }
    .product-video-3 {
      position: absolute;
      display: block;
      width: 6%;
      height: 6.3%;
      top: 60%;
      left: 39.6%;
    }
    .product-video-4 {
      position: absolute;
      display: block;
      width: 7.7%;
      height: 8.2%;
      top: 54.4%;
      left: 38.8%;
    }
    .product-brochure-1 {
      position: absolute;
      display: block;
      width: 2.4%;
      height: 3.7%;
      top: 62.6%;
      left: 29.6%;
    }
    .product-brochure-2 {
      position: absolute;
      display: block;
      width: 2.4%;
      height: 3.7%;
      top: 66.6%;
      left: 29.6%;
    }
    .product-brochure-3 {
      position: absolute;
      display: block;
      width: 2.4%;
      height: 3.7%;
      top: 70.6%;
      left: 29.6%;
    }
    .product-brochure-4 {
      position: absolute;
      display: block;
      width: 2.4%;
      height: 3.7%;
      top: 74.6%;
      left: 29.6%;
    }
    .product-brochure-5 {
      position: absolute;
      display: block;
      width: 2.4%;
      height: 3.7%;
      top: 62.6%;
      left: 32.5%;
    }
    .product-brochure-6 {
      position: absolute;
      display: block;
      width: 2.4%;
      height: 3.7%;
      top: 66.6%;
      left: 32.5%;
    }
    .product-brochure-7 {
      position: absolute;
      display: block;
      width: 2.4%;
      height: 3.7%;
      top: 70.6%;
      left: 32.5%;
    }
    .product-brochure-8 {
      position: absolute;
      display: block;
      width: 2.4%;
      height: 3.7%;
      top: 74.6%;
      left: 32.5%;
    }
  }
}
// End of Silver

// Start of Bronze
.bronze {
  &.assets {
    .product-catalog {
      position: absolute;
      display: block;
      width: 5.7%;
      height: 17.6%;
      top: 42.6%;
      left: 35.4%;
    }
    .product-profile {
      position: absolute;
      display: block;
      width: 10.9%;
      height: 11.6%;
      top: 48.4%;
      left: 50.8%;
    }
    .product-video-1 {
      position: absolute;
      display: block;
      width: 7.6%;
      height: 8.2%;
      top: 42.5%;
      left: 57%;
    }
    .product-video-2 {
      position: absolute;
      display: block;
      width: 7.6%;
      height: 8.2%;
      top: 51.7%;
      left: 57%;
    }
    .product-video-3 {
      position: absolute;
      display: block;
      width: 6%;
      height: 6.3%;
      top: 60%;
      left: 39.6%;
    }
    .product-video-4 {
      position: absolute;
      display: block;
      width: 7.7%;
      height: 8.2%;
      top: 54.4%;
      left: 38.8%;
    }
    .product-brochure-1 {
      position: absolute;
      display: block;
      width: 2.7%;
      height: 3.8%;
      top: 62.8%;
      left: 64.5%;
    }
    .product-brochure-2 {
      position: absolute;
      display: block;
      width: 2.7%;
      height: 3.8%;
      top: 67.6%;
      left: 64.5%;
    }
    .product-brochure-3 {
      position: absolute;
      display: block;
      width: 2.7%;
      height: 3.8%;
      top: 72.5%;
      left: 64.5%;
    }
    .product-brochure-4 {
      position: absolute;
      display: block;
      width: 2.7%;
      height: 3.8%;
      top: 77.4%;
      left: 64.5%;
    }
    .product-brochure-5 {
      position: absolute;
      display: block;
      width: 2.4%;
      height: 3.7%;
      top: 62.6%;
      left: 32.5%;
    }
    .product-brochure-6 {
      position: absolute;
      display: block;
      width: 2.4%;
      height: 3.7%;
      top: 66.6%;
      left: 32.5%;
    }
    .product-brochure-7 {
      position: absolute;
      display: block;
      width: 2.4%;
      height: 3.7%;
      top: 70.6%;
      left: 32.5%;
    }
    .product-brochure-8 {
      position: absolute;
      display: block;
      width: 2.4%;
      height: 3.7%;
      top: 74.6%;
      left: 32.5%;
    }
  }
}
// End of Bronze

/***** End of Booth Assets *****/

@keyframes announce {
  0% {
    transform: translate(101%, 0);
  }
  50% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(-101%, 0);
  }
}
@media screen and (max-width: 915px) {
  /*button 360 and 3D*/
  .vcc-switch-btn, .vcc-switch-btn-360 {
    bottom: 2%;
  }
}
@media only screen and (max-width: 920px) {
  .preview-dialog {
    &-container {
      position: relative;
      overflow: hidden;
      img {
        margin-left: -25%;
        width: 150%;
      }
    }
  }
}
@media only screen and (min-width: 921px) {
  .preview-dialog {
    &-container {
      position: relative;
      img {
        width: 100%;
      }
    }
  }
}
@media screen and (max-width: 768px) and (orientation: landscape) {
  .announcement {
    left: 2%;
    width: 50%;
    padding: 10px;
    height: 30px;
    h1 {
      font-weight: 500;
      font-size: .9rem;
      top: -10px;
    }
  }
  .vcc-360-view::v-deep {
    iframe {
      height: 430px !important;
    }
  }

  /*button 360 and 3D*/
  .vcc-switch-btn, .vcc-switch-btn-360 {
    width: 180px;
    bottom: 2.5%;
    a {
      line-height: 15px;
      font-size: .8em;
      padding: 5px 25px;
      border-radius: 12px;
      span {
        font-size: 15px;
        font-weight: 600;
      }
    }
  }
}
@media screen and (max-width: 576px) {
  .announcement {
    left: 2%;
    top: 25.5%;
    width: 50%;
    padding: 10px;
    height: 30px;
    h1 {
      font-weight: 500;
      font-size: .9rem;
      top: -10px;
    }
  }
  .vcc-360-view::v-deep {
    iframe {
      height: 320px !important;
    }
  }

  .vcc-switch-btn, .vcc-switch-btn-360 {
    width: 145px;
    bottom: 2%;
    a {
      line-height: 10px;
      font-size: .5em;
      padding: 3px 25px;
      border-radius: 12px;
      span {
        font-size: 12px;
        font-weight: 500;
      }
    }
  }
}
</style>