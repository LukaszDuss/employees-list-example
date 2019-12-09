<template>
  <div>
    <div class="flex justify-between object-center bg-gray-600 m-2 py-4 rounded">
      <span class="w-1/12">ID</span>
      <span class="w-1/3">Employee Name</span>
      <span class="w-1/6">Employee Salary</span>
      <span class="w-1/6">Employee Age</span>
      <div class="w-1/12"></div>
    </div>
    <div v-if="!list.length">Loading...</div>
    <div
      v-for="(employee, index) in list.slice(0, limit)"
      :key="index"
      class="flex justify-between object-center bg-gray-300 m-2 p-2 rounded"
    >
      <span class="w-1/12">{{employee.id}}</span>
      <span v-if="!list[index].updating" class="w-1/3">{{employee.employee_name}}</span>
      <input
        v-else
        v-model="employee.name"
        class="w-1/3 rounded"
        type="text"
        placeholder="Please enter employee name..."
      />
      <span v-if="!employee.updating" class="w-1/6">{{employee.employee_salary}}</span>
      <input
        v-else
        v-model="employee.salary"
        class="w-1/6 rounded"
        type="text"
        placeholder="Please enter employee salary..."
      />
      <span v-if="!employee.updating" class="w-1/6">{{employee.employee_age}}</span>
      <input
        v-else
        v-model="employee.age"
        class="w-1/6 rounded"
        type="text"
        placeholder="Please enter employee age..."
      />
      <div class="w-1/12">
        <button v-if="!employee.updating" @click="toggleEditing(employee)">
          <Zondicon icon="cog" class="flex mx-2 w-4 fill-current" />
        </button>
        <button v-else @click="updateEmployee(employee)">
          <Zondicon icon="checkmark-outline" class="flex mx-2 w-4 fill-current" />
        </button>
        <button v-if="!employee.updating" @click="deleteEmployee(employee.id)">
          <Zondicon icon="close-outline" class="flex mx-2 w-4 fill-current" />
        </button>
        <button v-else @click="toggleEditing(employee)">
          <Zondicon icon="block" class="flex mx-2 w-4 fill-current" />
        </button>
      </div>
    </div>
    <div class="flex justify-between object-center bg-gray-400 m-2 py-2 rounded">
      <span class="w-1/12"></span>
      <input
        v-model="newEmployee.name"
        class="w-1/3 rounded"
        type="text"
        placeholder="Please enter employee name..."
      />
      <input
        v-model="newEmployee.salary"
        class="w-1/6 rounded"
        type="text"
        placeholder="Please enter employee salary..."
      />
      <input
        v-model="newEmployee.age"
        class="w-1/6 rounded"
        type="text"
        placeholder="Please enter employee age..."
      />
      <div class="w-1/12">
        <button @click="createEmployee()">
          <Zondicon icon="add-outline" class="flex mx-2 w-4 fill-current" />
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
      newEmployee: {
        name: null,
        salary: null,
        age: null
      },
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
        .catch(error => {
          this.errors.push(error);
        });
    },
    // async getEmployee(id) {
    //   await axios
    //     .get(`http://dummy.restapiexample.com/api/v1/employees/${id}`)
    //     .then(response => {
    //       this.list = this.list.filter(employee =>
    //         employee.id == id ? (employee = response.data) : employee
    //       );
    //     })
    //     .catch(error => {
    //       this.errors.push(error);
    //     });
    // },
    async createEmployee() {
      await axios
        .post(`http://dummy.restapiexample.com/api/v1/create`, this.newEmployee)
        .then(response => {
          this.list.push(response.data);
        })
        .catch(error => {
          this.errors.push(error);
        })
        .finally(() => {
          this.newEmployee = {
            name: null,
            salary: null,
            age: null
          };
        });
    },
    async updateEmployee(employee) {
      !employee.name ? (employee.name = employee.employee_name) : "";
      !employee.salary ? (employee.salary = employee.employee_salary) : "";
      !employee.age ? (employee.age = employee.employee_age) : "";
      let data = {
        name: employee.name,
        salary: employee.salary,
        age: employee.age
      };
      await axios
        .put(
          `http://dummy.restapiexample.com/api/v1/update/${employee.id}`,
          data
        )
        .then(response => {
          employee.employee_name = response.data.name;
          employee.employee_salary = response.data.salary;
          employee.employee_age = response.data.age;
        })
        .catch(error => {
          this.errors.push(error);
        })
        .finally(() => {
          this.toggleEditing(employee);
          this.$forceUpdate();
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
        .catch(error => {
          this.errors.push(error);
        })
        .finally(() => {
          this.$forceUpdate();
        });
    },
    toggleEditing(employee) {
      employee.updating === null ? (employee.updating = false) : "";
      employee.updating = !employee.updating;
      this.$forceUpdate();
    }
  }
};
</script>

