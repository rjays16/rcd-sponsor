<template>
    <aside class="main-sidebar sidebar-dark-primary elevation-4">
        <span class="brand-link text-center p-2">
            <span class="brand-text font-weight-light">
                <img :src="sidebarLogo" alt="Admin Logo">
            </span>
        </span>
        <div class="sidebar pt-2 dmsans-bold">
            <div class="sidebar-container">
                <el-menu
                    class="el-menu-sidebar"
                    unique-opened
                    router
                    text-color="#ffffff"
                    active-text-color="#fff"
                    ref="menuSidebar">
                    <el-menu-item index="/booth/dashboard" @click="closeSubmenu">
                        <div class="container-icon">
                            <i class="fas fa-home"></i>
                        </div>
                        <span>Dashboard</span>
                    </el-menu-item>
                    <el-menu-item index="/booth/information" @click="closeSubmenu">
                        <div class="container-icon">
                            <i class="fas fa-person-booth"></i>
                        </div>
                        <span>Booth Information</span>
                    </el-menu-item>
                    <el-menu-item index="/stamps" @click="closeSubmenu">
                        <div class="container-icon">
                            <i class="fas fa-stamp"></i>
                        </div>
                        <span>Booth Stamps</span>
                    </el-menu-item>
                    <el-menu-item index="/visitors" @click="closeSubmenu">
                        <div class="container-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <span>Visitors</span>
                    </el-menu-item>
                    <el-menu-item index="/chat" @click="closeSubmenu">
                        <div class="container-icon">
                            <i class="fas fa-comment-alt"></i>
                        </div>
                        <span>Chat</span>
                    </el-menu-item>
                </el-menu>
            </div>
        </div>
    </aside>
</template>

<script>
import { mapGetters } from "vuex";
export default {
	data() {
		return {
            sidebarLogo: require('~/static/img/logo-rcd2022.png'),
            submenus: ["booth"],
		}
	},
    computed: {
        ...mapGetters({
            user: 'auth/user',
        }),
    },
    methods: {
        closeSubmenu() {
            let self = this
            this.submenus.forEach(function(submenu) {
                self.$refs.menuSidebar.close(submenu)
            });
        },
    },
    mounted() {
        $('.el-submenu__title').on('click', function(e) {
            $('.el-menu-item').not('.sub-item.is-active').removeClass('active')
        });
    }
}
</script>

<style lang="scss" scoped>
.el-menu .el-menu--inline{
 background-color: white!important;
}
.adjust {
  margin-left: 20%;
  background-color: white!important;
}
.main-sidebar {
    background: white!important;
    .sidebar {
        overflow-y: scroll;
        margin-top: calc(3.5rem + 40px)!important;
    }
    .brand-link {
        background: white!important;
        border-bottom: none;
        span {
            img {
                width: 150px;
                padding: 11px 0;
            }
        }
    }
    .sidebar-container {
        .el-menu-sidebar {
            border: none;
            font-size: 2rem;
            i {
                &.fa, &.fas, &.far {
                    color: #9a9aa9;
                    margin-right: 0.5rem;
                    width: 15px;
                }
            }
            .container-icon {
                display: inline-block;
                margin-right: 0.5rem;
            }
            .el-menu-item {
                border-radius: 0px;
                background-color:white!important;
                span {
                    color:#838a95;
                    font-size: 14px;
                }
                &.is-active {
                    *, * > * {
                        color:#0776BC;
                    }
                }
                .notice-badge {
                    background: #838a95;
                    padding: 0px 5px;
                    font-size: 0.8rem;
                    margin-left: 10px;
                }
                &.active {
                    background: #838a95!important;
                    border-radius: 0px;
                    color: #0776BC!important;
                    .container-icon {
                        background: #0776BC;
                        border-radius: 50%;
                        padding: 7px;
                        height: 30px;
                        width: 30px;
                        margin-left: -8px;
                        margin-right: 9px;
                        text-align: center;
                    }
                    i {
                        margin: 0 auto;
                        left: 19px;
                        position: absolute;
                        &.fa, &.fas, &.far {
                            color: #0776BC;
                        }
                    }
                }
            }
            .el-submenu {
                &.is-opened {
                    ::v-deep .el-submenu__title {
                        border-radius: 0px;
                        background-color: white!important;
                        .container-icon {
                            padding: 7px;
                            height: 30px;
                            width: 30px;
                            margin-left: -8px;
                            margin-right: 9px;
                            text-align: center;
                        }
                        i:not(.el-icon-arrow-down) {
                            margin: 0 auto;
                            left: 19px;
                            position: absolute;
                        }
                    }
                }
                .el-menu-item {
                    padding-left: 15px!important;
                    font-size: 14px;
                    background-color: white!important;
                    color: #838a95!important;
                    &.active {
                        i {
                            margin-right: 0.5rem;
                            position: initial;
                        }
                    }
                }
                ::v-deep .el-submenu__title {
                    background-color: white!important;
                    * {
                        color: #838a95;
                    }
                }
            }
            .multi-menu {
                ::v-deep {
                    .el-menu-item-group__title {
                        color: #EB7E10;
                        font-size: 13px;
                        > * {
                            color: #EB7E10;
                        }
                    }
                    .far, .fas {
                        margin-right: 0.5rem;
                    }
                }
            }
        }
    }
}
</style>
