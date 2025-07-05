<template>
  <div class="container mt-4">
    <h2 class="mb-4 text-center">Tastaturen verwalten</h2>

    <div v-if="tastaturen.length === 0" class="alert alert-info text-center">
      Keine Tastaturen gefunden.
    </div>

    <div class="row row-cols-1 row-cols-md-2 g-4">
      <div class="col" v-for="t in tastaturen" :key="t.id">
        <div class="card shadow-sm h-100">
          <img
              :src="getBildUrl(t.id)"
              class="card-img-top"
              :alt="t.tastaturName"
              @error="onImgError"
          />
          <div class="card-body">
            <h5 class="card-title">{{ t.tastaturName }}</h5>
            <p class="card-text">{{ t.beschreibung }}</p>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item"><strong>Modell:</strong> {{ t.modell }}</li>
            <li class="list-group-item"><strong>Switches:</strong> {{ t.switches }}</li>
            <li class="list-group-item"><strong>Keycaps:</strong> {{ t.keycaps }}</li>
          </ul>
          <div class="card-footer d-flex justify-content-between">
            <button class="btn btn-outline-primary" @click="bearbeiten(t.id)">
              Bearbeiten
            </button>
            <button class="btn btn-outline-danger" @click="loeschen(t.id)">
              Löschen
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TastaturenVerwalten",
  data() {
    return {
      tastaturen: [],
      fallbackBild: "https://via.placeholder.com/350x180?text=Kein+Bild",
    };
  },
  mounted() {
    this.ladeTastaturen();
  },
  methods: {
    async ladeTastaturen() {
      try {
        const res = await fetch(import.meta.env.VITE_BACKEND_BASE_URL + "/tastaturen");
        if (!res.ok) throw new Error("Fehler beim Laden");
        this.tastaturen = await res.json();
      } catch (err) {
        console.error("Fehler beim Laden:", err);
      }
    },
    getBildUrl(id) {
      return `${import.meta.env.VITE_BACKEND_BASE_URL}/tastaturen/${id}/bild`;
    },
    onImgError(e) {
      e.target.src = this.fallbackBild;
    },
    bearbeiten(id) {
      this.$router.push({ name: "TastaturEdit", params: { id } });
    },
    async loeschen(id) {
      if (!confirm("Möchtest du diesen Beitrag wirklich löschen?")) return;

      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/tastaturen/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Löschen fehlgeschlagen");
        this.tastaturen = this.tastaturen.filter(t => t.id !== id);
      } catch (err) {
        console.error("Fehler beim Löschen:", err);
        alert("Fehler beim Löschen!");
      }
    },
  },
};
</script>

<style scoped>
.card-img-top {
  height: 180px;
  object-fit: cover;
}
</style>
