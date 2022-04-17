<template>
  <div
    class="flashcard inner"
    :class="{ 'showing-chart': showChart, desktop }"
    :style="height"
  >
    <transition name="fade">
      <div :class="{ chart: showChart }">
        <div class="close" v-if="showChart" @click="clickClose" />
        <Chart v-if="showChart" :data="chartData" :style="chartHeight" />
      </div>
    </transition>
    <div v-if="flashcard" class="flashcard-area">
      <p
        v-if="flashcard[listIndex]"
        id="flashcardEn"
        class="flashcard-item flashcard-en"
        :data-key="flashcard[listIndex].id"
      >
        {{ flashcard[listIndex].english }}
        <span v-if="flashcard[listIndex].pos" class="flashcard-pos"
          >({{ flashcard[listIndex].pos }})</span
        >
      </p>
      <p
        v-if="flashcard[listIndex]"
        id="flashcardJa"
        class="flashcard-item flashcard-ja"
        v-show="show"
      >
        {{ flashcard[listIndex].japanese }}
      </p>
    </div>
    <div v-if="flashcard[listIndex]" class="pager">
      {{ listIndex + 1 }}/{{ flashcard.length }}
    </div>
    <ul class="buttons">
      <li class="button-item button-item-back">
        <button id="buttonBack" class="button" @click="clickBack" disabled>
          Back
        </button>
      </li>

      <li class="button-item button-item-answer">
        <button id="buttonAnswer" class="button" @click="clickAnswer">
          {{ answer }}
        </button>
      </li>
      <li class="button-item button-item-wrong">
        <button
          v-show="showButtons"
          id="buttonWrong"
          class="button"
          @click="clickWrong"
        >
          Wrong
        </button>
      </li>
      <li class="button-item button-item-correct">
        <button
          v-show="showButtons"
          id="buttonCorrect"
          class="button"
          @click="clickCorrect"
        >
          Correct
        </button>
      </li>
      <li v-show="restart" class="button-item button-item-restart">
        <button class="button" @click="clickRestart">
          Shuffle and Restart
        </button>
      </li>
      <li v-show="chartBtn" class="button-item button-item-chart">
        <button id="buttonChart" class="button" @click="clickChartBtn">
          See Chart
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import firebase from "firebase/app";
import Chart from "./Chart.vue";

