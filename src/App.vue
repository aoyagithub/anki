<template>
  <div id="app" class="app-anki" :style="height">
    <Header @overlay="activateOverlay" @overlayOut="overlayOut" ref="header" />
    <router-view></router-view>
    <div class="overlay" :class="{ active }" @click="deactivateOverlay"></div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import Header from "./components/Header.vue";

export default {
  name: "App",
  components: {
    Header,
  },
  computed: {
    active() {
      return this.$store.getters.overlay;
    },
    height() {
      const documentHeight = this.$store.getters.window.height;
      const height = `height: ${documentHeight}px`;
      return height;
    },
  },
  methods: {
    ...mapActions(["changeOverlay", "edit", "window", "chart"]),
    activateOverlay() {
      this.changeOverlay(true);
    },
    deactivateOverlay() {
      this.changeOverlay(false);
      this.chart(false);
      this.edit({ state: false, item: null });
      this.$refs.header.accountMenuOut();
    },
    overlayOut() {
      this.changeOverlay(false);
      this.edit({ state: false, item: null });
    },
    windowSize() {
      const documentHeight = document.documentElement.clientHeight;
      const documentWidth = document.documentElement.clientWidth;
      this.window({ height: documentHeight, width: documentWidth });
    },
  },
  mounted() {
    this.windowSize();
    window.addEventListener("resize", this.windowSize);
  },
  beforeDestroy() {
    window.addEventListener("resize", this.windowSize);
  },
};
</script>

<style>
@import "./assets/css/reset.css";
* {
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;
  font-size: 18px;
}
a {
  text-decoration: none;
  margin-right: 1em;
  color: #fff !important;
  font-weight: bold;
}
h1 a span {
  display: block;
  color: #fff;
}
html,
body {
  overflow: hidden;
}

body {
  background: linear-gradient(-135deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 10000% 10000%;
  animation: gradient 15s ease infinite;
  background-color: rgb(44, 62, 80);
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
.inner {
  width: 95%;
  max-width: 1200px;
  margin-right: auto;
  margin-left: auto;
}
button {
  font-size: 22px;
  font-weight: bold;
  color: #fff;
  border: none;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  padding: 8px 0;
  width: 200px;
  cursor: pointer;
  transition: all 0.3s ease 0s;
}
button:disabled {
  background-color: rgba(255, 255, 255, 0.1);
  cursor: default;
}
button:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(2px);
}
button:disabled:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: none;
}
input:focus,
button:focus {
  outline: none;
}
.app-anki {
  position: relative;
}
.overlay {
  display: none;
}
.overlay.active {
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 5;
}
.close {
  display: inline-block;
  height: 26px;
  width: 26px;
  position: absolute;
  cursor: pointer;
}
.close::before {
  content: "";
  background-color: #fff;
  border-radius: 20px;
  display: inline-block;
  height: 3px;
  position: absolute;
  width: 100%;
  top: 5px;
  left: 0;
  transform: translateY(7px) rotate(-135deg);
}
.close::after {
  content: "";
  background-color: #fff;
  border-radius: 20px;
  display: inline-block;
  height: 3px;
  position: absolute;
  width: 100%;
  top: 19px;
  left: 0;
  transform: translateY(-7px) rotate(135deg);
}
@media screen and (min-width: 769px) {
  .sp {
    display: none;
  }
}
@media screen and (max-width: 768px) {
  .pc {
    display: none;
  }
  .inner {
    width: 90%;
  }
}

body {
  overflow: hidden;
}
</style>
