<template>
  <div>
    <div
      v-for="employee in list"
      v-bind:key="employee.id"
      class="flex justify-between bg-gray-200 m-2 rounded"
    >
      <span class="w-1/12">{{employee.id}}</span>
      <span class="w-1/3">{{employee.employee_name}}</span>
      <span class="w-1/12">{{employee.employee_salary}}</span>
      <span class="w-1/12">{{employee.employee_age}}</span>
      <!-- <span class="w-1/12">{{employee.profile_image}}</span> -->
      <div class="w-1/12">
        <!-- <button> <Zondicon icon="add-outline" class="flex mx-2 w-4 fill-current"/></button> -->
        <button @click="updateEmployee(employee)"> <Zondicon icon="cog" class="flex mx-2 w-4 fill-current"/></button>
        <button @click="deleteEmployee(employee.id)" > <Zondicon icon="close-outline" class="flex mx-2 w-4 fill-current"/> </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"; 
import Zondicon from 'vue-zondicons'

export default {
  name: "employees",
  data() {
    return {
      list: [],
      errors: []
    }
  },
  components: {
    Zondicon
  },
  created() {
    axios
      .get(`http://dummy.restapiexample.com/api/v1/employees`)
      .then(response => {
        this.list = response.data;
      })
      .catch(e => {
        this.errors.push(e);
      });
  },
  methods: {
    async getEmployeesList() {
      await axios
        .get(`http://dummy.restapiexample.com/api/v1/employees`)
        .then(response => {
          this.list = response.data;
        })
        .catch(e => {
          this.errors.push(e);
        });
    },
    async getEmployee(id) {
      await axios
        .get(`http://dummy.restapiexample.com/api/v1/employees/${id}`)
        .then(response => {
          this.list = this.list.filter(employee =>
            employee.id == id ? (employee = response.data) : employee
          );
        })
        .catch(e => {
          this.errors.push(e);
        });
    },
    async createEmployee(newEmployee) {
      await axios
        .post(`http://dummy.restapiexample.com/api/v1/create`, newEmployee)
        .then(response => {
          this.list.push(response.data);
        })
        .catch(e => {
          this.errors.push(e);
        });
    },
    async updateEmployee(updatedEmployee) {
      await axios
        .put(
          `http://dummy.restapiexample.com/api/v1/update/${updatedEmployee.id}`,
          updatedEmployee
        )
        .then(response => {
          this.list = this.list.filter(employee =>
            employee.id == updatedEmployee.id
              ? (employee = response.data)
              : employee
          );
        })
        .catch(e => {
          this.errors.push(e);
        });
    },
    async deleteEmployee(id) {
      await axios
        .delete(`http://dummy.restapiexample.com/api/v1/delete/${id}`)
        .then(() => {
          this.list = this.list.filter(employee =>
            employee.id !== id ? employee : ""
          );
        })
        .catch(e => {
          this.errors.push(e);
        });
    }
  }
};
</script>


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
