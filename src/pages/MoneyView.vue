<template>
  <div class="q-gutter-lg">
    <!-- Header -->
    <div class="row items-center justify-between">
      <div>
        <div class="text-h5">Property Management</div>
        <div class="text-body2 text-grey-6">Manage your property portfolio</div>
      </div>
      <q-btn
        color="primary"
        icon="add"
        label="Add Property"
        @click="showAddDialog = true"
      />
    </div>

    <!-- Search -->
    <q-input
      v-model="searchTerm"
      placeholder="Search properties..."
      outlined
      dense
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
    </q-input>

    <!-- Property Cards -->
    <div class="row q-gutter-md">
      <div
        v-for="property in filteredProperties"
        :key="property.id"
        class="col-12 col-md-6 col-lg-4"
      >
        <q-card class="property-card">
          <div
            class="property-image"
            :style="{ backgroundImage: `url(${property.image})` }"
          ></div>
          <q-card-section>
            <div class="row items-start justify-between q-mb-sm">
              <div class="text-h6">{{ property.name }}</div>
              <q-badge
                :color="property.status === 'Active' ? 'primary' : 'grey-6'"
                :label="property.status"
              />
            </div>
            <div class="text-body2 text-grey-6 q-mb-md">
              <q-icon name="place" size="xs" class="q-mr-xs" />
              {{ property.address }}
            </div>

            <div class="row q-gutter-md q-mb-md">
              <div class="col">
                <div class="text-caption text-grey-6">
                  <q-icon name="home" size="xs" class="q-mr-xs" />
                  {{ property.type }}
                </div>
              </div>
              <div class="col">
                <div class="text-caption text-grey-6">
                  <q-icon name="people" size="xs" class="q-mr-xs" />
                  {{ property.occupiedUnits }}/{{ property.units }} Occupied
                </div>
              </div>
            </div>

            <div class="row items-center justify-between">
              <div class="text-h6">${{ property.monthlyRent }}/month</div>
              <q-btn outline color="primary" label="View Details" size="sm" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Add Property Dialog -->
    <q-dialog v-model="showAddDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Add New Property</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-input
              v-model="newProperty.name"
              label="Property Name"
              outlined
              dense
            />
            <q-input
              v-model="newProperty.address"
              label="Address"
              outlined
              dense
            />
            <q-select
              v-model="newProperty.type"
              :options="propertyTypes"
              label="Property Type"
              outlined
              dense
            />
            <div class="row q-gutter-sm">
              <div class="col">
                <q-input
                  v-model.number="newProperty.units"
                  label="Total Units"
                  type="number"
                  outlined
                  dense
                />
              </div>
              <div class="col">
                <q-input
                  v-model.number="newProperty.rent"
                  label="Monthly Rent"
                  type="number"
                  outlined
                  dense
                />
              </div>
            </div>
            <q-input
              v-model="newProperty.description"
              label="Description"
              type="textarea"
              outlined
              dense
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" @click="closeAddDialog" />
          <q-btn color="primary" label="Add Property" @click="addProperty" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "TaskView",
});

const searchTerm = ref("");
const showAddDialog = ref(false);

const properties = ref([
  {
    id: 1,
    name: "Sunset Apartments",
    address: "123 Main St, Downtown",
    type: "Apartment Complex",
    units: 12,
    occupiedUnits: 10,
    monthlyRent: 1200,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=200&fit=crop",
  },
  {
    id: 2,
    name: "Oak Street Townhomes",
    address: "456 Oak St, Midtown",
    type: "Townhouse",
    units: 8,
    occupiedUnits: 6,
    monthlyRent: 1800,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=200&fit=crop",
  },
  {
    id: 3,
    name: "Park View Condos",
    address: "789 Park Ave, Uptown",
    type: "Condominium",
    units: 6,
    occupiedUnits: 4,
    monthlyRent: 2200,
    status: "Maintenance",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=200&fit=crop",
  },
  {
    id: 4,
    name: "Riverside Single Family",
    address: "321 River Rd, Suburbs",
    type: "Single Family",
    units: 1,
    occupiedUnits: 1,
    monthlyRent: 2800,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=200&fit=crop",
  },
]);

const newProperty = ref({
  name: "",
  address: "",
  type: "",
  units: 0,
  rent: 0,
  description: "",
});

const propertyTypes = [
  "Apartment Complex",
  "Townhouse",
  "Condominium",
  "Single Family",
];

const filteredProperties = computed(() => {
  return properties.value.filter(
    (property) =>
      property.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const addProperty = () => {
  // Add property logic here
  showAddDialog.value = false;
  resetNewProperty();
};

const closeAddDialog = () => {
  showAddDialog.value = false;
  resetNewProperty();
};

const resetNewProperty = () => {
  newProperty.value = {
    name: "",
    address: "",
    type: "",
    units: 0,
    rent: 0,
    description: "",
  };
};
</script>
<style scoped>
.property-card {
  height: 100%;
}

.property-image {
  height: 200px;
  background-size: cover;
  background-position: center;
}
</style>
