<template>
  <q-page class="flex flex-center">
    This is Asset View asset view display assets/properties under management
    <p>
      asset basic information: address, layout, built year, story, similar to
      what you can find on Zillow.redfin
    </p>

    <p>
      additional asset information should contain: key equipments: pool, ac age,
      water heater age, any other valuable equipments
    </p>
    <p>
      additional asset information: HOA due, HOA contacts, insurance provider,
      mortgage provider, mortgage(interest & princile, insurance cost, tax
      cost,) rent price history ( price + date)
    </p>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "AssetView",
});
</script>
