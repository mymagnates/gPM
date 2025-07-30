<template>
  <q-page class="profile-page">
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">User Profile</h1>
          <p class="page-subtitle">
            Manage your profile and property role relationships
          </p>
        </div>
        <div class="header-actions">
          <q-btn
            color="primary"
            icon="edit"
            label="Edit Profile"
            @click="openEditProfileModal"
            class="edit-profile-btn"
          />
        </div>
      </div>

      <!-- User Profile Card -->
      <div class="profile-card">
        <div class="profile-info">
          <div class="profile-avatar">
            <q-icon name="person" size="3rem" color="primary" />
          </div>
          <div class="profile-details">
            <h3 class="profile-name">{{ currentUser.name }}</h3>
            <p class="profile-email">{{ currentUser.email }}</p>
            <p class="profile-phone">{{ currentUser.phone }}</p>
          </div>
        </div>
      </div>

      <!-- Property Role Relationships -->
      <div class="roles-section">
        <div class="section-header">
          <h5 class="section-title">Property Role Relationships</h5>
          <p class="section-description">
            Role relationships can be marked as ended using the "End Role"
            button. Ended roles will be displayed in the history section at the
            bottom of the page.
          </p>
          <q-btn
            color="primary"
            icon="add"
            label="Add Role"
            @click="openAddRoleModal"
            class="add-role-btn"
          />
        </div>

        <!-- Active Role Relationships -->
        <div class="roles-grid">
          <div v-for="role in activeRoles" :key="role.id" class="role-card">
            <div class="role-header">
              <div class="role-info">
                <div class="role-user">{{ getUserName(role.user_id) }}</div>
                <div class="role-property">
                  {{ getPropertyName(role.property_id) }}
                </div>
                <div class="role-type">{{ getRoleDisplayName(role.role) }}</div>
              </div>
              <div class="role-status">
                <q-chip
                  :color="getRoleStatusColor(role)"
                  text-color="white"
                  size="sm"
                  :label="getRoleStatusText(role)"
                />
              </div>
            </div>
            <div class="role-details">
              <div class="detail-row">
                <span class="label">User ID:</span>
                <span class="value">{{ role.user_id }}</span>
              </div>
              <div class="detail-row">
                <span class="label">User Name:</span>
                <span class="value">{{ getUserName(role.user_id) }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Property ID:</span>
                <span class="value">{{ role.property_id }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Property Name:</span>
                <span class="value">{{
                  getPropertyName(role.property_id)
                }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Role:</span>
                <span class="value">{{ getRoleDisplayName(role.role) }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Start Date:</span>
                <span class="value">{{ formatDate(role.start_date) }}</span>
              </div>
              <div class="detail-row">
                <span class="label">End Date:</span>
                <span class="value">{{ role.end_date || "Active" }}</span>
              </div>
            </div>
            <div class="role-actions">
              <q-btn
                flat
                round
                dense
                icon="edit"
                color="primary"
                @click="editRole(role)"
                title="Edit Role"
              />
              <q-btn
                flat
                round
                dense
                icon="block"
                color="warning"
                @click="endRole(role)"
                title="End Role"
              />
            </div>
          </div>
        </div>

        <div v-if="activeRoles.length === 0" class="empty-state">
          <q-icon name="person" size="3rem" color="grey-4" />
          <p>No active role relationships</p>
        </div>
      </div>

      <!-- Ended Role Relationships -->
      <div class="ended-roles-section">
        <h5 class="section-title">Ended Role Relationships</h5>
        <div class="roles-grid">
          <div
            v-for="role in endedRoles"
            :key="role.id"
            class="role-card role-ended"
          >
            <div class="role-header">
              <div class="role-info">
                <div class="role-user">{{ getUserName(role.user_id) }}</div>
                <div class="role-property">
                  {{ getPropertyName(role.property_id) }}
                </div>
                <div class="role-type">{{ getRoleDisplayName(role.role) }}</div>
              </div>
              <div class="role-status">
                <q-chip
                  :color="getRoleStatusColor(role)"
                  text-color="white"
                  size="sm"
                  :label="getRoleStatusText(role)"
                />
              </div>
            </div>
            <div class="role-details">
              <div class="detail-row">
                <span class="label">User ID:</span>
                <span class="value">{{ role.user_id }}</span>
              </div>
              <div class="detail-row">
                <span class="label">User Name:</span>
                <span class="value">{{ getUserName(role.user_id) }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Property ID:</span>
                <span class="value">{{ role.property_id }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Property Name:</span>
                <span class="value">{{
                  getPropertyName(role.property_id)
                }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Role:</span>
                <span class="value">{{ getRoleDisplayName(role.role) }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Start Date:</span>
                <span class="value">{{ formatDate(role.start_date) }}</span>
              </div>
              <div class="detail-row">
                <span class="label">End Date:</span>
                <span class="value">{{ formatDate(role.end_date) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit User Modal -->
    <q-dialog v-model="userDialog.open" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center">
          <div class="text-h6">
            {{ userDialog.isEditing ? "Edit User" : "Add User" }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form @submit="saveUser" class="q-gutter-md">
            <q-input
              v-model="userDialog.user.name"
              label="Name *"
              outlined
              required
            />
            <q-input
              v-model="userDialog.user.email"
              label="Email *"
              type="email"
              outlined
              required
            />
            <q-input v-model="userDialog.user.phone" label="Phone" outlined />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            unelevated
            label="Save User"
            color="primary"
            @click="saveUser"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Add/Edit Role Modal -->
    <q-dialog v-model="roleDialog.open" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center">
          <div class="text-h6">
            {{ roleDialog.isEditing ? "Edit Role" : "Add Role" }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form @submit="saveRole" class="q-gutter-md">
            <q-select
              v-model="roleDialog.role.user_id"
              :options="userOptions"
              label="User *"
              outlined
              required
              @update:model-value="onUserChange"
            />
            <q-select
              v-model="roleDialog.role.property_id"
              :options="propertyOptions"
              label="Property *"
              outlined
              required
            />
            <q-select
              v-model="roleDialog.role.role"
              :options="roleOptions"
              label="Role *"
              outlined
              required
            />
            <q-input
              v-model="roleDialog.role.start_date"
              label="Start Date *"
              type="date"
              outlined
              required
            />
            <q-input
              v-model="roleDialog.role.end_date"
              label="End Date"
              type="date"
              outlined
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            unelevated
            label="Save Role"
            color="primary"
            @click="saveRole"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ProfileView",

  data() {
    return {
      currentUser: {
        id: 1,
        name: "John Smith",
        email: "john.smith@example.com",
        phone: "(555) 123-4567",
      },

      users: [
        {
          id: 1,
          name: "John Smith",
          email: "john.smith@example.com",
          phone: "(555) 123-4567",
        },
        {
          id: 2,
          name: "Maria Garcia",
          email: "maria.garcia@example.com",
          phone: "(555) 234-5678",
        },
        {
          id: 3,
          name: "David Brown",
          email: "david.brown@example.com",
          phone: "(555) 345-6789",
        },
      ],

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

      userRoles: [
        {
          id: 1,
          user_id: 1,
          property_id: 1,
          role: "LL",
          start_date: "2023-01-01",
          end_date: null,
        },
        {
          id: 2,
          user_id: 2,
          property_id: 1,
          role: "PM",
          start_date: "2023-02-01",
          end_date: null,
        },
        {
          id: 3,
          user_id: 3,
          property_id: 2,
          role: "TT",
          start_date: "2023-03-01",
          end_date: "2024-01-15",
        },
      ],

      roleOptions: [
        { label: "Landlord (LL)", value: "LL" },
        { label: "Property Manager (PM)", value: "PM" },
        { label: "Tenant (TT)", value: "TT" },
      ],

      userDialog: {
        open: false,
        isEditing: false,
        user: {
          name: "",
          email: "",
          phone: "",
        },
      },

      roleDialog: {
        open: false,
        isEditing: false,
        role: {
          user_id: null,
          property_id: null,
          role: null,
          start_date: "",
          end_date: "",
        },
      },
    };
  },

  computed: {
    userOptions() {
      return this.users.map((u) => ({
        label: u.name,
        value: u.id,
      }));
    },

    propertyOptions() {
      return this.properties.map((p) => ({
        label: p.nickname,
        value: p.id,
      }));
    },

    activeRoles() {
      return this.userRoles.filter((role) => !role.end_date);
    },

    endedRoles() {
      return this.userRoles.filter((role) => role.end_date);
    },
  },

  methods: {
    getUserName(userId) {
      const user = this.users.find((u) => u.id === userId);
      return user ? user.name : "Unknown User";
    },

    getPropertyName(propertyId) {
      const property = this.properties.find((p) => p.id === propertyId);
      return property ? property.nickname : "Unknown Property";
    },

    getRoleDisplayName(role) {
      switch (role) {
        case "LL":
          return "Landlord";
        case "PM":
          return "Property Manager";
        case "TT":
          return "Tenant";
        default:
          return role;
      }
    },

    getRoleStatusText(role) {
      return role.end_date ? "Ended" : "Active";
    },

    getRoleStatusColor(role) {
      return role.end_date ? "red" : "green";
    },

    getRoleStatusClass(role) {
      return role.end_date ? "role-ended" : "role-active";
    },

    isRoleEnded(role) {
      return !!role.end_date;
    },

    formatDate(dateString) {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },

    onUserChange() {
      // Handle user change if needed
    },

    openEditProfileModal() {
      this.userDialog.open = true;
      this.userDialog.isEditing = true;
      this.userDialog.user = JSON.parse(JSON.stringify(this.currentUser));
    },

    openAddRoleModal() {
      this.roleDialog.open = true;
      this.roleDialog.isEditing = false;
      this.roleDialog.role = {
        user_id: null,
        property_id: null,
        role: null,
        start_date: "",
        end_date: "",
      };
    },

    editRole(role) {
      this.roleDialog.open = true;
      this.roleDialog.isEditing = true;
      this.roleDialog.role = JSON.parse(JSON.stringify(role));
    },

    saveUser() {
      if (this.userDialog.isEditing) {
        // Update current user
        this.currentUser = JSON.parse(JSON.stringify(this.userDialog.user));
      } else {
        // Add new user
        const newUser = {
          ...JSON.parse(JSON.stringify(this.userDialog.user)),
          id: Math.max(...this.users.map((u) => u.id)) + 1,
        };
        this.users.push(newUser);
      }

      this.userDialog.open = false;
      this.$q.notify({
        type: "positive",
        message: this.userDialog.isEditing
          ? "Profile updated successfully"
          : "User added successfully",
        position: "top",
      });
    },

    saveRole() {
      if (this.roleDialog.isEditing) {
        // Update existing role
        const index = this.userRoles.findIndex(
          (r) => r.id === this.roleDialog.role.id
        );
        if (index !== -1) {
          this.userRoles[index] = JSON.parse(
            JSON.stringify(this.roleDialog.role)
          );
        }
      } else {
        // Create new role
        const newRole = {
          ...JSON.parse(JSON.stringify(this.roleDialog.role)),
          id: Math.max(...this.userRoles.map((r) => r.id)) + 1,
        };
        this.userRoles.push(newRole);
      }

      this.roleDialog.open = false;
      this.$q.notify({
        type: "positive",
        message: this.roleDialog.isEditing
          ? "Role updated successfully"
          : "Role added successfully",
        position: "top",
      });
    },

    endRole(role) {
      this.$q
        .dialog({
          title: "Confirm End Role",
          message: "Are you sure you want to end this role relationship?",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          const index = this.userRoles.findIndex((r) => r.id === role.id);
          if (index !== -1) {
            this.userRoles[index].end_date = new Date()
              .toISOString()
              .split("T")[0];
            this.$q.notify({
              type: "positive",
              message: "Role ended successfully",
              position: "top",
            });
          }
        });
    },
  },
});
</script>

<style scoped>
.profile-page {
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
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

.header-content {
  flex: 1;
}

.page-title {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
  font-size: 2.25rem;
  font-weight: 700;
}

.page-subtitle {
  margin: 0;
  color: #6b7280;
  font-size: 1.125rem;
}

.edit-profile-btn {
  font-weight: 600;
}

/* Profile Card */
.profile-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.profile-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: #f3f4f6;
  border-radius: 50%;
}

.profile-details {
  flex: 1;
}

.profile-name {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

.profile-email,
.profile-phone {
  margin: 0 0 0.25rem 0;
  color: #6b7280;
  font-size: 1rem;
}

/* Roles Section */
.roles-section {
  margin-bottom: 3rem;
}

.section-header {
  margin-bottom: 2rem;
}

.section-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

.section-description {
  margin: 0 0 1rem 0;
  color: #6b7280;
  font-size: 1rem;
  line-height: 1.5;
}

.add-role-btn {
  font-weight: 600;
}

.roles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.role-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  transition: all 0.2s;
}

.role-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.role-card.role-ended {
  opacity: 0.7;
  background: #f8fafc;
}

.role-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.role-info {
  flex: 1;
}

.role-user {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.role-property {
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.role-type {
  font-size: 0.875rem;
  color: #9ca3af;
}

.role-status {
  margin-left: 1rem;
}

.role-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.detail-row {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.value {
  font-size: 0.875rem;
  color: #1f2937;
}

.role-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #9ca3af;
}

.empty-state p {
  margin: 1rem 0 0 0;
  font-size: 1.125rem;
}

/* Ended Roles Section */
.ended-roles-section {
  border-top: 2px solid #e5e7eb;
  padding-top: 2rem;
}

.ended-roles-section .section-title {
  color: #6b7280;
  font-size: 1.25rem;
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

  .page-title {
    font-size: 1.875rem;
  }

  .profile-info {
    flex-direction: column;
    text-align: center;
  }

  .roles-grid {
    grid-template-columns: 1fr;
  }

  .role-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .role-status {
    margin-left: 0;
  }

  .role-details {
    grid-template-columns: 1fr;
  }
}
</style>
