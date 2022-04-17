import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    list: [],
    shuffledList: [],
    currentPath: "",
    overlay: false,
    edit: {
      state: false,
      item: null,
    },
    window: {
      height: null,
      width: null,
    },
    desktop: true,
    chart: false,
    listHeight: null,
  },
  getters: {
    user(state) {
      return state.user;
    },
    list(state) {
      return state.list;
    },
    signInState(state) {
      return !!state.user;
    },
    shuffledList(state) {
      return state.shuffledList;
    },
    currentPath(state) {
      return state.currentPath;
    },
    overlay(state) {
      return state.overlay;
    },
    edit(state) {
      return state.edit;
    },
    window(state) {
      return state.window;
    },
    desktop(state) {
      return state.desktop;
    },
    chart(state) {
      return state.chart;
    },
    listHeight(state) {
      return state.listHeight;
    },
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setList(state, list) {
      state.list = list;
    },
    initializeList(state) {
      state.list = [];
    },
    shuffleList(state, list) {
      state.list = list;
    },
    setCurrentPath(state, path) {
      state.currentPath = path;
    },
    setOverlay(state, bool) {
      state.overlay = bool;
    },
    setEdit(state, obj) {
      state.edit.state = obj.state;
      state.edit.item = obj.item;
    },
    setWindow(state, obj) {
      state.window.height = obj.height;
      state.window.width = obj.width;
    },
    setDesktop(state, bool) {
      state.desktop = bool;
    },
    setChart(state, bool) {
      state.chart = bool;
    },
    setListHeight(state, listHeight) {
      state.listHeight = listHeight;
    },
  },
  actions: {
    getUser(context, user) {
      context.commit("setUser", user);
    },
    getCurrentPath(context, path) {
      context.commit("setCurrentPath", path);
    },
    changeOverlay(context, bool) {
      context.commit("setOverlay", bool);
    },
    edit(context, { state, item }) {
      const obj = {};
      obj.state = state;
      obj.item = item;
      context.commit("setEdit", obj);
    },
    window(context, { height, width }) {
      const obj = {};
      obj.height = height;
      obj.width = width;
      context.commit("setWindow", obj);

      const breakpoint = 768;
      let desktop = true;
      width > breakpoint ? (desktop = true) : (desktop = false);
      context.commit("setDesktop", desktop);
    },
    chart(context, bool) {
      context.commit("setChart", bool);
    },
    listHeight(context, listHeight) {
      context.commit("setListHeight", listHeight);
    },
  },
});
