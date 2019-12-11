<template>
  <div class="p-4">
    <div
      class="flex font-medium justify-between items-center text-center text-gray-800 text-xl bg-gray-500 m-2 py-4 px-2 shadow-md rounded"
    >
      <span class="w-1/12">ID</span>
      <span class="w-1/3">Employee Name</span>
      <span class="w-1/6 flex flex-row justify-center">
        Employee Salary
        <div class="flex flex-col items-center pl-2">
          <button class>
            <Zondicon icon="cheveron-up" class="fill-current w-4" />
          </button>
          <button class>
            <Zondicon icon="cheveron-down" class="fill-current w-4" />
          </button>
        </div>
      </span>
      <span class="w-1/6 flex flex-row justify-center">
        Employee Age
        <div class="flex flex-col pl-2">
          <button class>
            <Zondicon icon="cheveron-up" class="fill-current w-4" />
          </button>
          <button class>
            <Zondicon icon="cheveron-down" class="fill-current w-4" />
          </button>
        </div>
      </span>
      <div class="w-1/6 flex self-stretch justify-center">
        <input
        v-model="search"
        class="flex h-8 text-sm rounded"
        type="text"
        placeholder="Search.."
      />
      <Zondicon v-show="!search" icon="search" class="w-6 fill-current text-gray-700 -ml-8" />
      </div>
    </div>
    <div class="items-center text-center p-8" v-if="!list.length">Loading content...</div>
    <div
      v-for="(employee, index) in currentPage"
      :key="index"
      class="flex justify-between items-center text-center text-gray-800 bg-gray-300 m-2 px-2 shadow-md rounded"
    >
      <span class="w-1/12">{{employee.id}}</span>
      <span v-if="!employee.updating" class="w-1/3">{{employee.employee_name}}</span>
      <input
        v-else
        v-model="employee.name"
        class="w-1/3 h-8 text-sm rounded"
        type="text"
        placeholder="Please enter employee name..."
      />
      <span v-if="!employee.updating" class="w-1/6">{{employee.employee_salary}}</span>
      <input
        v-else
        v-model="employee.salary"
        class="w-1/6 h-8 text-sm rounded"
        type="text"
        placeholder="Please enter employee salary..."
      />
      <span v-if="!employee.updating" class="w-1/6">{{employee.employee_age}}</span>
      <input
        v-else
        v-model="employee.age"
        class="w-1/6 h-8 text-sm rounded"
        type="text"
        placeholder="Please enter employee age..."
      />
      <div class="flex w-1/6 text-gray-700 justify-end px-2">
        <button
          v-if="!employee.updating"
          @click="toggleEditing(employee)"
          class="focus:outline-none p-2"
        >
          <Zondicon icon="cog" class="w-6 fill-current text-gray-700 hover:text-gray-600" />
        </button>
        <button v-else @click="updateEmployee(employee)" class="focus:outline-none p-2">
          <Zondicon
            icon="checkmark-outline"
            class="w-6 fill-current text-green-500 hover:text-green-400"
          />
        </button>
        <button
          v-if="!employee.updating"
          @click="deleteEmployee(employee.id)"
          class="focus:outline-none p-2"
        >
          <Zondicon icon="trash" class="w-6 fill-current text-gray-700 hover:text-gray-600" />
        </button>
        <button v-else @click="toggleEditing(employee)" class="focus:outline-none p-2">
          <Zondicon icon="close-outline" class="w-6 fill-current text-red-500 hover:text-red-400" />
        </button>
      </div>
    </div>
    <div
      v-if="list.length"
      class="flex justify-between items-center text-gray-800 bg-gray-400 m-2 p-2 shadow-md rounded"
    >
      <span class="w-1/12 text-sm text-center">Add new:</span>
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
      <div class="flex w-1/6 justify-end px-2">
        <button @click="createEmployee()" class="focus:outline-none p-2">
          <Zondicon icon="add-solid" class="w-6 fill-current text-green-500 hover:text-green-400" />
        </button>
      </div>
    </div>
    <paginate
      v-if="list.length"
      class="flex flex-row w-1/4 justify-between items-center mx-auto"
      v-model="page"
      :page-count="Math.ceil(this.list.length/limit)"
      :page-range="3"
      :margin-pages="2"
      :prev-text="'Prev'"
      :next-text="'Next'"
      :container-class="'text-gray-500'"
      :active-class="'text-gray-100 font-bold bg-blue-500 rounded px-2 focus:outline-nones'"
      :prev-class="'text-gray-200 bg-gray-600 rounded p-1 px-2 focus:outline-none'"
      :page-class="'focus:outline-none'"
      :next-class="'text-gray-200 bg-gray-600 rounded p-1 px-2 focus:outline-none'"
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
    <div class="flex justify-center items-center p-2">
      <span class="px-2">Show:</span>
      <select v-model="limit" class="rounded text-lg border-2 border-gray-600">
        <option value="50">50</option>
        <option value="20">20</option>
        <option value="10">10</option>
      </select>
    </div>
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
      search: null,
      page: 1,
      limit: 20,
      list: [],
      errors: []
    };
  },
  computed: {
    currentPage: function() {
      return this.list.slice(
        this.page * this.limit - this.limit,
        this.page * this.limit
      );
    }
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
      if (
        this.newEmployee.name != null &&
        this.newEmployee.name != null &&
        this.newEmployee.name != null
      ) {
        await axios
          .post(
            `http://dummy.restapiexample.com/api/v1/create`,
            this.newEmployee
          )
          .then(response => {
            this.list.push({
              id: response.data.id,
              employee_name: response.data.name,
              employee_salary: response.data.salary,
              employee_age: response.data.age
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
            this.$forceUpdate();
          });
      }
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

