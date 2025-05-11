<template>
  <h1>Welcome to Persons</h1>
  <div class="container-fluid">
    <div class="row row-cols-1 row-cols-md-4 g-4">
      <div class="col" v-for="keyboard in keyboards" :key="keyboard.id">
        <div class="card-body">
            <h5 class="card-title">{{ keyboard.tastaturname }} {{ keyboard.modell }}</h5>
            <p class="card-text">
              {{ keyboard.switches }} {{ keyboard.keycaps }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Keyboard',
  data () {
    return {
      keyboards: []
    }
  },
  mounted () {
    const endpoint = process.env.VUE_APP_BACKEND_BASE_URL + '/api/v1/keyboards'
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    }

    fetch(endpoint, requestOptions)
        .then(response => response.json())
        .then(result => result.forEach(person => {
          this.persons.push(person)
        }))
        .catch(error => console.log('error', error))
  }
}
</script>

<style scoped>

</style>