export default {
  name: "Flashcard",
  components: {
    Chart,
  },
  data() {
    return {
      flashcard: [],
      listIndex: 0,
      show: false,
      answer: "See Answer",
      unsubscribe: null,
      restart: false,
      chartBtn: false,
      headerHeight: null,
      data: [],
      chartData: [0, 0],
      showButtons: false,
    };
  },
  computed: {
    showChart() {
      return this.$store.getters.chart;
    },
    desktop() {
      return this.$store.getters.desktop;
    },
    height() {
      const documentHeight = this.$store.getters.window.height;
      const headerHeight = this.headerHeight;
      const height = `height: ${documentHeight - headerHeight * 2}px`;
      return height;
    },
    chartHeight() {
      const documentHeight = this.$store.getters.window.height;
      const headerHeight = this.headerHeight;
      const paddingY = 40;
      const height = `height: ${documentHeight -
        headerHeight * 2 -
        paddingY}px`;
      return height;
    },
  },
  updated() {
    const buttonBack = document.getElementById("buttonBack");
    const lastOfList = this.flashcard.length - 1;
    this.listIndex != 0
      ? (buttonBack.disabled = false)
      : (buttonBack.disabled = true);
    if (this.listIndex == lastOfList) {
      if (this.show === false) {
        this.showButtons = false;
      }
    } else {
      if (this.show === false) {
        this.showButtons = false;
      }
      this.restart = false;
      this.chartBtn = false;
    }
  },
  methods: {
    ...mapActions(["getCurrentPath", "chart", "changeOverlay"]),
    clickAnswer: function() {
      this.show = !this.show;
      if (this.show) {
        this.answer = "Hide Answer";
        this.showButtons = true;
      } else {
        this.answer = "See Answer";
        this.showButtons = false;
      }
    },
    clickWrong: function() {
      const buttonWrong = document.getElementById("buttonWrong");
      const buttonCorrect = document.getElementById("buttonCorrect");
      const lastOfList = this.flashcard.length - 1;
      this.data[this.listIndex] = "wrong";
      if (this.listIndex !== lastOfList) {
        this.listIndex++;
        this.show = false;
        this.answer = "See Answer";
      } else {
        this.restart = true;
        this.chartBtn = true;
        buttonWrong.disabled = true;
        buttonCorrect.disabled = true;
      }
    },
    clickCorrect: function() {
      const buttonWrong = document.getElementById("buttonWrong");
      const buttonCorrect = document.getElementById("buttonCorrect");
      const lastOfList = this.flashcard.length - 1;
      this.data[this.listIndex] = "correct";
      if (this.listIndex !== lastOfList) {
        this.listIndex++;
        this.show = false;
        this.answer = "See Answer";
      } else {
        this.restart = true;
        this.chartBtn = true;
        buttonWrong.disabled = true;
        buttonCorrect.disabled = true;
      }
    },
    clickBack: function() {
      const buttonWrong = document.getElementById("buttonWrong");
      const buttonCorrect = document.getElementById("buttonCorrect");
      buttonWrong.disabled = false;
      buttonCorrect.disabled = false;
      this.listIndex--;
      this.show = false;
      this.answer = "See Answer";
    },
    clickRestart: function() {
      this.show = false;
      this.answer = "See Answer";
      const buttonWrong = document.getElementById("buttonWrong");
      const buttonCorrect = document.getElementById("buttonCorrect");
      buttonWrong.disabled = false;
      buttonCorrect.disabled = false;
      for (let i = 0, l = this.flashcard.length; i < l; ++i) {
        this.flashcard[i] = [this.flashcard[i], Math.random()];
      }
      this.flashcard.sort(function(a, b) {
        return a[1] - b[1];
      });
      for (let i = 0, l = this.flashcard.length; i < l; ++i) {
        this.flashcard[i] = this.flashcard[i][0];
      }
      this.listIndex = 0;
      this.data = [];
      this.chartData = [0, 0];
    },
    getList() {
      const userEmail = this.$store.getters.user.email;
      firebase
        .firestore()
        .collection(userEmail)
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
          for (let i = 0, l = list.length; i < l; ++i) {
            list[i] = [list[i], Math.random()];
          }
          list.sort(function(a, b) {
            return a[1] - b[1];
          });
          for (let i = 0, l = list.length; i < l; ++i) {
            list[i] = list[i][0];
          }
          this.flashcard = list;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    clickChartBtn() {
      (this.chartData = [0, 0]),
        this.data.map((c) => {
          if (c === "correct") {
            this.chartData[0] += 1;
          } else {
            this.chartData[1] += 1;
          }
        });
      this.chart(true);
      this.changeOverlay(true);
    },
    clickClose() {
      this.changeOverlay(false);
      this.chart(false);
    },
  },
  mounted() {
    this.headerHeight = document.getElementById("header").clientHeight;
    this.getCurrentPath(this.$route.path);
    this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase
          .firestore()
          .collection(user.email)
          .onSnapshot(() => {
            this.getList();
          });
      }
    });
  },
  beforeDestroy() {
    this.unsubscribe();
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
h2 {
  margin-bottom: 1.5em;
}
.flashcard {
  position: relative;
}
.flashcard.showing-chart > .flashcard-area,
.flashcard.showing-chart > .buttons {
  filter: blur(30px);
}
.flashcard-area {
  height: 120px;
}
.flashcard-item {
  font-weight: 700;
}
.flashcard-en {
  font-size: 40px;
  margin-bottom: 0.25em;
}
.flashcard-ja {
  font-size: 30px;
}
.buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 70%;
  margin-right: auto;
  margin-left: auto;
}
.button-item {
  height: 90px;
  width: 50%;
  margin-bottom: 20px;
  display: block;
  margin-right: 0;
  margin-left: 0;
  padding-left: 1%;
  padding-right: 1%;
}
.button {
  width: 100%;
  height: 100%;
  line-height: 1.2;
}
.button-item .button {
  display: inline-block;
}
.flashcard-pos {
  font-size: 34px;
}
.pager {
  font-size: 20px;
  line-height: 2;
  margin-bottom: 0.5em;
  opacity: 0.8;
}
@media screen and (max-width: 768px) {
  .buttons {
    width: 100%;
  }
  .button-item {
    height: 70px;
  }
}
@media screen and (max-width: 428px) {
  .button-item .button {
    font-size: 23px;
  }
}
</style>
