<template>
  <div class="container mt-4">
    <button class="btn btn-secondary mb-3" @click="$router.back()">← Zurück</button>

    <div v-if="tastatur" class="card shadow-sm p-3">
      <div class="row g-3">
        <div class="col-md-5">
          <img
              :src="getBildUrl(tastatur.id)"
              :alt="tastatur.tastaturName"
              class="img-fluid rounded"
              @error="onImgError"
          />
        </div>
        <div class="col-md-7">
          <h2>{{ tastatur.tastaturName }}</h2>
          <p><strong>Modell:</strong> {{ tastatur.modell }}</p>
          <p><strong>Switches:</strong> {{ tastatur.switches }}</p>
          <p><strong>Keycaps:</strong> {{ tastatur.keycaps }}</p>
          <p>{{ tastatur.beschreibung }}</p>
        </div>
      </div>

      <hr />

      <h3>Kommentare</h3>

      <ul class="list-group mb-4" v-if="comments.length > 0">
        <li class="list-group-item" v-for="comment in comments" :key="comment.id">
          <strong>{{ comment.name }}:</strong> {{ comment.text }}
          <br />
          <small class="text-muted">{{ formatDatum(comment.createdAt) }}</small>
        </li>
      </ul>
      <p v-else>Keine Kommentare vorhanden.</p>

      <form @submit.prevent="submitComment" class="mb-4">
        <div class="mb-3">
          <label for="name" class="form-label">Dein Name</label>
          <input
              type="text"
              id="name"
              v-model="newComment.name"
              class="form-control"
              required
              maxlength="50"
          />
        </div>
        <div class="mb-3">
          <label for="text" class="form-label">Kommentar</label>
          <textarea
              id="text"
              v-model="newComment.text"
              class="form-control"
              rows="3"
              required
              maxlength="300"
          ></textarea>
        </div>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? "Wird gesendet..." : "Kommentar absenden" }}
        </button>
      </form>

      <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
      <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
    </div>

    <div v-else>
      <p>Lade Tastatur...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "TastaturDetail",
  data() {
    return {
      tastatur: null,
      comments: [],
      newComment: {
        name: "",
        text: "",
      },
      loading: false,
      errorMessage: "",
      successMessage: "",
      fallbackBild: "/images/fallback.jpg", // Pfad anpassen oder entfernen, falls nicht benötigt
    };
  },
  mounted() {
    this.loadTastatur();
    this.loadComments();
  },
  methods: {
    async loadTastatur() {
      try {
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_BASE_URL}/tastaturen/${this.$route.params.id}`
        );
        if (!response.ok) throw new Error("Tastatur nicht gefunden");
        this.tastatur = await response.json();
      } catch (err) {
        this.errorMessage = "Fehler beim Laden der Tastatur.";
        console.error(err);
      }
    },
    async loadComments() {
      try {
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_BASE_URL}/tastaturen/${this.$route.params.id}/comments`
        );
        if (!response.ok) throw new Error("Kommentare konnten nicht geladen werden");
        this.comments = await response.json();
      } catch (err) {
        this.errorMessage = "Kommentare konnten nicht geladen werden.";
        console.error(err);
      }
    },
    getBildUrl(id) {
      return `${import.meta.env.VITE_BACKEND_BASE_URL}/tastaturen/${id}/bild`;
    },
    onImgError(event) {
      event.target.src = this.fallbackBild;
    },
    async submitComment() {
      this.errorMessage = "";
      this.successMessage = "";
      if (!this.newComment.name.trim() || !this.newComment.text.trim()) {
        this.errorMessage = "Bitte Name und Kommentar ausfüllen.";
        return;
      }
      this.loading = true;
      try {
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_BASE_URL}/tastaturen/${this.tastatur.id}/comments`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(this.newComment),
            }
        );
        if (!response.ok) throw new Error("Kommentar konnte nicht gespeichert werden");
        this.successMessage = "Kommentar erfolgreich gespeichert!";
        this.newComment.name = "";
        this.newComment.text = "";
        await this.loadComments(); // Kommentare neu laden
      } catch (err) {
        this.errorMessage = err.message;
      } finally {
        this.loading = false;
      }
    },
    formatDatum(datumString) {
      const date = new Date(datumString);
      return date.toLocaleString();
    },
  },
};
</script>

<style scoped>
.img-fluid {
  max-height: 400px;
  object-fit: contain;
  width: 100%;
  border-radius: 0.25rem;
}
</style>
