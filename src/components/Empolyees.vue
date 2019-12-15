<template>
  <div class="p-4">
    <div
      class="flex m-2 py-4 px-2 justify-between items-center text-center text-gray-800 text-xl font-medium bg-gray-500 shadow-md rounded"
    >
      <span class="w-1/12">ID</span>
      <span class="w-1/3">Employee Name</span>
      <span class="w-1/6 flex flex-row justify-center">
        Employee Salary
        <div class="flex flex-col pl-2 items-center">
          <button @click="sort= {by:'salary', direction:'decrementaly' }; sortList()">
            <Zondicon icon="cheveron-up" class="w-4 fill-current" />
          </button>
          <button @click="sort= {by:'salary', direction:'incrementaly' }; sortList()">
            <Zondicon icon="cheveron-down" class="w-4 fill-current" />
          </button>
        </div>
      </span>
      <span class="w-1/6 flex flex-row justify-center">
        Employee Age
        <div class="flex flex-col pl-2">
          <button @click="sort= {by:'age', direction:'decrementaly' }; sortList()">
            <Zondicon icon="cheveron-up" class="w-4 fill-current" />
          </button>
          <button @click="sort= {by:'age', direction:'incrementaly' }; sortList()">
            <Zondicon icon="cheveron-down" class="w-4 fill-current" />
          </button>
        </div>
      </span>
      <div class="w-1/6 px-6 flex self-stretch items-center justify-end text-gray-600">
        <input v-model="search" class="h-8 px-4 pr-10 text-sm text-gray-700 rounded" type="text" placeholder="Search.." />
        <Zondicon v-if="!search" icon="search" class="w-4 -ml-8 fill-current " />
        <button v-else class="flex -ml-8 " @click="search=null">
          <Zondicon icon="close" class="w-4 fill-current " />
        </button>
      </div>
    </div>
    <div class="p-8 items-center text-center" v-if="!list.length">Loading content...</div>
    <div
      v-for="(employee, index) in currentPage"
      :key="index"
      class="flex m-2 px-2 justify-between items-center text-center text-gray-800 bg-gray-300 shadow-md rounded"
    >
      <span class="w-1/12">{{employee.id}}</span>
      <span v-if="!employee.updating" class="w-1/3">{{employee.employee_name}}</span>
      <input
        v-else
        v-model="employee.name"
        class="w-1/3 h-8 p-4 text-center text-sm rounded"
        type="text"
        :placeholder="employee.employee_name"
      />
      <span v-if="!employee.updating" class="w-1/6">{{employee.employee_salary}}</span>
      <input
        v-else
        v-model="employee.salary"
        class="w-1/6 h-8 p-4 text-center text-sm rounded"
        type="text"
        :placeholder="employee.employee_salary"
      />
      <span v-if="!employee.updating" class="w-1/6">{{employee.employee_age}}</span>
      <input
        v-else
        v-model="employee.age"
        class="w-1/6 h-8 p-4 text-center text-sm rounded"
        type="text"
        :placeholder="employee.employee_age"
      />
      <div class="w-1/6 flex px-2 justify-end text-gray-700">
        <button
          v-if="!employee.updating"
          @click="toggleEditing(employee)"
          class="p-2 focus:outline-none"
        >
          <Zondicon icon="cog" class="w-6 fill-current text-gray-700 hover:text-gray-600" />
        </button>
        <button v-else @click="updateEmployee(employee)" class="p-2 focus:outline-none">
          <Zondicon
            icon="checkmark-outline"
            class="w-6 fill-current text-green-500 hover:text-green-400"
          />
        </button>
        <button
          v-if="!employee.updating"
          @click="deleteEmployee(employee.id)"
          class="p-2 focus:outline-none"
        >
          <Zondicon icon="trash" class="w-6 fill-current text-gray-700 hover:text-gray-600" />
        </button>
        <button v-else @click="toggleEditing(employee)" class="p-2 focus:outline-none">
          <Zondicon icon="close-outline" class="w-6 fill-current text-red-500 hover:text-red-400" />
        </button>
      </div>
    </div>
    <div
      v-if="list.length"
      class="flex m-2 p-2 justify-between items-center text-gray-800 bg-gray-400 shadow-md rounded"
    >
      <span class="w-1/12 text-sm text-center">Add new:</span>
      <input
        v-model="newEmployee.name"
        class="w-1/3 h-8 px-4 text-sm rounded"
        type="text"
        placeholder="Please enter employee name..."
      />
      <input
        v-model="newEmployee.salary"
        class="w-1/6 h-8 px-4 text-sm rounded"
        type="text"
        placeholder="Please enter employee salary..."
      />
      <input
        v-model="newEmployee.age"
        class="w-1/6 h-8 px-4 text-sm rounded"
        type="text"
        placeholder="Please enter employee age..."
      />
      <div class="w-1/6 flex px-2 justify-end">
        <button @click="createEmployee()" class="p-2 focus:outline-none">
          <Zondicon icon="add-solid" class="w-6 fill-current text-green-500 hover:text-green-400" />
        </button>
      </div>
    </div>
    <paginate
      v-if="employeesList.length"
      class="flex flex-row mx-auto justify-center items-center"
      v-model="page"
      :page-count="Math.ceil(this.employeesList.length/limit)"
      :page-range="3"
      :margin-pages="2"
      :prev-text="'Prev'"
      :next-text="'Next'"
      :container-class="'text-gray-500'"
      :active-class="'px-2  text-gray-100 font-bold bg-blue-500 rounded focus:outline-nones'"
      :prev-class="'p-1 px-2 text-gray-200 bg-gray-600 rounded focus:outline-none'"
      :page-class="'px-2 mx-2 focus:outline-none'"
      :next-class="'p-1 px-2 text-gray-200 bg-gray-600 rounded focus:outline-none'"
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
    <div class="flex p-2 justify-center items-center">
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
      sort: {
        by: null,
        direction: null
      },
      search: null,
      page: 1,
      limit: 20,
      list: [],
      errors: []
    };
  },
  computed: {
    employeesList: function() {
      return !this.search
        ? this.list
        : this.list.filter(employee => {
            return employee.employee_name
              .toLowerCase()
              .includes(this.search.toLowerCase());
          });
    },
    currentPage: function() {
      return this.employeesList.slice(
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
      try {
        let response = await axios.get(
          `http://dummy.restapiexample.com/api/v1/employees`
        );
        this.list = response.data;
      } catch (error) {
        this.errors.push(error);
      }
    },
    async createEmployee() {
      try {
        if (this.newEmployee.name != null) {
          let response = await axios.post(
            `http://dummy.restapiexample.com/api/v1/create`,
            this.newEmployee
          );
          this.list.push({
            id: response.data.id,
            employee_name: response.data.name,
            employee_salary: response.data.salary,
            employee_age: response.data.age
          });
          this.newEmployee = {
            name: null,
            salary: null,
            age: null
          };
          this.$forceUpdate();
        }
      } catch (error) {
        this.errors.push(error);
      }
    },
    async updateEmployee(employee) {
      try {
        !employee.name ? (employee.name = employee.employee_name) : "";
        !employee.salary ? (employee.salary = employee.employee_salary) : "";
        !employee.age ? (employee.age = employee.employee_age) : "";
        let data = {
          name: employee.name,
          salary: employee.salary,
          age: employee.age
        };
        let response = await axios.put(
          `http://dummy.restapiexample.com/api/v1/update/${employee.id}`,
          data
        );
        employee.employee_name = response.data.name;
        employee.employee_salary = response.data.salary;
        employee.employee_age = response.data.age;
        this.toggleEditing(employee);
        this.$forceUpdate();
      } catch (error) {
        this.errors.push(error);
      }
    },
    async deleteEmployee(id) {
      try {
        await axios.delete(
          `http://dummy.restapiexample.com/api/v1/delete/${id}`
        );
        this.list = this.list.filter(employee =>
          employee.id !== id ? employee : ""
        );
        this.$forceUpdate();
      } catch (error) {
        this.errors.push(error);
      }
    },
    sortList() {
      this.sort.by == "salary"
        ? this.sort.direction == "incrementaly"
          ? this.list.sort((a, b) => {
              return a.employee_salary - b.employee_salary;
            })
          : this.list.sort((a, b) => {
              return b.employee_salary - a.employee_salary;
            })
        : "";

      this.sort.by == "age"
        ? this.sort.direction == "incrementaly"
          ? this.list.sort((a, b) => {
              return a.employee_age - b.employee_age;
            })
          : this.list.sort((a, b) => {
              return b.employee_age - a.employee_age;
            })
        : "";
    },
    toggleEditing(employee) {
      employee.updating === null ? (employee.updating = false) : "";
      employee.updating = !employee.updating;
      this.$forceUpdate();
    }
  }
};
</script>

