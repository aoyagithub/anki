<template>
  <div id="add" class="add">
    <div class="input-wrap">
      <input
        type="text"
        class="add-input add-english"
        placeholder="English"
        v-model="english"
        @keydown.enter="addWord"
        ref="inputEn"
      />
      <input
        type="text"
        class="add-input add-japanese"
        placeholder="Japanese"
        v-model="japanese"
        @keydown.enter="addWord"
        ref="inputJa"
      />
      <select class="add-select pc" ref="selectPOS_pc">
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
      @keydown.enter="addWord"
      v-model="memo"
      class="add-memo"
      placeholder="memo"
      ref="memo"
    />
    <button class="pc" type="button" @click="addWord">Add</button>
    <div class="add-button-wrap sp">
      <select class="add-select" ref="selectPOS_sp">
        <option value="pos">Part of Speech</option>
        <option
          v-for="option in posOptions"
          :value="option.abbrev"
          :key="option.full"
          >{{ option.full }}</option
        >
      </select>
      <button type="button" @click="addWord">Add</button>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import firebase from "firebase/app";

export default {
  name: "Add",
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
    ...mapActions(["getUser", "desktop"]),
    addWord(e) {
      const inputEn = this.$refs.inputEn;
      const inputJa = this.$refs.inputJa;
      let selectPOS = null;
      this.$store.getters.desktop
        ? (selectPOS = this.$refs.selectPOS_pc)
        : (selectPOS = this.$refs.selectPOS_sp);
      const inputValueEn = inputEn.value;
      const inputValueJa = inputJa.value;
      let selectedPOS = selectPOS.value;
      if (selectedPOS == "pos") selectedPOS = null;

      if (inputValueEn != "" && inputValueJa != "") {
        const kanjiHenkan = 229;
        if (e.keyCode === kanjiHenkan) {
          return;
        } else {
          const signInState = this.$store.getters.signInState;
          if (signInState) {
            const userEmail = this.$store.state.user.email;
            firebase
              .firestore()
              .collection(userEmail)
              .add({
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
                inputEn.focus();
              });
          } else {
            const provider = new firebase.auth.GoogleAuthProvider();
            firebase
              .auth()
              .signInWithPopup(provider)
              .then((result) => {
                const user = result.user;
                this.getUser(user);
                const userEmail = this.$store.state.user.email;
                firebase
                  .firestore()
                  .collection(userEmail)
                  .add({
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
                    inputEn.focus();
                  });
              })
              .catch((error) => {
                console.log(error);
              });
          }
        }
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
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
.add {
  padding-bottom: 30px;
}
.input-wrap {
  margin-top: 0;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
}
input {
  padding: 6px 10px;
  font-size: 22px;
  border-radius: 8px;
  border: 2px solid #fff;
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-weight: bold;
}
.add-select {
  padding: 6px 10px;
  font-size: 22px;
  border-radius: 8px;
  border: 2px solid #fff;
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-weight: bold;
  width: 20%;
  -webkit-appearance: none;
  appearance: none;
  
  background-image: url(~@/assets/images/arrow.svg);
  background-position: right 10px center;
  background-repeat: no-repeat;
  background-size: 13px 13px;
}  
.add-memo {
  display: block;
  margin-bottom: 30px;
  width: 100%;
  padding: 6px 10px;
  font-size: 22px;
  border-radius: 8px;
  border: 2px solid #fff;
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-weight: bold;
}
.add-memo::placeholder {
  color: #fff;
}
.add-input {
  width: 38%;
}
input::placeholder {
  color: #fff;
}
.h2 {
  margin-bottom: 30px;
}

@media screen and (max-width: 768px) {
  input + input {
    margin-left: 0;
  }
  .input-wrap {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    margin-bottom: 10px;
  }
  .add {
    flex-direction: column;
  }
  .add-input {
    width: 48%;
  }
  .add-select {
    width: 48%;
    font-size: 16px;
    margin: 0;
  }
  .add-input {
    font-size: 16px;
  }
  .add-memo {
    font-size: 16px;
    margin-bottom: 10px;
  }
  .add {
    padding-top: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  button {
    width: 50%;
    font-size: 20px;
    height: 40px;
    padding: 0;
    line-height: 40px;
  }
  .add-button-wrap {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
