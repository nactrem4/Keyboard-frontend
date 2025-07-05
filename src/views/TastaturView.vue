<template>
  <div class="container mt-4">
    <!-- Hauptüberschrift -->
    <h1 class="mb-4 text-center">Alle Tastaturen</h1>

    <!-- Grid für Tastaturkarten: 1 Spalte auf kleineren Bildschirmen, 3 Spalten auf md+ -->
    <div class="row row-cols-1 row-cols-md-3 g-4">
      <!-- Karte pro Tastatur -->
      <div class="col" v-for="t in tastaturen" :key="t.id">
        <div
            class="card h-100 shadow-sm rounded position-relative"
            style="width: 22rem;"
            @click="goToDetail(t.id)"
        >
          <!-- Tastaturbild -->
          <img
              :src="getBildUrl(t.id)"
              :alt="t.tastaturName"
              class="card-img-top"
              @error="onImgError"
          />

          <!-- Textbereich der Karte -->
          <div class="card-body">
            <h5 class="card-title">{{ t.tastaturName }}</h5>
            <p class="card-text">{{ t.beschreibung }}</p>
          </div>

          <!-- Liste mit Details -->
          <ul class="list-group list-group-flush">
            <li class="list-group-item"><strong>Modell:</strong> {{ t.modell }}</li>
            <li class="list-group-item"><strong>Switches:</strong> {{ t.switches }}</li>
            <li class="list-group-item"><strong>Keycaps:</strong> {{ t.keycaps }}</li>
          </ul>

          <!-- Vote Buttons unten rechts positioniert -->
          <div class="vote-buttons-bottom d-flex gap-2">
            <!-- Upvote Button -->
            <button
                class="btn btn-success btn-sm"
                @click.stop.prevent="vote(t.id, 'up')"
                :title="'Upvote (Aktuell: ' + t.upvotes + ')'"
                type="button"
            >
              ▲ {{ t.upvotes }}
            </button>

            <!-- Downvote Button -->
            <button
                class="btn btn-danger btn-sm"
                @click.stop.prevent="vote(t.id, 'down')"
                :title="'Downvote (Aktuell: ' + t.downvotes + ')'"
                type="button"
            >
              ▼ {{ t.downvotes }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TastaturView",
  data() {
    return {
      tastaturen: []
    };
  },
  mounted() {
    this.ladeTastaturen();
  },
  methods: {
    async ladeTastaturen() {
      try {
        const response = await fetch(
            import.meta.env.VITE_BACKEND_BASE_URL + "/tastaturen"
        );
        if (!response.ok) throw new Error("Netzwerkantwort war nicht ok");
        this.tastaturen = await response.json();

        this.tastaturen.forEach((t) => {
          if (t.upvotes === undefined || t.upvotes === null) t.upvotes = 0;
          if (t.downvotes === undefined || t.downvotes === null) t.downvotes = 0;
        });
      } catch (error) {
        console.error("Fehler beim Laden der Tastaturen:", error);
      }
    },

    getBildUrl(id) {
      return `${import.meta.env.VITE_BACKEND_BASE_URL}/tastaturen/${id}/bild`;
    },

    onImgError(event) {
      event.target.src = "";
    },

    goToDetail(id) {
      this.$router.push({ name: "TastaturDetail", params: { id } });
    },

    async vote(id, type) {
      try {
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_BASE_URL}/tastaturen/${id}/vote`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ type }),
            }
        );
        if (!response.ok) throw new Error("Vote konnte nicht gespeichert werden");

        const updatedTastatur = await response.json();
        const index = this.tastaturen.findIndex(t => t.id === id);
        if (index !== -1) {
          this.tastaturen.splice(index, 1, updatedTastatur);
        }
      } catch (err) {
        console.error(err);
        alert("Fehler beim Abstimmen!");
      }
    },
  },
};
</script>

<style scoped>
.card-img-top {
  height: 180px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.card:hover .card-img-top {
  transform: scale(1.05);
}

.card {
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  position: relative;
}

.card:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(-5px);
}

.vote-buttons-bottom {
  position: absolute;
  bottom: 10px;
  right: 10px;
}

.vote-buttons-bottom button {
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9rem;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
</style>
