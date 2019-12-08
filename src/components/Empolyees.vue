<template>
  <div>
    <div class="flex justify-between object-center bg-gray-500 m-2 py-4 rounded">
      <span class="w-1/12">ID</span>
      <span class="w-1/3">Employee Name</span>
      <span class="w-1/6">Employee Salary</span>
      <span class="w-1/6">Employee Age</span>
      <div class="w-1/12"></div>
    </div>
    <div v-if="!list.lenght">
      NO EMPLOYEES 
    </div>
    <div
      v-for="(employee, index) in (list.slice(0, limit))"
      v-bind:key="employee.id"
      class="flex justify-between object-center bg-gray-300 m-2 p-2 rounded"
    >
      <span class="w-1/12">{{employee.id}}</span>
      <span
        v-if="!list[index].updating"
        class="w-1/3"
      >{{employee.employee_name}} {{list[index].updating}}</span>
      <input
        v-else
        v-model="list[index].name"
        class="w-1/3"
        type="text"
        placeholder="Please enter employee name..."
      />
      <span v-if="!list[index].updating" class="w-1/6">{{employee.employee_salary}}</span>
      <input
        v-else
        v-model="list[index].salary"
        class="w-1/6"
        type="text"
        placeholder="Please enter employee salary..."
      />
      <span v-if="!list[index].updating" class="w-1/6">{{employee.employee_age}}</span>
      <input
        v-else
        v-model="list[index].age"
        class="w-1/6"
        type="text"
        placeholder="Please enter employee age..."
      />
      <div class="w-1/12">
        <button v-if="!list[index].updating" @click="list[index].updating = true">
          <Zondicon icon="cog" class="flex mx-2 w-4 fill-current" />
        </button>
        <button v-else @click="updateEmployee(index)">
          <Zondicon icon="checkmark-outline" class="flex mx-2 w-4 fill-current" />
        </button>
        <button v-if="!list[index].updating" @click="deleteEmployee(employee.id)">
          <Zondicon icon="close-outline" class="flex mx-2 w-4 fill-current" />
        </button>
        <button v-else @click="list[index].updating = false">
          <Zondicon icon="block" class="flex mx-2 w-4 fill-current" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Zondicon from "vue-zondicons";

export default {
  name: "employees",
  data() {
    return {
      limit: 20,
      list: [],
      errors: []
    };
  },
  components: {
    Zondicon
  },
  created() {
    this.getEmployeesList();
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
      this.update();
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
    async updateEmployee(index) {
      this.list[index].updating = false;
      let data = {
        name: this.list[index].name,
        salary: this.list[index].salary,
        age: this.list[index].age
      };
      await axios
        .put(
          `http://dummy.restapiexample.com/api/v1/update/${this.list[index].id}`,
          data
        )
        .then(response => {
          this.list[index].employee_name = response.data.name;
          this.list[index].employee_salary = response.data.salary;
          this.list[index].employee_age = response.data.age;
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
    },
    async update() {
      // this.$$forceUpdate();
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
