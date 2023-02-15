<template>
  <div class="content-header" id="chat">
    <div class="container-fluid">
			<div class="container-fluid py-2">
				<div class="row">
					<div class="col-12 pl-0">
						<button class="btn btn-blue btn-export-chat border mr-2" @click="exportChatReport">
							Export Chat Report
						</button>

            <button class="btn btn-blue btn-export-visitors-only border mr-2" @click="exportVisitorsOnlyReport">
							Export Visitors Only Report
						</button>
					</div>
				</div>
			</div>
		</div>
    <div class="container-fluid chat-box">
      <div class="container-fluid mt-2 bg-white corner-rounded p-3 ">
        <div class="row filters my-3">
          <div class="col-12 col-md-4 pl-0">
            <el-input v-model="searchTerm" placeholder="Search..." @input="search" suffix-icon="el-icon-search" clearable />
          </div>
        </div>
        <div class="row">
          <div class="col-md-5 col-sm-12 corner-rounded border p-3 chat-box-attendee" :class="showAttendeeListOnSmallScreen? 'd-block d-md-block': 'd-none d-md-block'">
            <div class="chat">
              <div class="chat-about">
                <div class="text-left chat-with">
                  Attendees
                </div>
              </div>
              <div v-if="loadList == true">
                <div v-if="attendees.length < 0 || typeof attendees.length === 'undefined'">
                  <h6>No attendees found.</h6>
                </div>
                <div v-else class="container-chat clearfix">
                  <div class="people-list">
                    <ul class="list-nav">
                      <li class="clearfix" v-for="(attendee, index) in attendees" :key="index"
                        :class=" attendee.viewed_sponsor == 0 ? 'bg-unviewed' : ''"
                        @click="selectAttendee(attendee)">
                        <div class="d-flex flex-row align-items-center nav-item clickable">
                          <div v-if="sponsor_type == 1">
                            <button class="btn btn-muted btn-sm" @click="videoCall(attendee)">
                              <i class="fas fa-video text-gray"></i>
                            </button>
                          </div>
                          <i class="fa fa-circle online" :style="attendee.active_token ? 'color:#32CD32' : 'color: LightGray'"></i>
                          <div class="about nav-link">
                            <div class="name">
                              {{ !attendee.is_anon_for_chat ? attendee.full_name : "Visitor " + attendee.id }}
                            </div>
                            <div class="status">
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-7 col-sm-12 corner-rounded p-3" :class="showAttendeeListOnSmallScreen ? 'd-none d-md-block' : 'd-block d-md-block'">
            <div class="chat">
              <a href="#" class="d-block d-md-none" @click="showAttendeeListOnSmallScreen = !showAttendeeListOnSmallScreen">
                <i class="fa fa-chevron-left fa-lg" aria-hidden="true"></i>
              </a>
              <div class="chat-header clearfix">
                <div class="chat-about">
                  <div class="text-center chat-with">
                    Chat with
                    {{ attendee.id != null
                      ? !attendee.is_anon_for_chat 
                        ? attendee.name
                        : "Visitor " + attendee.id
                      : "" }}
                  </div>
                </div>
              </div>
              <div class="chat-history" style="height:400px; overflow-y:scroll" v-chat-scroll>
                <ul>
                  <li :class="messages.length <= 0 ? '' : 'd-none'" class="clearfix">
                    <div class="text-center">
                      No Conversations Yet.
                    </div>
                  </li>
                  <li v-for="(message, index) in messages" :key="index" :class="message.sender_id == sponsor.id ? 'clearfix' : ''">
                    <span v-if="message.sender_id == sponsor.id">
                      <div class="message other-message float-right">
                        {{ message.message }}
                      </div>
                      <div class="message-data float-right">
                        <span class="message-data-name">
                          {{ message.sender.full_name }}
                        </span>
                        <i class="fa fa-circle me"></i><br />
                        <span class="message-data-time">
                          {{ new Date(message.created_at) | moment("MMMM D, YYYY") }}
                        </span>
                      </div>
                    </span>
                    <span v-else>
                      <div class="message my-message">
                        {{ message.message }}
                      </div>
                      <div class="message-data">
                        <span class="message-data-name">
                          <i class="fa fa-circle online" :style="message.sender.active_token ? 'color:#32CD32' : 'color: LightGray'"></i>
                          {{ !message.sender.is_anon_for_chat ?  message.sender.full_name : "Visitor " +  message.sender.id }}
                        </span>
                        <br />
                        <span class="message-data-time">
                          {{ new Date(message.created_at) | moment("MMMM D, YYYY") }}
                        </span>
                      </div>
                    </span>
                  </li>
                </ul>
              </div>
              <div class="chat-message clearfix">
                <textarea @keydown.enter.exact.prevent @keyup.enter.exact="sendMessage" v-model="newMessage"
                  name="message" placeholder="Type your message..." rows="3" />
                <button class="btn btn-primary"
                  :class="{ disabled: newMessage === '' || newMessage === null }"
                  @click="sendMessage">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import VueChatScroll from "vue-chat-scroll";
