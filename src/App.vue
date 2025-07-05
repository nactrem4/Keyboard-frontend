<template>
  <div :data-theme="theme">
    <Navbar :theme="theme" @toggle-theme="toggleTheme" />
    <router-view />
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";

export default {
  components: { Navbar },
  data() {
    return {
      theme: "light", // default
    };
  },
  methods: {
    toggleTheme() {
      this.theme = this.theme === "light" ? "dark" : "light";
    },
  },
};
</script>

<style>
:root {
  --bg-color: white;
  --text-color: black;
  /* usw. */
}

[data-theme="dark"] {
  --bg-color: #121212;
  --text-color: #ddd;
  /* usw. */
}

body,
html,
#app,
[data-theme] {
  background-color: var(--bg-color);
  color: var(--text-color);
}

/* Beispiel für Karten, Buttons, Inputs, Navbar, etc. */

.card {
  background-color: var(--bg-color);
  color: var(--text-color);
  border: 1px solid #333;
}

/* ... mehr Styles hier oder importierte CSS */
</style>
