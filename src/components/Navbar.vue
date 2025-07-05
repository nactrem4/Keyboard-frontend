<template>
  <nav
      class="navbar navbar-expand-lg"
      :class="theme === 'dark' ? 'navbar-dark bg-dark' : 'navbar-light bg-light'"
  >
    <div class="container d-flex align-items-center">
      <!-- Link + Dark Mode Button nebeneinander -->
      <div class="d-flex align-items-center me-4">
        <router-link to="/" class="navbar-brand fw-bold me-3">TastaturFans</router-link>
        <button
            @click="$emit('toggle-theme')"
            class="btn btn-outline-secondary btn-sm"
            :title="theme === 'dark' ? 'Hellmodus aktivieren' : 'Dunkelmodus aktivieren'"
        >
          <span v-if="theme === 'dark'">🌞</span>
          <span v-else>🌙</span>
        </button>
      </div>

      <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <form class="d-flex mx-auto" @submit.prevent="onSearch">
          <input
              class="form-control me-2"
              type="search"
              placeholder="Tastatur suchen"
              aria-label="Search"
              v-model="searchQuery"
              required
          />
          <button class="btn btn-outline-primary" type="submit">Suchen</button>
        </form>

        <ul class="navbar-nav ms-auto mb-2 mb-lg-0 d-flex flex-row gap-2">
          <li class="nav-item">
            <router-link to="/tastaturen/create" class="btn btn-primary"
            >Erstellen</router-link
            >
          </li>
          <li class="nav-item">
            <router-link to="/tastaturen/verwalten" class="btn btn-outline-secondary"
            >Verwalten</router-link
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
  props: {
    theme: { type: String, default: "light" },
  },
  data() {
    return { searchQuery: "" };
  },
  methods: {
    onSearch() {
      this.$router.push({ path: "/TastaturSuche", query: { q: this.searchQuery } });
      this.searchQuery = "";
    },
  },
};
</script>

<style scoped>
.navbar-brand {
  font-size: 1.5rem;
}
</style>