import { mapGetters } from "vuex";
import { disableButton } from "~/components/Helper/functions.js"
Vue.use(VueChatScroll);

export default {
  name: "Chat",
  middleware: "auth",
  data() {
    return {
      sponsor: { id: null, name: null },
      attendee: { id: null, name: null, stealth_status_id: 1 },
      sponsor_type: null,
      newMessage: null,
      is_search: false,
      attendees: [],
      searchTerm: null,
      fields: [
        { key: "full_name", label: "Attendees", tdClass: "align-middle" }
      ],
      isBusy: false,
      rows: 0,
      currentPage: 1,
      perPage: 10,
      chatBoxVisibility: true,
      showAttendeeListOnSmallScreen: true,
      loadList: false
    };
  },
  computed: {
    ...mapGetters({
      messages: "chats/getMessages",
      user: "auth/user"
    })
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
    search() {
      this.loadList = false;
      this.is_search = true;
      this.$store.dispatch("chats/getSearchAttendees", {
        is_search: this.is_search,
        searchTerm: this.searchTerm
      })
      .then(res => {
        this.attendees = res.data;
        console.log(res.data);
        this.loadList = true;
      })
      .catch(err => {
        this.attendees = []
        this.$message.error(err);
      });
    },
    getSponsor() {
      this.$store.dispatch("user/getUser")
      .then(res => {
        this.sponsor = res.data;
        this.sponsor_type = this.sponsor.sponsor.type;
      })
      .catch(err => {
        this.$message.error(err.data);
      });
    },
    getAttendees() {
      this.loadList = false;
      this.$store.dispatch("chats/getAttendees")
      .then(res => {
        this.attendees = res.data;
        this.rows = this.attendees.length;
        this.loadList = true;
        if(this.rows != 0) {
          this.attendee = { 
            id: res.data[0].id,
            name: res.data[0].full_name
          }
        }
      })
      .catch(err => {
        this.attendees = []
        console.error(err)
        // this.$message.error(err);
      });
    },
    getMessages() {
      this.$store.dispatch("chats/getMessages", { attendee_id: this.attendee.id })
      .then(res => {
        this.messages = res.data;
        console.log("this.getMessages", this.getMessages)
      })
      .catch(err => {
        this.$message.error(err);
      });
    },
    selectAttendee(attendee) {
      this.attendee = { id: attendee.id, name: attendee.full_name, stealth_status_id: attendee.stealth_status_id };
      this.showAttendeeListOnSmallScreen = !this.showAttendeeListOnSmallScreen;
      this.newMessage = null;
      attendee.viewed_sponsor = 1;
      setTimeout(() => {
        this.getMessages();
      }, 100);
    },
    sendMessage() {
      if (!this.newMessage) {
        this.$message.error("Please write a message");
      } else if (this.attendee.id == null) {
        this.$message.error("Please choose attendee");
      } else {
        this.$store.dispatch("chats/sendMessage", {
          receiver_id: this.attendee.id,
          message: this.newMessage
        })
        .then(res => {
          this.$message.success(res.data.message);
        })
        .catch(err => {
          this.$message.error(err);
        });
        this.newMessage = null;
        this.getMessages();
      }
    },
    bindPusher() {
      console.log("Binding Pusher...");

      var self = this;
      var channel = pusher.subscribe(process.env.PUSHER_CHANNEL);
      channel.bind("chat", function() {
        self.getMessages();
      });
    },
    exportChatReport() {
      disableButton('.btn-export-chat', true)
			this.$store.dispatch("chats/export", this.user.sponsor.id)
			.then(res => {
				const url = URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', "chat_report.xlsx")
        document.body.appendChild(link)
        link.click()  
        document.body.removeChild(link)
				disableButton('.btn-export-chat', false)
			})
			.catch(err => {
				this.$message.error('Could not export the file. Please contact the site admin.')
				disableButton('.btn-export-chat', false)
			})
    },
    exportVisitorsOnlyReport() {
      disableButton('.btn-export-visitors-only', true)
			this.$store.dispatch("chats/exportVisitorsOnly", this.user.sponsor.id)
			.then(res => {
				const url = URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', "visitors_only_report.xlsx")
        document.body.appendChild(link)
        link.click()  
        document.body.removeChild(link)
				disableButton('.btn-export-visitors-only', false)
			})
			.catch(err => {
				this.$message.error('Could not export the file. Please contact the site admin.')
				disableButton('.btn-export-visitors-only', false)
			})
    }
  },
  async fetch() {
    this.setNavbarTitle("Chat");
    this.setNavbarSubpageTitle("");
    this.setNavbarIcon('');

    this.getAttendees();
    this.getSponsor();
    this.bindPusher();
  }
};
</script>
<style lang="scss" scoped>
// chat box start
#chat {
  position: relative;
  margin-bottom: 2rem;
  height: 800px;
}
.chat-box {
  position: relative;
  //   right: 1rem;
  height: 80vh;
  // width: 80vw;
  //   width: 200px;
  //   bottom: calc((-80vh) + 80px);
  &.open {
    width: 80vw;
    // bottom: 6rem;
    // background-color: red;
  }

  .list {
    scrollbar-width: thin;
    overflow-y: scroll;
    overflow-x: hidden;
    &::-webkit-scrollbar-track {
      // border: 1px solid #000;
      padding: 1px 0;
      background-color: rgb(187, 187, 187);
    }

    &::-webkit-scrollbar {
      width: 5px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      background-color: #737272;
      border: 1px solid #000;
    }
  }
}
@media (max-width: 992px) {
  .chat-box {
    // position: fixed;
    // right: 0;
    min-height: 80vh;
    // width: 200px;
    width: 95vw;
    margin-bottom: 20vh;
    // bottom: calc((-80vh) + 80px);
    &.open {
      width: 100vw;
      //   bottom: 8rem;
      // background-color: red;
    }

    &-attendee {
      min-height: 70vh;
    }
    .list {
      scrollbar-width: none;
      overflow-y: scroll;
    }
  }
}
// chat box end
ul.list {
  li {
    width: 100%;
    padding: 0.7rem;
    margin: 0.1rem;
    &:hover {
      background-color: #eeeeee;
      cursor: pointer;
    }
  }
  .status {
    font-weight: 600;
    font-size: 0.8rem;
  }
  .name {
    font-weight: 400;
  }
}
.chat {
  width: 100%;
  float: left;
  background: #ffffff;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  color: #434651;
  padding: 0;
}

