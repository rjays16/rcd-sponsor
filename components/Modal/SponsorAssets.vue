<template>
    <section>
        <div class="resources">
            <h1>RESOURCES</h1>
            <ul>
                <li class="company-profile">
                    <button type="text" @click="viewCompanyProfile(interactive_profile)">Company Profile</button>
                </li>
                <li class="download-brochures">
                    <button type="text" @click="showBrochureModal = true">Download Brochures</button>
                </li>
                <li class="watch-videos">
                    <button type="text" @click="showVideoModal = true">Watch Videos</button>
                </li>
                <li class="products-catalog">
                    <button type="text" @click="viewCatalog(product_catalog)">Products Catalog</button>
                </li>
            </ul>
        </div>

        <el-dialog title="Brochures" :visible.sync="showBrochureModal" id="brochures" append-to-body>
            <div v-for="(brochure, index) in brochures" :key="index" class="resource-list">
                <div class="list-name">{{ 'Brochure ' + (index + 1) }}</div>
                <div class="list-view">
                    <img src="~/static/img/blue-pdf.png" alt="">
                    <button class="view-pdf text-uppercase" @click="viewPDF(brochure.url)">
                        View PDF
                    </button>
                </div>
            </div>
        </el-dialog>

        <!-- Inner dialog for PDF preview -->
        <el-dialog :visible.sync="showInnerBrochure" class="inner-modal" id="brochure_dialog">
            <div id="brochure_viewer" class="resource-item" v-loading="brochure_isLoading">
            </div>
            <div class="resource-download">
                <button @click="downloadGoogleResource()">
                    Download Here
                </button>
            </div>
        </el-dialog>
        <!-- Inner dialog for PDF preview -->

        <el-dialog title="Videos" :visible.sync="showVideoModal" append-to-body>
            <div v-for="(video, index) in videos" :key="index" class="resource-list">
                <div class="list-name">{{ 'Video ' + (index + 1) }}</div>
                <div class="list-view">
                    <img src="~/static/img/blue-video.png" alt="">
                    <button @click="viewVideo(video.url)" class="view-pdf text-uppercase">
                        Watch Video
                    </button>
                </div>
            </div>
        </el-dialog>

        <!-- Inner dialog for Video preview -->
        <el-dialog :visible.sync="showInnerVideo" class="inner-modal inner-video-modal" append-to-body>
            <div class="resource-item video" v-loading="video_isLoading">
                <iframe :src="video_url" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
            </div>
        </el-dialog>
        <!-- Inner dialog for Video preview -->

        <el-dialog class="inner-modal" :visible.sync="showComProfileModal" append-to-body>
            <div id="com_profile_viewer" class="resource-item" v-loading="com_profile_isLoading">
            </div>
            <div class="resource-download">
                <button @click="downloadGoogleResource()">
                    Download Here
                </button>
            </div>
        </el-dialog>

        <el-dialog class="inner-modal" :visible.sync="showCatalogModal" id="catalog_dialog" append-to-body>
            <div id="catalog_viewer" class="resource-item" v-loading="catalog_isLoading">
            </div>
            <div class="resource-download">
                <button @click="downloadGoogleResource()">
                    Download Here
                </button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
