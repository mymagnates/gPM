<template>
  <q-page class="flex flex-center">
    This is a reporting view. Enable to select any combination of properties
    together or single property for reporting.
    <p>two part of reporting</p>
    <p>
      1. KPI design, such as financial performance by time( this can be multiple
      charts, such as expenses, incomes, profit, etc)
    </p>
    <p>2. KPI design, such as task open and completion</p>
    <p>3. KPI design, such as contract execution</p>
    <p>
      4. Tax/rentRoll: break down of income and expenses for each property(sh)
    </p>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "InsightsView",
});
</script>
