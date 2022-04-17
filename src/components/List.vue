<template>
  <div class="list inner" :class="{ editing: editState }">
    <Add />
    <transition name="fade">
      <Edit v-show="editState" ref="edit" @clearSelected="clearSelected" />
    </transition>
    <div class="list-wrap" :style="listHeight">
      <div class="list-wrap-mobile">
        <ol class="list-area list-area-heading">
          <li class="list-area-item heading">
            <div class="list-area-item-inner">
              <div class="list-area-number">#</div>
              <dl class="list-dl pc">
                <dt class="list-item list-english">English</dt>
                <dd class="list-item list-japanese">Japanese</dd>
                <dd class="list-item list-pos">Part of Speech</dd>
                <dd class="list-item list-memo">Memo</dd>
              </dl>
              <dl class="list-dl sp">
                <dt class="list-item list-english">English</dt>
                <dd class="list-item list-japanese">Japanese</dd>
                <!-- <dd class="list-item list-pos">POS</dd>
                <dd class="list-item list-memo">Memo</dd> -->
              </dl>
              <div class="list-area-checkbox">
                <span class="list-item-check">✅</span>
              </div>
            </div>
          </li>
        </ol>
        <div id="listAreaWrap" class="list-area-wrap" :class="{ scrollable }">
          <ol id="listArea" class="list-area">
            <li
              class="list-area-item"
              v-for="(item, key) in list"
              :key="key"
              :class="{ checked: checkboxBool[list.length - key] }"
            >
              <label
                :for="`checkbox_${item.id}`"
                class="list-area-item-inner list-area-item-label"
              >
                <div class="list-area-number">{{ list.length - key }}</div>
                <dl class="list-dl pc">
                  <dt class="list-item list-english">{{ item.english }}</dt>
                  <dd class="list-item list-japanese">{{ item.japanese }}</dd>
                  <dd v-if="!item.pos" class="list-item list-pos">-</dd>
                  <dd v-else class="list-item list-pos">{{ item.pos }}</dd>
                  <dd class="list-item list-memo">{{ item.memo }}</dd>
                </dl>
                <dl class="list-dl sp">
                  <dt class="list-item list-english">{{ item.english }}</dt>
                  <dd class="list-item list-japanese">{{ item.japanese }}</dd>
                  <!-- <dd v-if="!item.pos" class="list-item list-pos">-</dd>
                  <dd v-else class="list-item list-pos">{{item.pos}}</dd> -->
                  <dd
                    v-show="item.pos || item.memo"
                    class="list-item list-memo"
                  >
                    <span
                      v-show="item.pos"
                      class="list-memo-pos"
                      :class="{ active: item.pos }"
                      >({{ item.pos }})</span
                    >
                    <span
                      v-show="item.memo"
                      class="list-memo-memo"
                      :class="{ active: item.memo }"
                      >{{ item.memo }}</span
                    >
                  </dd>
                </dl>
                <div class="list-area-checkbox">
                  <input
                    type="checkbox"
                    :id="`checkbox_${item.id}`"
                    name="item"
                    class="list-item-checkbox"
                    v-model="checkboxBool[list.length - key]"
                    :data-key="item.id"
                  />
                  <label
                    :for="`checkbox_${item.id}`"
                    class="list-item-checkbox-label"
                  ></label>
                </div>
              </label>
            </li>
          </ol>
        </div>
      </div>
      <div class="list-buttons">
        <button
          :disabled="disableEditButton"
          type="button button-edit"
          @click="editItem"
        >
          Edit
        </button>
        <button
          :disabled="disableDeleteButton"
          type="button button-delete"
          @click="deleteMessage"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import firebase from "firebase/app";
import Add from "./Add.vue";
import Edit from "./Edit.vue";

