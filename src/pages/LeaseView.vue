<template>
  <q-page class="lease-management-page">
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <h4 class="page-title">Lease Management</h4>
        <div class="header-actions">
          <q-btn
            color="primary"
            icon="add"
            label="Create New Lease"
            @click="openCreateLeaseModal"
            class="create-lease-btn"
          />
          <q-btn
            color="secondary"
            icon="filter_list"
            label="Filter"
            @click="toggleFilterPanel"
            class="filter-btn"
          />
        </div>
      </div>

      <!-- Filter Panel -->
      <div v-if="showFilterPanel" class="filter-panel">
        <div class="filter-row">
          <q-select
            v-model="filters.status"
            :options="statusOptions"
            label="Lease Status"
            outlined
            dense
            class="filter-select"
          />
          <q-select
            v-model="filters.property"
            :options="propertyOptions"
            label="Property"
            outlined
            dense
            class="filter-select"
          />
          <q-input
            v-model="filters.search"
            label="Search Tenant/Property"
            outlined
            dense
            class="filter-input"
          />
          <q-btn
            flat
            color="primary"
            label="Clear Filters"
            @click="clearFilters"
            size="sm"
          />
        </div>
      </div>

      <!-- Lease Statistics -->
      <div class="stats-section">
        <div class="stat-card active">
          <div class="stat-icon">
            <q-icon name="description" size="2rem" color="green" />
          </div>
          <div class="stat-content">
            <h6 class="stat-title">Active Leases</h6>
            <p class="stat-value">{{ activeLeasesCount }}</p>
          </div>
        </div>

        <div class="stat-card expiring">
          <div class="stat-icon">
            <q-icon name="warning" size="2rem" color="orange" />
          </div>
          <div class="stat-content">
            <h6 class="stat-title">Expiring Soon</h6>
            <p class="stat-value">{{ expiringLeasesCount }}</p>
          </div>
        </div>

        <div class="stat-card terminated">
          <div class="stat-icon">
            <q-icon name="block" size="2rem" color="red" />
          </div>
          <div class="stat-content">
            <h6 class="stat-title">Terminated</h6>
            <p class="stat-value">{{ terminatedLeasesCount }}</p>
          </div>
        </div>

        <div class="stat-card total">
          <div class="stat-icon">
            <q-icon name="analytics" size="2rem" color="blue" />
          </div>
          <div class="stat-content">
            <h6 class="stat-title">Total Revenue</h6>
            <p class="stat-value">{{ formatCurrency(totalRevenue) }}</p>
          </div>
        </div>
      </div>

      <!-- Leases Table -->
      <div class="leases-table-section">
        <q-table
          :rows="filteredLeases"
          :columns="columns"
          row-key="id"
          :loading="loading"
          :pagination="pagination"
          @request="onRequest"
          class="leases-table"
        >
          <!-- Custom slot for status column -->
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-chip
                :color="getStatusColor(props.value)"
                text-color="white"
                size="sm"
                :label="props.value"
              />
            </q-td>
          </template>

          <!-- Custom slot for monthly_rate column -->
          <template v-slot:body-cell-monthly_price="props">
            <q-td :props="props">
              <span class="rate-value">{{ formatCurrency(props.value) }}</span>
            </q-td>
          </template>

          <!-- Custom slot for actions column -->
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <div class="action-buttons">
                <q-btn
                  flat
                  round
                  dense
                  icon="visibility"
                  color="primary"
                  @click="viewLeaseDetails(props.row)"
                  title="View Details"
                />
                <q-btn
                  flat
                  round
                  dense
                  icon="edit"
                  color="secondary"
                  @click="editLease(props.row)"
                  title="Edit Lease"
                />
                <q-btn
                  flat
                  round
                  dense
                  icon="more_vert"
                  color="grey"
                  @click="openLeaseMenu(props.row, $event)"
                  title="More Actions"
                />
              </div>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>

    <!-- Create/Edit Lease Modal -->
    <div
      v-if="leaseDialog.open"
      class="modal-overlay"
      @click.self="closeLeaseModal"
    >
      <div class="modal lease-modal">
        <div class="modal-header">
          <h2 class="modal-title">
            <i class="fas fa-file-contract"></i>
            {{ leaseDialog.isEditing ? "Edit" : "Create" }} Lease
          </h2>
          <button class="modal-close" @click="closeLeaseModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-content">
          <form @submit.prevent="saveLease">
            <!-- Basic Information -->
            <div class="form-section">
              <h3 class="section-title">Basic Information</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Property *</label>
                  <q-select
                    v-model="leaseDialog.lease.property_id"
                    :options="propertyOptions"
                    label="Select Property"
                    outlined
                    dense
                    required
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Landlord *</label>
                  <input
                    type="text"
                    class="form-input"
                    v-model="leaseDialog.lease.landlord"
                    placeholder="Landlord name"
                    required
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Contract Sign Date *</label>
                  <input
                    type="date"
                    class="form-input"
                    v-model="leaseDialog.lease.contract_sign_date"
                    required
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Contract Start Date *</label>
                  <input
                    type="date"
                    class="form-input"
                    v-model="leaseDialog.lease.contract_start_date"
                    required
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Contract End Date *</label>
                  <input
                    type="date"
                    class="form-input"
                    v-model="leaseDialog.lease.contract_end_date"
                    required
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Monthly Price *</label>
                  <input
                    type="number"
                    class="form-input"
                    v-model="leaseDialog.lease.monthly_price"
                    placeholder="e.g., 2500"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
            </div>

            <!-- Tenant Information -->
            <div class="form-section">
              <h3 class="section-title">Tenant Information</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Tenant Name *</label>
                  <input
                    type="text"
                    class="form-input"
                    v-model="leaseDialog.lease.tenant_name"
                    placeholder="Tenant full name"
                    required
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Tenant ID</label>
                  <input
                    type="text"
                    class="form-input"
                    v-model="leaseDialog.lease.tenant_id"
                    placeholder="Government ID number"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Phone *</label>
                  <input
                    type="tel"
                    class="form-input"
                    v-model="leaseDialog.lease.tenant_phone"
                    placeholder="Phone number"
                    required
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Email *</label>
                  <input
                    type="email"
                    class="form-input"
                    v-model="leaseDialog.lease.tenant_email"
                    placeholder="Email address"
                    required
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Employer Name</label>
                  <input
                    type="text"
                    class="form-input"
                    v-model="leaseDialog.lease.employer_name"
                    placeholder="Employer name"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Employer Contact</label>
                  <input
                    type="text"
                    class="form-input"
                    v-model="leaseDialog.lease.employer_contact"
                    placeholder="Employer contact info"
                  />
                </div>
              </div>
            </div>

            <!-- Additional Information -->
            <div class="form-section">
              <h3 class="section-title">Additional Information</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Pets Information</label>
                  <textarea
                    class="form-input"
                    v-model="leaseDialog.lease.pets_info"
                    placeholder="Pet details, restrictions, etc."
                    rows="3"
                  ></textarea>
                </div>

                <div class="form-group">
                  <label class="form-label">Key Terms from Landlord</label>
                  <textarea
                    class="form-input"
                    v-model="leaseDialog.lease.key_terms"
                    placeholder="Special terms, conditions, etc."
                    rows="3"
                  ></textarea>
                </div>

                <div class="form-group">
                  <label class="form-label">Auto-Renewal Configuration</label>
                  <q-select
                    v-model="leaseDialog.lease.auto_renewal"
                    :options="autoRenewalOptions"
                    label="Select renewal option"
                    outlined
                    dense
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">State Standard Contract</label>
                  <input
                    type="file"
                    class="form-input"
                    @change="handleContractFile"
                    accept=".pdf,.doc,.docx"
                  />
                </div>
              </div>
            </div>

            <div class="modal-actions">
              <button
                type="button"
                class="btn btn-secondary"
                @click="closeLeaseModal"
              >
                Cancel
              </button>
              <button type="submit" class="btn btn-primary">
                <i class="fas fa-save"></i>
                {{ leaseDialog.isEditing ? "Update" : "Create" }} Lease
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Lease Details Modal -->
    <div
      v-if="leaseDetailsDialog.open"
      class="modal-overlay"
      @click.self="closeLeaseDetailsModal"
    >
      <div class="modal lease-details-modal">
        <div class="modal-header">
          <h2 class="modal-title">
            <i class="fas fa-file-contract"></i>
            Lease Details
          </h2>
          <button class="modal-close" @click="closeLeaseDetailsModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-content">
          <div v-if="leaseDetailsDialog.lease" class="lease-details">
            <!-- Lease Status -->
            <div class="lease-status-section">
              <div
                class="status-badge"
                :class="getStatusClass(leaseDetailsDialog.lease.status)"
              >
                {{ leaseDetailsDialog.lease.status }}
              </div>
              <div class="lease-actions">
                <q-btn
                  color="primary"
                  icon="edit"
                  label="Edit"
                  @click="editLease(leaseDetailsDialog.lease)"
                  size="sm"
                />
                <q-btn
                  color="secondary"
                  icon="extend"
                  label="Extend"
                  @click="extendLease(leaseDetailsDialog.lease)"
                  size="sm"
                />
                <q-btn
                  color="warning"
                  icon="refresh"
                  label="Renew"
                  @click="renewLease(leaseDetailsDialog.lease)"
                  size="sm"
                />
                <q-btn
                  color="negative"
                  icon="block"
                  label="Terminate"
                  @click="terminateLease(leaseDetailsDialog.lease)"
                  size="sm"
                />
              </div>
            </div>

            <!-- Basic Information -->
            <div class="detail-section">
              <h3>Basic Information</h3>
              <div class="detail-grid">
                <div class="detail-item">
                  <label>Property:</label>
                  <span>{{
                    getPropertyName(leaseDetailsDialog.lease.property_id)
                  }}</span>
                </div>
                <div class="detail-item">
                  <label>Landlord:</label>
                  <span>{{ leaseDetailsDialog.lease.landlord }}</span>
                </div>
                <div class="detail-item">
                  <label>Sign Date:</label>
                  <span>{{
                    formatDate(leaseDetailsDialog.lease.contract_sign_date)
                  }}</span>
                </div>
                <div class="detail-item">
                  <label>Start Date:</label>
                  <span>{{
                    formatDate(leaseDetailsDialog.lease.contract_start_date)
                  }}</span>
                </div>
                <div class="detail-item">
                  <label>End Date:</label>
                  <span>{{
                    formatDate(leaseDetailsDialog.lease.contract_end_date)
                  }}</span>
                </div>
                <div class="detail-item">
                  <label>Monthly Price:</label>
                  <span>{{
                    formatCurrency(leaseDetailsDialog.lease.monthly_price)
                  }}</span>
                </div>
              </div>
            </div>

            <!-- Tenant Information -->
            <div class="detail-section">
              <h3>Tenant Information</h3>
              <div class="detail-grid">
                <div class="detail-item">
                  <label>Name:</label>
                  <span>{{ leaseDetailsDialog.lease.tenant_name }}</span>
                </div>
                <div class="detail-item">
                  <label>ID:</label>
                  <span>{{ leaseDetailsDialog.lease.tenant_id || "N/A" }}</span>
                </div>
                <div class="detail-item">
                  <label>Phone:</label>
                  <span>{{ leaseDetailsDialog.lease.tenant_phone }}</span>
                </div>
                <div class="detail-item">
                  <label>Email:</label>
                  <span>{{ leaseDetailsDialog.lease.tenant_email }}</span>
                </div>
                <div class="detail-item">
                  <label>Employer:</label>
                  <span>{{
                    leaseDetailsDialog.lease.employer_name || "N/A"
                  }}</span>
                </div>
                <div class="detail-item">
                  <label>Employer Contact:</label>
                  <span>{{
                    leaseDetailsDialog.lease.employer_contact || "N/A"
                  }}</span>
                </div>
              </div>
            </div>

            <!-- Additional Information -->
            <div class="detail-section">
              <h3>Additional Information</h3>
              <div class="detail-grid">
                <div class="detail-item full-width">
                  <label>Pets Information:</label>
                  <span>{{ leaseDetailsDialog.lease.pets_info || "N/A" }}</span>
                </div>
                <div class="detail-item full-width">
                  <label>Key Terms:</label>
                  <span>{{ leaseDetailsDialog.lease.key_terms || "N/A" }}</span>
                </div>
                <div class="detail-item">
                  <label>Auto-Renewal:</label>
                  <span>{{
                    leaseDetailsDialog.lease.auto_renewal || "N/A"
                  }}</span>
                </div>
              </div>
            </div>

            <!-- Version History -->
            <div class="detail-section">
              <h3>Version History</h3>
              <div class="version-list">
                <div
                  v-for="version in leaseDetailsDialog.lease.versions"
                  :key="version.id"
                  class="version-item"
                >
                  <div class="version-info">
                    <span class="version-date">{{
                      formatDate(version.created_at)
                    }}</span>
                    <span class="version-type">{{ version.type }}</span>
                  </div>
                  <q-btn
                    flat
                    round
                    dense
                    icon="download"
                    color="primary"
                    @click="downloadVersion(version)"
                    title="Download Version"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "LeaseView",

  data() {
    return {
      loading: false,
      showFilterPanel: false,

      // Filters
      filters: {
        status: null,
        property: null,
        search: "",
      },

      // Pagination
      pagination: {
        sortBy: "contract_start_date",
        descending: true,
        page: 1,
        rowsPerPage: 10,
      },

      // Table columns
      columns: [
        {
          name: "id",
          label: "ID",
          field: "id",
          sortable: true,
          align: "left",
        },
        {
          name: "property_name",
          label: "Property",
          field: (row) => this.getPropertyName(row.property_id),
          sortable: true,
          align: "left",
        },
        {
          name: "tenant_name",
          label: "Tenant",
          field: "tenant_name",
          sortable: true,
          align: "left",
        },
        {
          name: "monthly_price",
          label: "Monthly Price",
          field: "monthly_price",
          sortable: true,
          align: "right",
        },
        {
          name: "contract_start_date",
          label: "Start Date",
          field: "contract_start_date",
          sortable: true,
          align: "left",
        },
        {
          name: "contract_end_date",
          label: "End Date",
          field: "contract_end_date",
          sortable: true,
          align: "left",
        },
        {
          name: "status",
          label: "Status",
          field: "status",
          sortable: true,
          align: "center",
        },
        {
          name: "actions",
          label: "Actions",
          field: "actions",
          align: "center",
        },
      ],

      // Sample lease data
      leases: [
        {
          id: 1,
          property_id: 1,
          landlord: "John Smith",
          tenant_name: "Alice Johnson",
          tenant_id: "DL123456789",
          tenant_phone: "(555) 123-4567",
          tenant_email: "alice.johnson@email.com",
          contract_sign_date: "2023-01-15",
          contract_start_date: "2023-02-01",
          contract_end_date: "2024-02-01",
          monthly_price: 3500.0,
          pets_info: "1 cat, 1 dog",
          employer_name: "Tech Corp",
          employer_contact: "(555) 987-6543",
          key_terms: "No smoking, pet deposit required",
          auto_renewal: "Auto-renew for 12 months",
          status: "Active",
          versions: [
            { id: 1, created_at: "2023-01-15", type: "Original" },
            { id: 2, created_at: "2023-06-15", type: "Amendment" },
          ],
        },
        {
          id: 2,
          property_id: 2,
          landlord: "Maria Garcia",
          tenant_name: "Bob Wilson",
          tenant_id: "DL987654321",
          tenant_phone: "(555) 456-7890",
          tenant_email: "bob.wilson@email.com",
          contract_sign_date: "2023-03-01",
          contract_start_date: "2023-04-01",
          contract_end_date: "2024-04-01",
          monthly_price: 2800.0,
          pets_info: "No pets",
          employer_name: "Finance Inc",
          employer_contact: "(555) 789-0123",
          key_terms: "No pets allowed",
          auto_renewal: "Month-to-month after expiration",
          status: "Active",
          versions: [{ id: 3, created_at: "2023-03-01", type: "Original" }],
        },
        {
          id: 3,
          property_id: 3,
          landlord: "David Brown",
          tenant_name: "Carol Davis",
          tenant_id: "DL456789123",
          tenant_phone: "(555) 789-4560",
          tenant_email: "carol.davis@email.com",
          contract_sign_date: "2022-06-01",
          contract_start_date: "2022-07-01",
          contract_end_date: "2023-07-01",
          monthly_price: 3200.0,
          pets_info: "1 small dog",
          employer_name: "Marketing Solutions",
          employer_contact: "(555) 321-6540",
          key_terms: "Pet deposit $500",
          auto_renewal: "Manual renewal required",
          status: "Expired",
          versions: [{ id: 4, created_at: "2022-06-01", type: "Original" }],
        },
      ],

      // Properties data
      properties: [
        {
          id: 1,
          nickname: "Sunset Villa",
          address: "123 Sunset Blvd, Los Angeles, CA",
        },
        { id: 2, nickname: "Ocean View", address: "456 Ocean Dr, Miami, FL" },
        {
          id: 3,
          nickname: "Mountain Lodge",
          address: "789 Mountain Rd, Denver, CO",
        },
      ],

      // Dialog states
      leaseDialog: {
        open: false,
        isEditing: false,
        lease: {
          property_id: null,
          landlord: "",
          tenant_name: "",
          tenant_id: "",
          tenant_phone: "",
          tenant_email: "",
          contract_sign_date: "",
          contract_start_date: "",
          contract_end_date: "",
          monthly_price: "",
          pets_info: "",
          employer_name: "",
          employer_contact: "",
          key_terms: "",
          auto_renewal: "",
        },
      },

      leaseDetailsDialog: {
        open: false,
        lease: null,
      },

      // Options
      statusOptions: [
        { label: "All Statuses", value: null },
        { label: "Active", value: "Active" },
        { label: "Expired", value: "Expired" },
        { label: "Terminated", value: "Terminated" },
        { label: "Pending", value: "Pending" },
      ],

      autoRenewalOptions: [
        { label: "Manual renewal required", value: "Manual renewal required" },
        {
          label: "Auto-renew for 12 months",
          value: "Auto-renew for 12 months",
        },
        {
          label: "Month-to-month after expiration",
          value: "Month-to-month after expiration",
        },
        { label: "Auto-renew for 6 months", value: "Auto-renew for 6 months" },
      ],
    };
  },

  computed: {
    propertyOptions() {
      return this.properties.map((p) => ({
        label: p.nickname,
        value: p.id,
      }));
    },

    filteredLeases() {
      let filtered = this.leases;

      if (this.filters.status) {
        filtered = filtered.filter(
          (lease) => lease.status === this.filters.status
        );
      }

      if (this.filters.property) {
        filtered = filtered.filter(
          (lease) => lease.property_id === this.filters.property
        );
      }

      if (this.filters.search) {
        const search = this.filters.search.toLowerCase();
        filtered = filtered.filter(
          (lease) =>
            lease.tenant_name.toLowerCase().includes(search) ||
            this.getPropertyName(lease.property_id)
              .toLowerCase()
              .includes(search)
        );
      }

      return filtered;
    },

    activeLeasesCount() {
      return this.leases.filter((lease) => lease.status === "Active").length;
    },

    expiringLeasesCount() {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      return this.leases.filter((lease) => {
        if (lease.status !== "Active") return false;
        const endDate = new Date(lease.contract_end_date);
        return endDate <= thirtyDaysFromNow;
      }).length;
    },

    terminatedLeasesCount() {
      return this.leases.filter((lease) => lease.status === "Terminated")
        .length;
    },

    totalRevenue() {
      return this.leases
        .filter((lease) => lease.status === "Active")
        .reduce((sum, lease) => sum + lease.monthly_price, 0);
    },
  },

  methods: {
    // Filter methods
    toggleFilterPanel() {
      this.showFilterPanel = !this.showFilterPanel;
    },

    clearFilters() {
      this.filters = {
        status: null,
        property: null,
        search: "",
      };
    },

    // Table methods
    onRequest(props) {
      this.pagination = props.pagination;
    },

    // Status methods
    getStatusColor(status) {
      switch (status) {
        case "Active":
          return "green";
        case "Expired":
          return "orange";
        case "Terminated":
          return "red";
        case "Pending":
          return "blue";
        default:
          return "grey";
      }
    },

    getStatusClass(status) {
      return `status-${status.toLowerCase()}`;
    },

    // Property methods
    getPropertyName(propertyId) {
      const property = this.properties.find((p) => p.id === propertyId);
      return property ? property.nickname : "Unknown Property";
    },

    // Dialog methods
    openCreateLeaseModal() {
      this.leaseDialog.open = true;
      this.leaseDialog.isEditing = false;
      this.leaseDialog.lease = {
        property_id: null,
        landlord: "",
        tenant_name: "",
        tenant_id: "",
        tenant_phone: "",
        tenant_email: "",
        contract_sign_date: "",
        contract_start_date: "",
        contract_end_date: "",
        monthly_price: "",
        pets_info: "",
        employer_name: "",
        employer_contact: "",
        key_terms: "",
        auto_renewal: "",
      };
    },

    closeLeaseModal() {
      this.leaseDialog.open = false;
      this.leaseDialog.isEditing = false;
    },

    saveLease() {
      if (this.leaseDialog.isEditing) {
        // Update existing lease
        const index = this.leases.findIndex(
          (l) => l.id === this.leaseDialog.lease.id
        );
        if (index !== -1) {
          this.leases[index] = JSON.parse(
            JSON.stringify(this.leaseDialog.lease)
          );
        }
      } else {
        // Create new lease
        const newLease = {
          ...JSON.parse(JSON.stringify(this.leaseDialog.lease)),
          id: Math.max(...this.leases.map((l) => l.id)) + 1,
          status: "Active",
          versions: [
            {
              id:
                Math.max(
                  ...this.leases.flatMap((l) => l.versions).map((v) => v.id)
                ) + 1,
              created_at: new Date().toISOString().split("T")[0],
              type: "Original",
            },
          ],
        };
        this.leases.push(newLease);
      }

      this.closeLeaseModal();
      this.$q.notify({
        type: "positive",
        message: this.leaseDialog.isEditing
          ? "Lease updated successfully"
          : "Lease created successfully",
        position: "top",
      });
    },

    viewLeaseDetails(lease) {
      this.leaseDetailsDialog.open = true;
      this.leaseDetailsDialog.lease = JSON.parse(JSON.stringify(lease));
    },

    closeLeaseDetailsModal() {
      this.leaseDetailsDialog.open = false;
      this.leaseDetailsDialog.lease = null;
    },

    editLease(lease) {
      this.leaseDialog.open = true;
      this.leaseDialog.isEditing = true;
      this.leaseDialog.lease = JSON.parse(JSON.stringify(lease));
    },

    extendLease(lease) {
      // Implementation for extending lease
      this.$q.notify({
        type: "info",
        message: "Extend lease functionality to be implemented",
        position: "top",
      });
    },

    renewLease(lease) {
      // Implementation for renewing lease
      this.$q.notify({
        type: "info",
        message: "Renew lease functionality to be implemented",
        position: "top",
      });
    },

    terminateLease(lease) {
      // Implementation for terminating lease
      this.$q.notify({
        type: "info",
        message: "Terminate lease functionality to be implemented",
        position: "top",
      });
    },

    downloadVersion(version) {
      // Implementation for downloading version
      this.$q.notify({
        type: "info",
        message: "Download version functionality to be implemented",
        position: "top",
      });
    },

    openLeaseMenu(lease, event) {
      // Implementation for lease menu
      this.$q.notify({
        type: "info",
        message: "Lease menu functionality to be implemented",
        position: "top",
      });
    },

    handleContractFile(event) {
      // Implementation for handling contract file upload
      this.$q.notify({
        type: "info",
        message: "Contract file upload functionality to be implemented",
        position: "top",
      });
    },

    // Utility methods
    formatDate(dateString) {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },

    formatCurrency(value) {
      if (isNaN(value) || value === null || value === "") return "N/A";
      return `$${parseFloat(value).toFixed(2)}`;
    },
  },
});
</script>

