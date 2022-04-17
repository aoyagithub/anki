<template>
  <div id="edit" class="edit">
    <div class="close" @click="closeEdit" />
    <h2 class="h2">Edit Item</h2>
    <div class="input-wrap">
      <input
        type="text"
        class="add-input add-english"
        placeholder="English"
        v-model="english"
        @keydown.enter="updateWord"
        ref="inputEnEdit"
      />
      <input
        type="text"
        class="add-input add-japanese"
        placeholder="Japanese"
        v-model="japanese"
        @keydown.enter="updateWord"
        ref="inputJaEdit"
      />
      <select class="add-select pc" ref="selectPOS_pcEdit">
        <option value="pos">Part of Speech</option>
        <option
          v-for="option in posOptions"
          :value="option.abbrev"
          :key="option.full"
          >{{ option.full }}</option
        >
      </select>
    </div>
    <input
      type="text"
      @keydown.enter="updateWord"
      v-model="memo"
      class="add-memo"
      placeholder="memo"
      ref="memoEdit"
    />
    <button class="pc" type="button" @click="updateWord">Update</button>
    <div class="add-button-wrap sp">
      <select class="add-select sp" ref="selectPOS_spEdit">
        <option value="pos">Part of Speech</option>
        <option
          v-for="option in posOptions"
          :value="option.abbrev"
          :key="option.full"
          >{{ option.full }}</option
        >
      </select>
      <button type="button" @click="updateWord">Update</button>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import firebase from "firebase/app";

export default {
  name: "Edit",
  data() {
    return {
      english: "",
      japanese: "",
      posOptions: [
        {
          full: "verb",
          abbrev: "v.",
        },
        {
          full: "noun",
          abbrev: "n.",
        },
        {
          full: "adjective",
          abbrev: "adj.",
        },
        {
          full: "adverb",
          abbrev: "adv.",
        },
        {
          full: "pronoun",
          abbrev: "pro.",
        },
        {
          full: "preposition",
          abbrev: "prep.",
        },
        {
          full: "conjunction",
          abbrev: "conj.",
        },
        {
          full: "interjection",
          abbrev: "interj.",
        },
        {
          full: "other",
          abbrev: "",
        },
      ],
      memo: "",
    };
  },
  methods: {
    ...mapActions(["edit", "changeOverlay"]),
    updateWord(e) {
      const inputEn = this.$refs.inputEnEdit;
      const inputJa = this.$refs.inputJaEdit;
      let selectPOS = null;
      this.$store.getters.desktop
        ? (selectPOS = this.$refs.selectPOS_pcEdit)
        : (selectPOS = this.$refs.selectPOS_spEdit);
      const inputValueEn = inputEn.value;
      const inputValueJa = inputJa.value;
      let selectedPOS = selectPOS.value;
      if (selectedPOS == "pos") selectedPOS = null;
      if (inputValueEn != "" && inputValueJa != "") {
        const kanjiHenkan = 229;
        if (e.keyCode === kanjiHenkan) {
          return;
        } else {
          const userEmail = this.$store.state.user.email;
          const editItem = this.$store.getters.edit.item;
          firebase
            .firestore()
            .collection(userEmail)
            .doc(editItem)
            .set({
              english: this.english,
              japanese: this.japanese,
              selectedPOS: selectedPOS,
              memo: this.memo,
              time: new Date().getTime(),
            })
            .then(() => {
              this.english = "";
              this.japanese = "";
              selectPOS.selectedIndex = 0;
              this.memo = "";
              this.edit({ state: false, item: null });
              this.changeOverlay(false);
              this.$emit("clearSelected");
            });
        }
      }
    },
    setItem() {
      const userEmail = this.$store.getters.user.email;
      const editItem = this.$store.getters.edit.item;
      const docRef = firebase
        .firestore()
        .collection(userEmail)
        .doc(editItem);
      docRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            const data = doc.data();
            this.english = data.english;
            this.japanese = data.japanese;
            let option = null;
            this.posOptions.map((c) => {
              if (c.abbrev === data.selectedPOS) {
                option = c.full;
              }
            });
            const select = document.querySelectorAll("#edit .add-select");
            const selectData = {};
            for (let i = 0; i < select[0].options.length; i++) {
              selectData[select[0].options[i].text] = i;
            }
            for (let i = 0; i < select.length; i++) {
              if (selectData[option]) {
                select[i].options[selectData[option]].selected = true;
              }
            }

            this.memo = data.memo;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    closeEdit() {
      this.changeOverlay(false);
      this.edit({ state: false, item: null });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.edit {
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translateX(-50%) translateY(-35%);
  width: 100%;
  z-index: 10;
  border: 2px solid #fff;
  padding: 20px 2%;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.12);
}
.edit .close {
  right: 24px;
  top: 20px;
}

@media screen and (max-width: 768px) {
  .h2 {
    margin-bottom: 18px;
  }
}
</style>
