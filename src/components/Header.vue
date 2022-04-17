<template>
  <header id="header" class="header inner" :class="{current_is_list: this.currentPath.list}">
    <h1>Anki</h1>
    <ul class="header-list">
      <li class="header-item">
        <router-link to="/" class="header-link" :class="{current: this.currentPath.flashcard}">Flashcard</router-link>
      </li>
      <li class="header-item">
        <router-link to="/list" class="header-link" :class="{current: this.currentPath.list}">List</router-link>
      </li>
    </ul>
    <div class="header-account">
      <button v-if="!hideSignInBottun" id="signIn" class="header-signin" @click="signIn">{{headerAccount.signIn}}</button>
      <div v-if="hideSignInBottun" @click="accountMenuIn" class="header-account-image-wrap">
        <img :src="headerAccount.image" :alt="headerAccount.displayName" class="header-account-image">
        <transition name="fade">
          <nav v-show="accountMenuToggle" class="header-account-nav" >
            <ul class="header-account-nav-list">
              <li class="header-account-nav-item header-account-nav-item-text">User: {{headerAccount.displayName}} </li>
              <li @click.stop="signOut" class="header-account-nav-item header-account-nav-item-button">Sign Out</li>
            </ul>
          </nav>
        </transition>
      </div>
    </div>
  </header>
</template>

<script>
import { mapActions } from 'vuex'
import firebase from "firebase/app";

export default {
  name: 'Header',
  data() {
    return {
      hideSignInBottun: false,
      accountMenuToggle: false,
    };
  },
  computed: {
    headerAccount() {
      const signInState = this.$store.getters.signInState
      const headerAccount = {}
      if(signInState) {
        headerAccount.signIn = this.$store.getters.user.displayName
        headerAccount.displayName = this.$store.getters.user.displayName
        headerAccount.image = this.$store.getters.user.providerData[0].photoURL
      } else {
        headerAccount.signIn = 'Sign in'
      }
      return headerAccount
    },
    currentPath() {
      const currentPathState = this.$store.getters.currentPath
      const currentPath = {}
      currentPath.flashcard = false
      currentPath.list = false
      if(currentPathState == '/list') {
        currentPath.list = true
      } else if(currentPathState == '/') {
        currentPath.flashcard = true
      }      
      return currentPath
    }
  },
  methods:{
    ...mapActions(['getUser','changeOverlay']),
    signIn() {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithPopup(provider)
        .then((result) => {
          const user = result.user
          this.getUser(user)
          this.hideSignInBottun = true
          this.accountMenuToggle = false
        }).catch((error) => {
          console.log(error)
        })
    },
    signOut() {
      firebase.auth().signOut()
          .then(() => {
            this.getUser(null)
            this.hideSignInBottun = false
          }).catch((error) => {
            console.log(error)
          })
      this.$emit('overlayOut')
    },
    accountMenuIn() {
      this.accountMenuToggle = true
      // this.$emit('overlay')
      this.changeOverlay(true);
    },
    accountMenuOut() {
      this.accountMenuToggle = false
    }
  },
  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.getUser(user)
        this.hideSignInBottun = true
      } 
    })
  },
}
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
h1 {
  position: absolute;
  left: 50%;
  top: 30px;
  transform: translateX(-50%);
  cursor: default;
}
.header {
  padding-top: 30px;
  /* margin-bottom: 30px; */
  padding-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}
.header-account-image-wrap {
  position: relative;
}
.header-account-nav::before,
.header-account-nav::after {
  position: absolute;
  display: inline-block;
  content: "";
  top: -20px;
  right: 13px;
}
.header-account-nav::after {
  border: 10px solid transparent;
  border-bottom-color: rgba(56, 52, 52 ,.75);
}
.header-account-nav {
  z-index: 10;
  position: absolute;
  top: 110%;
  right: 0;
  background-color: rgba(56, 52, 52 ,.75);
  color: #fff;
  width: 200px;
  border-radius: 6px;
}
.header-account-image {
  cursor: pointer;
  border-radius: 50%;
  margin-right: 0;
  margin-left: auto;
  width: 48px;
  height: 48px;
}
.header-account-nav-item {
  padding: 8px 16px;
  font-size: 18px;
  width: 100%;
  margin: 0;
  text-align: left;
}
.header-account-nav-item-text {
  border-bottom: 1px solid rgba(255, 255, 255, .75);
  cursor: default;
}
.header-account-nav-item-button {
  cursor: pointer;
  font-weight: bold;
}
.fade-leave-active,
.fade-enter-active {
  transition: opacity .3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.header-link.current {
  border-bottom: 2px solid #fff;
}
@media screen and (max-width: 428px) {
  .header {
    flex-wrap: wrap;
    padding-top: 10px;
  }
  h1 {
    position: static;
    left: auto;
    transform: none;
    width: 100%;
    display: block;
    margin-bottom: 10px;
  }
  .header-account {
    position: absolute;
    right: 0;
    top: 10px;
  }
  .header-list {
    width: 100%;
  }
  .header-signin {
    width: 76px;
    height: 42px;
    font-size: 18px;
    padding: 0;
  }
  .header.current_is_list {
    padding-bottom: 24px;
  }
}
</style>
