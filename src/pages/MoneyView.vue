<template>
  <q-page class="flex flex-center">
    This is Money View This page should show incomes and expenses. income and
    expense all have two style: stand alone, and recurring. recurring needs to
    be able to setup recurring cycle. (optional)
    <p>from -> to amount, date, method, notes</p>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "TaskView",
});
</script>
