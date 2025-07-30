<template>
  <div>
    <div class="q-pa-md" style="max-width: 400px">
      <q-form class="q-gutter-md">
        <q-input filled v-model="firstName" label="Firstname *"></q-input>

        <q-input filled v-model="lastName" label="Lastname *"></q-input>

        <q-input filled v-model="contact.email" label="Email *"></q-input>

        <div>
          <q-btn label="Submit" @click="alert('good')" color="primary"></q-btn>
          <q-btn
            label="Reset"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          ></q-btn>
        </div>
      </q-form>
    </div>

    <q-dialog v-model="showDialog" full-width persistent>
      <q-card>
        <q-card-section>
          <div class="row items-center">
            <div class="col-2">
              <img :src="imageUrl" alt="Image" class="full-width" />
            </div>
            <div class="col-10">
              <q-input v-model="title" label="Title"></q-input>
              <q-input v-model="subtitle" label="Subtitle"></q-input>
              <q-input v-model="description" label="Description"></q-input>
              <div class="text-right">
                <q-btn color="primary" label="Save" @click="save"></q-btn>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: "entryView",
  data() {
    return {
      imageUrl: "",
      title: "",
      subtitle: "",
      description: "",
      showDialog: false,
      firstName: "",
      lastName: "",
      contact: {
        email: "",
      },
      newProperty: {
        asset_type: "",
        address: "",
        unit_num: "",
        city: "",
        state: "",
        country: "",
        zip: "",
        build_year: "",
        story: "",
        bedroom: "",
        bathroom: "",
        kitchen: "",
        pool: "",
        garage: "",
      },
      newEquipment: {
        item: "water heater",
        brand: "",
        model: "",
        manufacture_year: "",
        serial_num: "",
      },

      newContract: {
        provider: "",
        applicants: [
          {
            name: "",
            signature: "",
            sequence: "primary",
          },
        ],
        property: "",
        contract_start: "",
        contract_end: "",
        contract_date: "",
        terms: {
          month_rate: "",
          due_date: "",
          safe_deposit: "",
          additional_deposit: "",
          pets: "",
          pet_deposit: "",
        },
      },

      newTask: {
        req_date: "",
        req_by: "",
        issue_desc: "",
        resolutions: [
          {
            comment: "",
            comm_by: "",
            comm_date: "",
          },
        ],
        task_status: "",
        close_date: "",
      },

      newAccount: {
        biz_name: "",
        biz_type: "",
      },

      newTransaction: {
        account_id: "",
        account: "credit/debit",
        trans_type: "",
        trans_date: "",
        trans_amount: "",
        trans_from: "",
        trans_to: "",
        trans_note: "",
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

    onReset() {},

    save() {
      // Save the updated content here
      this.showDialog = false;
    },
  },
};
</script>