<style scoped>
.lease-management-page {
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

.page-title {
  margin: 0;
  color: #1f2937;
  font-size: 1.875rem;
  font-weight: 700;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.create-lease-btn,
.filter-btn {
  font-weight: 600;
}

/* Filter Panel */
.filter-panel {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filter-row {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.filter-select,
.filter-input {
  min-width: 200px;
}

/* Stats Section */
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  border-radius: 12px;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid;
}

.stat-card.active {
  border-left-color: #10b981;
}

.stat-card.expiring {
  border-left-color: #f59e0b;
}

.stat-card.terminated {
  border-left-color: #ef4444;
}

.stat-card.total {
  border-left-color: #3b82f6;
}

.stat-icon {
  margin-right: 1rem;
}

.stat-content {
  flex: 1;
}

.stat-title {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

/* Table Section */
.leases-table-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.leases-table {
  width: 100%;
}

.rate-value {
  font-weight: 600;
  color: #059669;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 12px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.lease-modal {
  width: 800px;
}

.lease-details-modal {
  width: 900px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: #4f46e5;
  color: white;
  border-radius: 12px 12px 0 0;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.modal-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.modal-close:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.modal-content {
  padding: 1.5rem;
}

/* Form Styles */
.form-section {
  margin-bottom: 2rem;
}

.section-title {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  background: #f9fafb;
  color: #374151;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: #4f46e5;
  color: white;
}

.btn-primary:hover {
  background: #4338ca;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
}

/* Lease Details Styles */
.lease-details {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.lease-status-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
}

.status-active {
  background: #10b981;
}

.status-expired {
  background: #f59e0b;
}

.status-terminated {
  background: #ef4444;
}

.status-pending {
  background: #3b82f6;
}

.lease-actions {
  display: flex;
  gap: 0.5rem;
}

.detail-section {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
}

.detail-section h3 {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
}

.detail-item.full-width {
  grid-column: 1 / -1;
}

.detail-item label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.detail-item span {
  font-size: 1rem;
  color: #374151;
}

.version-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.version-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.version-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.version-date {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.version-type {
  font-size: 0.75rem;
  color: #6b7280;
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-container {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .stats-section {
    grid-template-columns: 1fr;
  }

  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .lease-modal,
  .lease-details-modal {
    width: 95vw;
    margin: 1rem;
  }
}
</style>
