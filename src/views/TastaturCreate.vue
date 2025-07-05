<template>
  <div class="container mt-5">
    <h2>Neue Tastatur erstellen</h2>

    <form @submit.prevent="submitForm" novalidate>
      <!-- Name -->
      <div class="mb-3">
        <label for="tastaturName" class="form-label">Name</label>
        <input
            id="tastaturName"
            v-model="form.tastaturName"
            type="text"
            class="form-control"
            required
        />
      </div>

      <!-- Modell -->
      <div class="mb-3">
        <label for="modell" class="form-label">Modell</label>
        <input
            id="modell"
            v-model="form.modell"
            type="text"
            class="form-control"
            required
        />
      </div>

      <!-- Switches -->
      <div class="mb-3">
        <label for="switches" class="form-label">Switches</label>
        <input
            id="switches"
            v-model="form.switches"
            type="text"
            class="form-control"
            required
        />
      </div>

      <!-- Keycaps -->
      <div class="mb-3">
        <label for="keycaps" class="form-label">Keycaps</label>
        <input
            id="keycaps"
            v-model="form.keycaps"
            type="text"
            class="form-control"
            required
        />
      </div>

      <!-- Beschreibung -->
      <div class="mb-3">
        <label for="beschreibung" class="form-label">Beschreibung</label>
        <textarea
            id="beschreibung"
            v-model="form.beschreibung"
            rows="3"
            class="form-control"
            required
        ></textarea>
      </div>

      <!-- Drag & Drop Bild Upload -->
      <div
          class="upload-area mb-3"
          @dragover.prevent
          @drop.prevent="handleDrop"
          @click="triggerFileInput"
      >
        <p v-if="!bildPreview">Bild hierher ziehen oder klicken zum Hochladen</p>
        <img
            v-if="bildPreview"
            :src="bildPreview"
            alt="Bild Vorschau"
            class="img-fluid"
            style="max-height: 200px; object-fit: contain;"
        />
        <input
            ref="fileInput"
            type="file"
            accept="image/*"
            @change="handleFileChange"
            hidden
        />
      </div>

      <button type="submit" class="btn btn-primary">Erstellen</button>
    </form>

    <div v-if="successMessage" class="alert alert-success mt-3">{{ successMessage }}</div>
    <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        tastaturName: '',
        modell: '',
        switches: '',
        keycaps: '',
        beschreibung: ''
      },
      bildFile: null,
      bildPreview: null,
      successMessage: '',
      errorMessage: ''
    };
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) this.setBild(file);
    },
    handleDrop(event) {
      const file = event.dataTransfer.files[0];
      if (file) this.setBild(file);
    },
    setBild(file) {
      this.bildFile = file;

      const reader = new FileReader();
      reader.onload = e => {
        this.bildPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    async submitForm() {
      this.errorMessage = '';
      this.successMessage = '';

      // Pflichtfelder prüfen
      if (!this.form.tastaturName || !this.form.modell || !this.form.switches || !this.form.keycaps || !this.form.beschreibung) {
        this.errorMessage = 'Bitte alle Felder ausfüllen.';
        return;
      }

      try {
        // 1. Tastatur ohne Bild erstellen
        const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/tastaturen`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.form),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error('Fehler beim Erstellen: ' + errorText);
        }

        const createdTastatur = await response.json();

        // 2. Falls Bild ausgewählt, Bild separat hochladen
        if (this.bildFile) {
          const formData = new FormData();
          formData.append('file', this.bildFile);

          const uploadResponse = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/tastaturen/${createdTastatur.id}/uploadBild`, {
            method: 'POST',
            body: formData,
          });

          if (!uploadResponse.ok) {
            throw new Error('Fehler beim Hochladen des Bildes');
          }
        }

        this.successMessage = 'Tastatur erfolgreich erstellt!';
        this.resetForm();

      } catch (err) {
        this.errorMessage = err.message || 'Unbekannter Fehler';
      }
    },
    resetForm() {
      this.form = {
        tastaturName: '',
        modell: '',
        switches: '',
        keycaps: '',
        beschreibung: ''
      };
      this.bildFile = null;
      this.bildPreview = null;
    }
  }
};
</script>

<style scoped>
.upload-area {
  border: 2px dashed #ccc;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  background-color: #f8f9fa;
  user-select: none;
}
.upload-area:hover {
  background-color: #e9ecef;
}
</style>
