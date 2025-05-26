<template>
  <div class="container-fluid">
    <img src="https://cdn.pixabay.com/photo/2012/12/17/19/14/keyboard-70506_640.jpg" class="card-img-top" :alt="tastatur.tastaturname">
    <div class="row row-cols-1 row-cols-md-4 g-4">
      <div class="col" v-for="tastatur in tastaturen" :key="tastatur.id">
        <div class="card-body">
            <h5 class="card-title">{{ tastatur.tastaturname }} {{ tastatur.modell }}</h5>
            <p class="card-text">
              {{ tastatur.switches }} {{ tastatur.keycaps }}
            </p>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Tastatur',
  data () {
    return {
      tastaturen: []
    }
  },
  mounted () {
    const endpoint = '//localhost:8080' + '/api/v1/tastaturen'
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    }

    fetch('//localhost:8080/api/v1/tastaturen', requestOptions)
        .then(response => response.json())
        .then(result => result.forEach(tastatur => {
          this.tastaturen.push(tastatur)
        }))
        .catch(error => console.log('error', error))
  }
}
</script>

<style scoped>

</style>