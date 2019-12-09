<template>
  <div class="p-4">
    <div
      class="flex justify-between items-center text-center text-xl bg-gray-500 m-2 py-4 px-2 rounded"
    >
      <span class="w-1/12">ID</span>
      <span class="w-1/3">Employee Name</span>
      <span class="w-1/6">Employee Salary</span>
      <span class="w-1/6">Employee Age</span>
      <div class="w-1/12"></div>
    </div>
    <div v-if="!list.length">Loading...</div>
    <div
      v-for="(employee, index) in list.slice(page*limit-limit, page*limit)"
      :key="index"
      class="flex justify-between items-center text-center text-gray-800 bg-gray-300 mx-2 my-1 p-2 rounded"
    >
      <span class="w-1/12">{{employee.id}}</span>
      <span v-if="!employee.updating" class="w-1/3">{{employee.employee_name}}</span>
      <input
        v-else
        v-model="employee.name"
        class="w-1/3 text-sm rounded"
        type="text"
        placeholder="Please enter employee name..."
      />
      <span v-if="!employee.updating" class="w-1/6">{{employee.employee_salary}}</span>
      <input
        v-else
        v-model="employee.salary"
        class="w-1/6 text-sm rounded"
        type="text"
        placeholder="Please enter employee salary..."
      />
      <span v-if="!employee.updating" class="w-1/6">{{employee.employee_age}}</span>
      <input
        v-else
        v-model="employee.age"
        class="w-1/6 text-sm rounded"
        type="text"
        placeholder="Please enter employee age..."
      />
      <div class="w-1/12 text-gray-700">
        <button v-if="!employee.updating" @click="toggleEditing(employee)">
          <Zondicon icon="cog" class="flex mx-2 w-6 fill-current" />
        </button>
        <button v-else @click="updateEmployee(employee)">
          <Zondicon icon="checkmark-outline" class="flex text-green-500 mx-2 w-6 fill-current" />
        </button>
        <button v-if="!employee.updating" @click="deleteEmployee(employee.id)">
          <Zondicon icon="trash" class="flex mx-2 w-6 fill-current" />
        </button>
        <button v-else @click="toggleEditing(employee)">
          <Zondicon icon="close-outline" class="flex text-red-500 flex mx-2 w-6 fill-current" />
        </button>
      </div>
    </div>
    <div class="flex justify-between object-center items-center bg-gray-400 m-2 p-2 rounded">
      <span class="w-1/12 text-sm"></span>
      <input
        v-model="newEmployee.name"
        class="w-1/3 h-8 text-sm rounded"
        type="text"
        placeholder="Please enter employee name..."
      />
      <input
        v-model="newEmployee.salary"
        class="w-1/6 h-8 text-sm rounded"
        type="text"
        placeholder="Please enter employee salary..."
      />
      <input
        v-model="newEmployee.age"
        class="w-1/6 h-8 text-sm rounded"
        type="text"
        placeholder="Please enter employee age..."
      />
      <div class="flex w-1/12">
        <button @click="createEmployee()">
          <Zondicon icon="add-solid" class="flex text-green-500 mx-6 w-6 fill-current" />
        </button>
      </div>
    </div>
    <paginate
      class="flex flex-row w-1/4 justify-between items-center mx-auto"
      v-model="page"
      :page-count="Math.ceil(list.length/limit)"
      :page-range="3"
      :margin-pages="2"
      :prev-text="'Prev'"
      :next-text="'Next'"
      :container-class="'text-gray-500'"
      :active-class="'text-gray-100 font-bold bg-blue-500 rounded px-2'"
      :prev-class="'text-gray-200 bg-gray-600 rounded p-1 px-2'"
      :page-class="''"
      :next-class="'text-gray-200 bg-gray-600 rounded p-1 px-2'"
    >
      <span slot="prevContent">Changed previous button</span>
      <span slot="nextContent">Changed next button</span>
      <span slot="breakViewContent">
        <svg class="text-gray-500 fill-current" width="16" height="4" viewBox="0 0 16 4">
          <circle cx="2" cy="2" r="2" />
          <!-- <circle class="fill-curent" cx="8" cy="2" r="2" /> -->
          <circle cx="14" cy="2" r="2" />
        </svg>
      </span>
    </paginate>
  </div>
</template>

<script>
import axios from "axios";
import Zondicon from "vue-zondicons";
import Paginate from "vuejs-paginate";

export default {
  name: "employees",
  data() {
    return {
      newEmployee: {
        name: null,
        salary: null,
        age: null
      },
      page: 1,
      limit: 20,
      list: [],
      errors: []
    };
  },
  components: {
    Zondicon,
    Paginate
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
          this.list.push({
            id: response.data.id,
            employee_name: response.data.employee_name,
            employee_salary: response.data.employee_salary,
            employee_age: response.data.employee_age
          });
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
          this.$$forceUpdate();
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

