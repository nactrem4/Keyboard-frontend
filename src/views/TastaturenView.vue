<template>
  <h1>Willkommen zu Tastaturen</h1>
  <div class="container-fluid">
    <div class="row row-cols-1 row-cols-md-4 g-4">
      <div class="col" v-for="tastatur in tastaturen" :key="tastatur.id">
        <div class="card h-100">
          <!-- Alle Karten bekommen das gleiche Bild -->
          <img
              :src="getImageSrc()"
              class="card-img-top"
              :alt="tastatur.tastaturName"
          />
          <div class="card-body">
            <h5 class="card-title">
              {{ tastatur.Modell }} {{ tastatur.Switches }} {{ tastatur.Keycaps }}
            </h5>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tastaturen',
  data() {
    return {
      tastaturen: []
    }
  },
  mounted() {
    const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
    const endpoint = baseUrl + /tastaturen
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    }

    fetch(endpoint, requestOptions)
        .then(response => response.json())
        .then(result => {
          this.tastaturen = result
        })
        .catch(error => console.log('Fehler beim Laden der Tastaturen:', error))
  },
  methods: {
    getImageSrc() {
      return 'https://randomwordgenerator.com/img/picture-generator/gd45270b21be0994b461b7a94074a89ddd904c6999472af011f90a8d1e6b5360f7c2af7c34acf5c77431b80074e6b280d_640.jpg'
    }
  }
}
</script>