.chat .chat-header {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.chat .chat-header img {
  float: left;
  border-radius: 50%;
  width: 60px;
  border: 2px solid #eee;
}

.chat .chat-header .chat-about {
  float: left;
  padding-left: 10px;
  margin-top: 6px;
}

.chat .chat-header .chat-with {
  font-weight: bold;
  font-size: 16px;
}

.chat .chat-header .chat-num-messages {
  color: #000;
}

.chat .chat-header .fa-star {
  float: right;
  color: #d8dadf;
  font-size: 20px;
  margin-top: 12px;
}

.chat .chat-history {
  padding: 30px 30px 30px;
  border-bottom: 1px solid #eee;
  overflow-y: scroll;
  height: 567px;
}

.chat .chat-history ul li {
  list-style: none;
}

.chat .chat-history .message-data {
  margin-bottom: 15px;
}

.chat .chat-history .message-data-time {
  color: #141414;
  padding-left: 6px;
  font-size: 9px;
}

.chat .chat-history .message {
  color: white;
  padding: 18px 20px;
  line-height: 26px;
  font-size: 16px;
  border-radius: 7px;
  margin-bottom: 30px;
  width: 90%;
  position: relative;
}

.chat .chat-history .message:after {
  bottom: -20px;
  left: auto;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
  border-top-color: #4875b4;
  border-width: 10px;
  margin-left: -10px;
}
.chat .chat-history .my-message {
  background: #4875b4;
}
.chat .chat-history .other-message {
  background: #48b467;
}
.chat .chat-history .other-message:after {
  border-top-color: #48b467;
  left: 93%;
}

.chat .chat-message {
  padding: 30px;
}

.chat .chat-message textarea {
  width: 100%;
  border: none;
  padding: 10px 20px;
  margin-bottom: 10px;
  border-radius: 5px;
  resize: none;
  background: #eee;
  color: #111;
}

.chat .chat-message .fa-file-o,
.chat .chat-message .fa-file-image-o {
  font-size: 16px;
  color: gray;
  cursor: pointer;
}

.chat .chat-message button {
  float: right;
  // color: #fff;
  font-size: 14px;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  font-weight: 500;
  // background: #94c2ed;
  padding: 10px 20px;
  border-radius: 5px;
}

// .chat .chat-message button:hover {
// color: #75b1e8;
// }

.list-nav{
  overflow-y: scroll;
  height:600px;
}

.online,
.offline,
.me {
  margin-right: 3px;
  font-size: 10px;
}

.online {
  color: #4875b4;
}

.offline {
  color: #fe7a15;
}

.me {
  color: #94c2ed;
}

.align-left {
  text-align: left;
}

.align-right {
  text-align: right;
}

.float-right {
  float: right;
}

.clearfix:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: " ";
  clear: both;
  height: 0;
}

@media (max-width: 767px) {
  .people-list {
    width: 100%;
  }
  .chat {
    width: 100%;
  }
  .chat-history {
    padding: 15px 15px 15px;
  }
  .chat-history ul {
    margin: 0;
    padding: 0;
  }
  .chat .chat-history .message:after {
    display: none;
  }
  .chat .other-message:after {
    display: none;
  }
  .bg-unviewed {
    background-color: #d2e0e0;
  }
}
</style>