import PDFObject from 'pdfobject'
export default {
    components: {
        PDFObject
    },
    data() {
        return {
            showBrochureModal: false,
            showInnerBrochure: false,

            showVideoModal: false,
            showInnerVideo: false,
            video_url: null,

            showComProfileModal: false,
            showCatalogModal: false,

            brochure_isLoading: false,
            video_isLoading: false,
            catalog_isLoading: false,
            com_profile_isLoading: false,

            google_download_base_url: "https://drive.google.com/uc?export=download&id=",
            resource_download_url: null
        };
    },
    props: {
        brochures: {
            type: Array,
            required: true,
        },
        videos: {
            type: Array,
            required: true,
        },
        product_catalog: {
            required: true,
        },
        interactive_profile: {
            required: true
        }
    },
    methods: {
        viewVideo(video_link) {
            this.video_isLoading = true

            if(video_link) {
                this.video_url = video_link
                var url_parts = video_link.split('/');

                this.resource_download_url = null
                if(url_parts.length >= 5) {
                    this.resource_download_url = this.google_download_base_url + url_parts[5] // Append the google resource id to the google_download_base_url
                } else {
                    this.resource_download_url = null
                }

                this.showInnerVideo = true
                this.video_isLoading = false
            } else {
                this.$message.error("The PDF url for the brochure was not found.")
            }
        },
        viewPDF(pdf) {
            this.brochure_isLoading = true

            if(pdf) {
                var url_parts = pdf.split('/');

                this.resource_download_url = null
                if(url_parts.length >= 5) {
                    this.resource_download_url = this.google_download_base_url + url_parts[5] // Append the google resource id to the google_download_base_url
                } else {
                    this.resource_download_url = null
                }

                this.showInnerBrochure = true
                let brochure_element = $('#brochure_dialog').html()

                let brochure_viewer_timer = setInterval(function () {
                    if(brochure_element) {
                        var options = {
                            pdfOpenParams: {
                                view: "FitV",
                                pagemode: "thumbs"
                            }
                        }

                        PDFObject.embed(pdf, "#brochure_viewer", options)
                        this.brochure_isLoading = false
                        clearInterval(brochure_viewer_timer)
                    }
                }, 500);
            } else {
                this.$message.error("The PDF url for the brochure was not found.")
            }
        },
        viewCatalog(pdf) {
            this.catalog_isLoading = true

            if(pdf) {
                var url_parts = pdf.split('/');

                this.resource_download_url = null
                if(url_parts.length >= 5) {
                    this.resource_download_url = this.google_download_base_url + url_parts[5] // Append the google resource id to the google_download_base_url
                } else {
                    this.resource_download_url = null
                }

                this.showCatalogModal = true
                let catalog_element = $('#catalog_dialog').html()

                let catalog_viewer_timer = setInterval(function () {
                    if(catalog_element) {
                        var options = {
                            pdfOpenParams: {
                                view: "FitV",
                                pagemode: "thumbs"
                            }
                        }

                        PDFObject.embed(pdf, "#catalog_viewer", options)
                        this.catalog_isLoading = false
                        clearInterval(catalog_viewer_timer)
                    }
                }, 500);
            } else {
                this.$message.error("The PDF url for the product catalogue was not found.")
            }
        },
        viewCompanyProfile(resource_link) {
            this.com_profile_isLoading = true

            if(resource_link) {
                var url_parts = resource_link.split('/');

                this.resource_download_url = null
                if(url_parts.length >= 5) {
                    this.resource_download_url = this.google_download_base_url + url_parts[5] // Append the google resource id to the google_download_base_url
                } else {
                    this.resource_download_url = null
                }

                this.showComProfileModal = true
                let com_profile_element = $('#catalog_dialog').html()

                let com_profile_viewer_timer = setInterval(function () {
                    if(com_profile_element) {
                        var options = {
                            pdfOpenParams: {
                                view: "FitV",
                                pagemode: "thumbs"
                            }
                        }

                        PDFObject.embed(resource_link, "#com_profile_viewer", options)
                        this.com_profile_isLoading = false
                        clearInterval(com_profile_viewer_timer)
                    }
                }, 500);
            } else {
                this.$message.error("The company profile for this booth has not been set yet.")
            }
        },
        downloadGoogleResource() {
            if(this.resource_download_url) {
                window.open(this.resource_download_url)
            } else {
                this.$message.error("The download link for this file is not available as of the moment.")
            }
        }
    },
}

</script>

<style lang="scss" scoped>

