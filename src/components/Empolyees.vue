<template>
  <div>
    <div v-for="employee in list" v-bind:key="employee.id">
      {{employee}}
    </div>
  </div>
</template>

<script>

import axios from 'axios';

export default {
  name: "employees",
  data() {
    return {
      list: [],
      errors: []
    }
  }, 
   created() {
    axios.get(`http://dummy.restapiexample.com/api/v1/employees`)
    .then(response => {
      // JSON responses are automatically parsed.
      this.list = response.data
    })
    .catch(e => {
      this.errors.push(e)
    })
   }, 
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
