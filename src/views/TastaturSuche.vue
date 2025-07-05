<template>
  <div class="container mt-4">
    <h1>Suchergebnisse für "{{ searchQuery }}"</h1>
    <div v-if="loading">Lade...</div>
    <div v-else-if="tastaturen.length === 0">Keine Ergebnisse gefunden.</div>
    <div v-else class="row row-cols-1 row-cols-md-3 g-4">
      <div class="col" v-for="t in tastaturen" :key="t.id ?? t.tastaturName">
        <div
            class="card h-100 shadow-sm rounded"
            style="width: 22rem; cursor: pointer;"
            @click="goToDetail(t.id)"
            role="button"
            tabindex="0"
            @keyup.enter="goToDetail(t.id)"
        >
          <img
              v-if="t.id"
              :src="getBildUrl(t.id)"
              :alt="t.tastaturName ?? 'Bild'"
              class="card-img-top"
          />
          <div class="card-body">
            <h5 class="card-title">{{ t.tastaturName ?? 'Unbekannt' }}</h5>
            <p class="card-text">{{ t.beschreibung ?? '' }}</p>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item"><strong>Modell:</strong> {{ t.modell ?? '–' }}</li>
            <li class="list-group-item"><strong>Switches:</strong> {{ t.switches ?? '–' }}</li>
            <li class="list-group-item"><strong>Keycaps:</strong> {{ t.keycaps ?? '–' }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TastaturSuche",
  data() {
    return {
      tastaturen: [],
      searchQuery: "",
      loading: false,
    };
  },
  methods: {
    async suche() {
      this.loading = true;
      try {
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_BASE_URL}/tastaturen?q=${encodeURIComponent(this.searchQuery)}`
        );
        if (!response.ok) throw new Error("Fehler beim Laden der Suchergebnisse");
        const daten = await response.json();
        this.tastaturen = Array.isArray(daten) ? daten : [];
      } catch (e) {
        console.error(e);
        this.tastaturen = [];
      } finally {
        this.loading = false;
      }
    },
    getBildUrl(id) {
      return id ? `${import.meta.env.VITE_BACKEND_BASE_URL}/tastaturen/${id}/bild` : "";
    },
    goToDetail(id) {
      if (id) this.$router.push({ name: "TastaturDetail", params: { id } });
    },
  },
  watch: {
    "$route.query.q": {
      immediate: true,
      handler(newQuery) {
        this.searchQuery = newQuery || "";
        if (this.searchQuery.trim() !== "") {
          this.suche();
        } else {
          this.tastaturen = [];
        }
      },
    },
  },
};
</script>