export default {
  name: "List",
  components: {
    Add,
    Edit,
  },
  data() {
    return {
      checkboxBool: {},
      list: [],
      scrollable: false,
      disableEditButton: true,
      disableDeleteButton: true,
      headerHeight: null,
      addHeight: null,
    };
  },
  computed: {
    editState() {
      return this.$store.getters.edit.state;
    },
    listHeight() {
      const documentHeight = this.$store.getters.window.height;
      const headerHeight = this.headerHeight;
      const addHeight = this.addHeight;
      const listHeight = documentHeight - headerHeight - addHeight;
      this.$store.dispatch("listHeight", listHeight);
      const listHeightStyle = `height: ${listHeight}px`;
      return listHeightStyle;
    },
  },
  updated() {
    this.listStyle();
    const checkedItem = document.querySelectorAll("input[name=item]:checked");
    checkedItem.length > 0
      ? (this.disableDeleteButton = false)
      : (this.disableDeleteButton = true);
    checkedItem.length === 1
      ? (this.disableEditButton = false)
      : (this.disableEditButton = true);
  },
  methods: {
    ...mapActions(["getCurrentPath", "changeOverlay", "edit"]),
    clearSelected() {
      this.checkboxBool= {}
    },
    editItem() {
      const checkedItem = document.querySelectorAll("input[name=item]:checked");
      if (checkedItem.length === 1) {
        const checkedItemKey = checkedItem[0].dataset.key;
        this.changeOverlay(true);
        this.edit({ state: true, item: checkedItemKey });
        this.$refs.edit.setItem();
      } else {
        this.changeOverlay(false);
        this.edit({ state: false, item: null });
      }
    },
    deleteMessage() {
      const checkedItem = document.querySelectorAll("input[name=item]:checked");
      const userEmail = this.$store.getters.user.email;
      if (0 < checkedItem.length) {
        if (1 < checkedItem.length) {
          const confirm = window.confirm(
            "Are you sure you want to delete these items?"
          );
          if (confirm) {
            for (let i = 0; i < checkedItem.length; i++) {
              firebase
                .firestore()
                .collection(userEmail)
                .doc(checkedItem[i].dataset.key)
                .delete();
            }
          }
        } else {
          const confirm = window.confirm(
            "Are you sure you want to delete this item?"
          );
          if (confirm) {
            firebase
              .firestore()
              .collection(userEmail)
              .doc(checkedItem[0].dataset.key)
              .delete();
          }
        }
      }
      this.clearSelected()
    },
    getList() {
      const userEmail = this.$store.getters.user.email;
      firebase
        .firestore()
        .collection(userEmail)
        .orderBy("time", "desc")
        .get()
        .then((querySnapshot) => {
          let list = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            const id = doc.id;
            list.push({
              english: data.english,
              japanese: data.japanese,
              pos: data.selectedPOS,
              memo: data.memo,
              id: id,
            });
          });
          this.list = list;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    clearList() {
      this.list = [];
    },
    listStyle() {
      const listAreaWrapHeight = document.getElementById("listAreaWrap")
        .clientHeight;
      const listAreaHeight = document.getElementById("listArea").clientHeight;
      listAreaWrapHeight < listAreaHeight
        ? (this.scrollable = true)
        : (this.scrollable = false);
    },
  },
  mounted() {
    this.$store.getters.window.height;
    this.headerHeight = document.getElementById("header").clientHeight;
    this.addHeight = document.getElementById("add").clientHeight;
    this.getCurrentPath(this.$route.path);
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase
          .firestore()
          .collection(user.email)
          .onSnapshot(() => {
            this.getList();
          });
      } else {
        this.clearList();
      }
    });
    this.listStyle();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.list {
  position: relative;
}
.list.editing > .list-wrap,
.list.editing > .add {
  filter: blur(10px);
}
.list-area {
  padding: 0;
  display: flex;
  flex-direction: column;
  margin-block-start: 0;
  margin-block-end: 0;
}
.list-area-item-inner {
  display: flex;
  align-items: center;
  width: 100%;
}
.list-dl {
  display: flex;
  margin-top: 0;
  margin-bottom: 0;
  width: 90%;
}
.list-area-item:first-child {
  border-bottom: 2px solid #fff;
}
.list-area-item {
  border-right: 2px solid #fff;
  border-left: 2px solid #fff;
  width: 100%;
  margin: 0;
}
.list-area-item.heading {
  border-top: 2px solid #fff;
  border-bottom: 2px solid #fff;
}
.list-area-item.heading .list-item {
  font-weight: 700;
  font-size: 22px;
}
.list-area-item + .list-area-item {
  border-bottom: 2px solid #fff;
}
.list-area-number {
  width: 5%;
}
.list-item {
  border-right: 2px solid #fff;
  width: 50%;
  padding: 4px;
  font-size: 20px;
}
dt.list-item.list-english {
  border-left: 2px solid #fff;
}
dd.list-item.list-japanese {
  margin-inline-start: 0;
}
.list-area-checkbox {
  width: 5%;
}
.list-area-item-label {
  cursor: pointer;
}
.list-area-item.checked {
  background-color: rgba(255, 255, 255, 0.2);
}
.list-wrap {
  width: 100%;
  padding-bottom: 40px;
}
.list-area-wrap {
  height: calc(100% - 75px);
  overflow: auto;
  width: 100%;
}
.list-area-wrap .list-area-item {
  border-right: none;
  border-left: none;
}
.list-area-wrap {
  border-bottom: 2px solid #fff;
  border-right: 2px solid #fff;
  border-left: 2px solid #fff;
}
.list-area-wrap .list-area {
  overflow-y: scroll;
}
.list-item-checkbox {
  cursor: pointer;
}
.list-item-checkbox {
  display: none;
}
.list-item-checkbox + .list-item-checkbox-label {
  display: block;
  position: relative;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
.list-item-checkbox + .list-item-checkbox-label::before {
  content: "";
  display: block;
  width: 20px;
  height: 20px;
  border: 2px solid #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  -webkit-transition: all 0.12s, border-color 0.08s;
  transition: all 0.12s, border-color 0.08s;
}
.list-item-checkbox:checked + .list-item-checkbox-label::before {
  width: 11px;
  height: 18px;
  left: 34%;
  top: -5px;
  border-width: 3px;
  border-radius: 2px;
  border-top-color: transparent;
  border-left-color: transparent;
  -webkit-transform: rotate(45deg) translate(-25%, -50%);
  transform: rotate(45deg) translate(-25%, -50%);
}
.list-wrap-mobile {
  height: calc(100% - 49px);
}
.list-area-heading {
  height: 45px;
}
.button-delete {
  height: 49px;
}
.list-area-wrap.scrollable .list-area-item:last-child {
  border-bottom: none;
}
.list-buttons {
  display: flex;
  justify-content: space-between;
  margin-right: auto;
  margin-left: auto;
  width: 430px;
}
@media screen and (min-width: 769px) {
  .list-dl.sp {
    display: none;
  }
  .list-item-card {
    display: block;
  }
}
@media screen and (max-width: 768px) {
  .list-dl.pc {
    display: none;
  }
  .list-area-heading {
    height: 36px;
  }
  button {
    width: 170px;
    font-size: 20px;
  }
  .list-area-item.heading .list-item {
    font-size: 16px;
  }
  .list-item {
    font-size: 14px;
  }
  .list-area-number {
    font-size: 14px;
  }
  .list-area-number,
  .list-area-checkbox {
    width: 7%;
  }
  .list-dl {
    width: 86%;
    flex-wrap: wrap;
  }
  .list-wrap {
    height: calc(100vh - 360px);
    padding-bottom: 30px;
  }
  .list-wrap-mobile {
    height: calc(100% - 46px);
    padding-bottom: 30px;
  }
  .list-area-wrap {
    height: calc(100% - 36px);
    margin-bottom: 0;
  }
  .list-area-wrap .list-area-item {
    overflow-x: hidden;
  }
  .list-item-checkbox + .list-item-checkbox-label::before {
    width: 18px;
    height: 18px;
  }
  .list-item-checkbox:checked + .list-item-checkbox-label::before {
    width: 9px;
    height: 16px;
    left: 15%;
    top: -4px;
  }
  .list-item-check {
    font-size: 15px;
  }
  .list-item-card {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #fff;
    height: 100px;
  }
  .list-item.list-english,
  .list-item.list-japanese {
    width: 50%;
  }
  .list-item.list-memo {
    width: 100%;
    border-top: 2px solid #fff;
    border-left: 2px solid #fff;
  }
  .list-memo-pos.active + .list-memo-memo.active {
    margin-left: 1em;
  }
  .list-buttons button {
    width: 160px;
  }
}
@media screen and (max-width: 428px) {
  .list-buttons {
    width: 100%;
  }
}
</style>