::v-deep .el-dialog {
    background-color: #ffffff;
    height: auto;
    text-align: center;
    max-width: 790px;
    width: 90%;
    border-radius: 10px;
    overflow: hidden;
    @media screen and (max-width: 912px) {
        width: 70% !important;
    }
    @media screen and (max-width: 512px) {
        width: 90% !important;
    }
    .el-dialog__header {
        background-color: #065E99;
        margin: 0;
        padding: 5px;
        .el-dialog__headerbtn {
            border: none;
            width: 22px;
            height: 22px;
            position: absolute;
            top: 9px;
            right: 9px;
            background: url("~/static/img/white-close.png") no-repeat center center;
            i {
                display: none;
            }
        }
        .el-dialog__title {
            font-size: 1.6rem;
            text-transform: uppercase;
            font-weight: 700;
            color: #ffffff;
        }
    }
    .el-dialog__body {
        padding: 0;
        font-size: 1rem;
        .resource-list {
            display: flex;
            justify-content: center;
            align-items: center;
            border-bottom: 1px dotted #000;
            .list-name {
                flex: 1.4;
                padding: 5px;
                font-size: 0.8rem;
                font-weight: 700;
                color: #065E99;
            }
            .list-view {
                flex: 0.6;
                display: flex;
                padding: 5px;
                & > button {
                    background-color: #0776BC;
                    font-size: 0.9rem;
                    color: #ffffff;
                    font-weight: 700;
                    text-transform: uppercase;
                    border: none;
                    padding: 2px 20px;
                    border-radius: 20px;
                    width: 90%;
                    max-width: 160px;
                    margin-left: 10px;
                    word-break: break-word;
                }
                & > button:hover {
                    opacity: 0.9;
                }
            }
        }
    }
    .el-dialog__footer {
        display: none;
    }
}
.inner-modal {
    &::v-deep .el-dialog {
        background-color: #ffffff;
        text-align: center;
        position: absolute;
        border-radius: 0;
        box-shadow: none;
        height: 90%;
        overflow: visible;
        margin: auto !important;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;

            // height: max-content;

        .el-dialog__header {
            padding: 0;
            .el-dialog__headerbtn {
                border: none;
                position: absolute;
                top: 0;
                right: -50px;
                width: 50px;
                height: 50px;
                background: url("~/static/img/close.png") no-repeat center center #ffffff;

                @media screen and (max-width: 512px) {
                    z-index: 1 !important;
                    top: -15px !important;
                    right: -15px !important;
                    width: 30px !important;
                    height: 30px !important;
                }
            }
        }
        .el-dialog__body {
            height: 100%;
            text-align: center;
            max-width: 100%;
            width: auto;
            position: relative;

            .resource-item {
                height: 92%;
                img {
                    height: 100%;
                    width: 100%;
                    display: block;
                }
            }
            .resource-item.video {
                /*responsive update*/
                // padding-top: 56.25%;
                /*end responsive update*/
                iframe {
                    width: 100%;
                    height: 100%;
                /*responsive update*/
                    position: absolute;
                    top: 0;
                    left: 0;
                    bottom: 0;
                    right: 0;
                /*end responsive update*/
                }
            }
            .resource-download {
                height: 8%;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                button {
                    border: none;
                    background: url("~/static/img/arrow-download.png") no-repeat right center transparent;
                    background-size: contain;
                    color: #065E99;
                    font-size: 1.2rem;
                    text-transform: uppercase;
                    line-height: 1.2rem;
                    padding: 0 35px 0 0;
                    margin-right: 10px;
                }
            }
        }
    }
}

.inner-video-modal {
    &::v-deep .el-dialog {
        background-color: #ffffff;
        text-align: center;
        position: absolute;
        border-radius: 0;
        box-shadow: none;
        height: max-content;
        overflow: visible;
        margin: auto !important;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        .el-dialog__header {
            padding: 0;
            .el-dialog__headerbtn {
                border: none;
                position: absolute;
                top: 0;
                right: -50px;
                width: 50px;
                height: 50px;
                background: url("~/static/img/close.png") no-repeat center center #ffffff;

                @media screen and (max-width: 512px) {
                    z-index: 1 !important;
                    top: -15px !important;
                    right: -15px !important;
                    width: 30px !important;
                    height: 30px !important;
                }
            }
        }
        .el-dialog__body {
            height: 100%;
            text-align: center;
            max-width: 100%;
            width: auto;
            position: relative;
            padding-top: 56.25%;

            .resource-item {
                height: 92%;
                img {
                    height: 100%;
                    width: 100%;
                    display: block;
                }
            }
            .resource-item.video {
                iframe {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                    bottom: 0;
                    right: 0;
                }
            }
        }
    }
}

.resources {
    background-color: #0776BC;
    border-radius: 20px;
    padding: 25px;
    h1 {
        color: #ffffff;
        margin: 0 0 20px;
    }
    ul {
        margin: 0;
        padding: 0;
        list-style: none;
        li {
            color: #ffffff;
            padding-left: 45px;
            font-size: 1.5rem;
            padding-bottom: 2px;
            margin-bottom: 7px;
            cursor: pointer;
            button {
                border: none;
                background: none;
                color: #ffffff;
            }
            &:hover {
                opacity: 0.5;
            }
            &.company-profile {
                background: url('~/static/img/ant-design_profile-outlined.png') no-repeat left center;
            }
            &.download-brochures {
                background: url('~/static/img/teenyicons_pdf-outline.png') no-repeat left center;
            }
            &.watch-videos {
                background: url('~/static/img/et_video-booth.png') no-repeat left center;
            }
            &.products-catalog {
                background: url('~/static/img/uit_create-dashboard.png') no-repeat left center;
            }
        }
    }
}

@media screen and (max-width: 840px) {

}

@media screen and (max-width: 512px) {
    .el-dialog {
        width: 80% !important;
        .el-dialog__body {
            .resource-list {
                .list-name {
                    flex: .4 !important;
                }
            }
        }
    }
    .inner-modal .el-dialog .el-dialog__header .el-dialog__headerbtn{
        border-radius: 50px !important;
        z-index: 1 !important;
        top: -15px !important;
        right: -15px !important;
        width: 30px !important;
        height: 30px !important;
    }

}

</style>