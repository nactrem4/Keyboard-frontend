<template>
  <div class="container mt-4">
    <h2 class="mb-4">Tastatur bearbeiten</h2>

    <div v-if="ladeFehler" class="alert alert-danger">
      Fehler beim Laden der Tastatur: {{ ladeFehler }}
    </div>

    <form v-if="tastatur" @submit.prevent="speichern" enctype="multipart/form-data">
      <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input
            id="name"
            type="text"
            class="form-control"
            v-model="tastatur.tastaturName"
            required
        />
      </div>

      <div class="mb-3">
        <label for="modell" class="form-label">Modell</label>
        <input id="modell" type="text" class="form-control" v-model="tastatur.modell" />
      </div>

      <div class="mb-3">
        <label for="switches" class="form-label">Switches</label>
        <input id="switches" type="text" class="form-control" v-model="tastatur.switches" />
      </div>

      <div class="mb-3">
        <label for="keycaps" class="form-label">Keycaps</label>
        <input id="keycaps" type="text" class="form-control" v-model="tastatur.keycaps" />
      </div>

      <div class="mb-3">
        <label for="beschreibung" class="form-label">Beschreibung</label>
        <textarea
            id="beschreibung"
            class="form-control"
            v-model="tastatur.beschreibung"
            rows="4"
        ></textarea>
      </div>

      <div class="mb-3">
        <label class="form-label">Bild hochladen</label>
        <div
            class="border p-3 text-center"
            @drop.prevent="handleDrop"
            @dragover.prevent
            style="cursor: pointer;"
            @click="triggerFileInput"
        >
          <input
              type="file"
              ref="fileInput"
              class="d-none"
              @change="handleFileChange"
              accept="image/*"
          />
          <div v-if="bildVorschau">
            <img :src="bildVorschau" alt="Bildvorschau" style="max-width: 100%; max-height: 300px;" />
            <button type="button" class="btn btn-sm btn-danger mt-2" @click="bildEntfernen">Bild entfernen</button>
          </div>
          <div v-else>
            Ziehe ein Bild hierher oder klicke, um ein Bild auszuwählen
          </div>
        </div>
      </div>

      <button type="submit" class="btn btn-primary me-2">Speichern</button>
      <button type="button" class="btn btn-secondary" @click="abbrechen">Abbrechen</button>
    </form>

    <div v-else class="text-center">
      <p>Lade Tastaturdaten...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "TastaturEdit",
  data() {
    return {
      tastatur: null,
      ladeFehler: null,
      bildDatei: null,
      bildVorschau: null,
    };
  },
  created() {
    this.ladeTastatur();
  },
  methods: {
    async ladeTastatur() {
      const id = this.$route.params.id;
      try {
        const res = await fetch(
            `${import.meta.env.VITE_BACKEND_BASE_URL}/tastaturen/${id}`
        );
        if (!res.ok) throw new Error("Tastatur konnte nicht geladen werden");
        this.tastatur = await res.json();

        if (this.tastatur.bild && this.tastatur.bild.length > 0) {
          this.bildVorschau = `${import.meta.env.VITE_BACKEND_BASE_URL}/tastaturen/${id}/bild?timestamp=${Date.now()}`;
        }
      } catch (error) {
        this.ladeFehler = error.message;
      }
    },

    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.bildDatei = file;
        this.createBildVorschau(file);
      }
    },

    handleDrop(event) {
      const file = event.dataTransfer.files[0];
      if (file) {
        this.bildDatei = file;
        this.createBildVorschau(file);
      }
    },

    createBildVorschau(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.bildVorschau = e.target.result;
      };
      reader.readAsDataURL(file);
    },

    async bildEntfernen() {
      try {
        const id = this.$route.params.id;
        const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/tastaturen/${id}/bild`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Bild konnte nicht gelöscht werden");

        this.bildDatei = null;
        this.bildVorschau = null;
        this.tastatur.bild = null;

        alert("Bild erfolgreich gelöscht");
      } catch (error) {
        alert("Fehler beim Löschen des Bildes: " + error.message);
      }
    },

    async speichern() {
      const id = this.$route.params.id;

      try {
        // Tastaturdaten speichern (ohne Bild)
        const resUpdate = await fetch(
            `${import.meta.env.VITE_BACKEND_BASE_URL}/tastaturen/${id}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                tastaturName: this.tastatur.tastaturName,
                modell: this.tastatur.modell,
                switches: this.tastatur.switches,
                keycaps: this.tastatur.keycaps,
                beschreibung: this.tastatur.beschreibung,
                bild: null,
              }),
            }
        );
        if (!resUpdate.ok) throw new Error("Fehler beim Speichern der Tastaturdaten");

        // Bild separat hochladen (wenn neu ausgewählt)
        if (this.bildDatei) {
          const formData = new FormData();
          formData.append("file", this.bildDatei);
          const resBild = await fetch(
              `${import.meta.env.VITE_BACKEND_BASE_URL}/tastaturen/${id}/uploadBild`,
              { method: "POST", body: formData }
          );
          if (!resBild.ok) throw new Error("Fehler beim Hochladen des Bildes");

          // Vorschau aktualisieren mit Cache-Busting
          this.bildVorschau = `${import.meta.env.VITE_BACKEND_BASE_URL}/tastaturen/${id}/bild?timestamp=${Date.now()}`;
        }

        alert("Tastatur erfolgreich gespeichert!");
        this.$router.push({ name: "TastaturDetail", params: { id } });
      } catch (error) {
        alert("Fehler beim Speichern: " + error.message);
      }
    },

    abbrechen() {
      this.$router.back();
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
}
</style>
