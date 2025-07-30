<template>
  <div class="container-fluid">
    <div class="q-pa-md" style="max-width: 80%">
      <q-form class="q-gutter-sm">
        <div class="row q-pa-sm q-gutter-sm">
          <q-input
            class="col-lg-8 col-sm-8"
            filled
            v-model="newProperty.nickname"
            label="Nick Name"
          ></q-input>
        </div>

        <div class="row q-pa-sm q-gutter-sm">
          <q-input
            class="col-lg-3"
            filled
            v-model="newProperty.address.country"
            label="Country"
          />
          <q-input
            class="col-lg-3"
            filled
            v-model="newProperty.address.state"
            label="State"
          />
          <q-input
            class="col-lg-3"
            filled
            v-model="newProperty.address.city"
            label="City"
          />
          <q-input
            class="col-lg-3"
            filled
            v-model="newProperty.address.zip"
            label="Zip"
          />
          <q-input
            class="col-lg-6"
            filled
            v-model="newProperty.address.street"
            label="Address"
          />
        </div>

        <div class="row q-pa-sm q-gutter-sm">
          <q-input
            class="col-lg-3"
            filled
            v-model="newProperty.asset_type"
            label="Type"
          />
          <q-input
            class="col-lg-3"
            filled
            v-model="newProperty.story"
            label="Story"
          />
          <q-input
            class="col-lg-3"
            filled
            v-model="newProperty.bedroom"
            label="Bedrooms"
          />
          <q-input
            class="col-lg-3"
            filled
            v-model="newProperty.full_bathroom"
            label="Full Bathrooms"
          />
          <q-input
            class="col-lg-3"
            filled
            v-model="newProperty.half_bathroom"
            label="Half Bathrooms"
          />
          <q-input
            class="col-lg-3"
            filled
            v-model="newProperty.kitchen"
            label="Kitchens"
          />
          <q-input
            class="col-lg-3"
            filled
            v-model="newProperty.meeting_room"
            label="Meeting Rooms"
          />
          <q-input
            class="col-lg-3"
            filled
            v-model="newProperty.office"
            label="Offices"
          />
          <q-input
            class="col-lg-3"
            filled
            v-model="newProperty.garage"
            label="Garage Spots"
          />
          <q-input
            class="col-lg-3"
            filled
            v-model="newProperty.size"
            label="Size (sqft)"
          />
          <q-input
            class="col-lg-3"
            filled
            v-model="newProperty.lot_size"
            label="Lot Size (sqft)"
          />
        </div>

        <div class="row q-pa-sm q-gutter-sm">
          <q-input
            class="col-lg-4"
            filled
            v-model="newProperty.hoa_name"
            label="HOA Name"
          />
          <q-input
            class="col-lg-4"
            filled
            v-model="newProperty.hoa_contact"
            label="HOA Contact"
          />
        </div>

        <div class="row q-pa-sm q-gutter-sm">
          <q-input
            class="col-12"
            filled
            v-model="newProperty.comment"
            label="Comment"
            type="textarea"
            autogrow
            rows="3"
            :max-rows="8"
            placeholder="Enter additional notes or comments here..."
          />
        </div>

        <div class="row q-pa-sm q-gutter-sm">
          <q-btn label="Submit" @click="alert('good')" color="primary"></q-btn>
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
  name: "propertyEntry",
  data() {
    return {
      newProperty: {
        nickname: "",
        address: {
          street: "",
          city: "",
          state: "",
          country: "",
          zip: "",
        },
        build_year: "",
        story: "",
        asset_type: "",
        bedroom: "",
        full_bathroom: "",
        half_bathroom: "",
        kitchen: "",
        meeting_room: "",
        office: "",
        garage: "",
        size: "",
        lot_size: "",
        hoa_name: "",
        hoa_contact: "",
        comment: "",
        imageUrl: "",
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
