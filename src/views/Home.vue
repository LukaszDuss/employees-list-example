<template>
  <div class="home">
    <empolyees/>
  </div>
</template>

<script>
// @ is an alias to /src
import Empolyees from "@/components/Empolyees.vue";

export default {
  name: "home",
  components: {
    Empolyees
  }
};
</script>
