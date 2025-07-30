<template>
  <div class="container-fluid">
    <div class="q-pa-md" style="max-width: 80%">
      <q-form class="q-gutter-sm">
        <div class="row q-pa-sm q-gutter-sm">
          <q-input
            class="col-lg-8 col-sm-8"
            filled
            v-model="newEquipment.nickname"
            label="Nick Name"
          />
        </div>
        <div class="row q-pa-sm q-gutter-sm">
          <q-input
            class="col-lg-3"
            filled
            v-model="newEquipment.status"
            label="Status"
          />
          <q-input
            class="col-lg-3"
            filled
            v-model="newEquipment.category"
            label="Category"
          />
          <q-input
            class="col-lg-3"
            filled
            v-model="newEquipment.name"
            label="Name"
          />
          <q-input
            class="col-lg-3"
            filled
            v-model="newEquipment.manufacture"
            label="Manufacture"
          />
        </div>
        <div class="row q-pa-sm q-gutter-sm">
          <q-input
            class="col-lg-3"
            filled
            v-model="newEquipment.model"
            label="Model"
          />
          <q-input
            class="col-lg-3"
            filled
            v-model="newEquipment.serial"
            label="Serial"
          />
          <q-input
            class="col-lg-3"
            filled
            v-model="newEquipment.manufactured_year"
            label="Manufactured Year"
          />
          <q-input
            class="col-lg-3"
            filled
            v-model="newEquipment.purchased_year"
            label="Purchased Year"
          />
        </div>
        <div class="row q-pa-sm q-gutter-sm">
          <q-input
            class="col-lg-3"
            filled
            v-model="newEquipment.warranty_length"
            label="Warranty Length (months)"
          />
          <q-input
            class="col-lg-3"
            filled
            v-model="newEquipment.invoice_price"
            label="Invoice Price"
          />
        </div>
        <div class="row q-pa-sm q-gutter-sm">
          <q-btn label="Submit" @click="alert('good')" color="primary" />
          <q-btn
            label="Reset"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          />
        </div>
      </q-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "equipEntry",
  data() {
    return {
      newEquipment: {
        nickname: "water heater",
        status: "",
        category: "",
        name: "",
        manufacture: "",
        model: "",
        serial: "",
        manufactured_year: "",
        purchased_year: "",
        warranty_length: "",
        invoice_price: "",
      },
    };
  },

  methods: {
    showDetails() {
      this.showDialog = true;
      this.title = "Card Title";
      this.subtitle = "Card Subtitle";
      this.description = "Card Description";
    },

    onReset() {
      this.showDialog = true;
      this.title = "Card Title";
      this.subtitle = "Card Subtitle";
      this.description = "Card Description";
    },

    save() {
      // Save the updated content here
      this.showDialog = false;
    },
  },
};
</script>
