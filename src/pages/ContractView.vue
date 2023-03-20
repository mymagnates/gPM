<template>
  <q-page class="flex flex-center">
    This is Contract View
    <p>
      this view should show contracts and tenants a contract contains below
      major information
    </p>
    <p>
      landlord, tennat, contract sign date, contract start date, end date,
      property address, monthly price, key terms from landlord( more detail to
      come), state standard contract as attachment, tenants ID, phone, email,
      pets information, employer name and contacts
    </p>
    <p>
      contract should be able to configure after expire term( auto-renew/
      auto-month2month, etc)
    </p>
    <p>
      contrct should be able to manual extend, terminate, renew, update,
      keep/retrieve version copies
    </p>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ContractView",
});
</script>
