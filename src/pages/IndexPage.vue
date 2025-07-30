<template>
  <q-page class="dashboard-page">
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <p class="page-subtitle">Steer your property portfolio with ease.</p>
        </div>
      </div>

      <!-- Quick Actions Panel -->
      <div v-if="showQuickActions" class="quick-actions-panel">
        <div class="actions-grid">
          <div class="action-card" @click="openCreatePropertyModal">
            <div class="action-icon">
              <q-icon name="home" size="2rem" color="primary" />
            </div>
            <div class="action-content">
              <h3>New Property</h3>
              <p>Add a new property to your portfolio</p>
            </div>
          </div>

          <div class="action-card" @click="openCreateTaskModal">
            <div class="action-icon">
              <q-icon name="assignment" size="2rem" color="orange" />
            </div>
            <div class="action-content">
              <h3>New Task</h3>
              <p>Create a maintenance or management task</p>
            </div>
          </div>

          <div class="action-card" @click="openCreateTransactionModal">
            <div class="action-icon">
              <q-icon name="account_balance_wallet" size="2rem" color="green" />
            </div>
            <div class="action-content">
              <h3>New Transaction</h3>
              <p>Record income or expense</p>
            </div>
          </div>

          <div class="action-card" @click="openCreateLeaseModal">
            <div class="action-icon">
              <q-icon name="description" size="2rem" color="blue" />
            </div>
            <div class="action-content">
              <h3>New Lease</h3>
              <p>Create a new lease agreement</p>
            </div>
          </div>
        </div>
      </div>
      <div class="dashboard-card reminders-card">
        <div class="card-header">
          <h3 class="card-title">
            <q-icon name="schedule" color="purple" />
            Work Reminders
          </h3>
          <q-btn flat round dense icon="more_vert" @click="openRemindersMenu" />
        </div>
        <div class="card-content">
          <div v-if="workReminders.length === 0" class="empty-state">
            <q-icon name="schedule" size="3rem" color="grey-4" />
            <p>No pending reminders</p>
          </div>
          <div v-else class="reminder-carousel">
            <q-carousel
              v-model="currentReminderIndex"
              animated
              arrows
              navigation
              height="120px"
              class="reminder-carousel-component"
            >
              <q-carousel-slide
                v-for="(reminder, index) in workReminders"
                :key="reminder.id"
                :name="index"
                class="reminder-slide"
                @click="viewReminderDetails(reminder)"
              >
                <div class="reminder-carousel-content">
                  <div class="reminder-carousel-info">
                    <div class="reminder-carousel-title">
                      {{ reminder.title }}
                    </div>
                    <div class="reminder-carousel-details">
                      <span class="reminder-carousel-property">{{
                        getPropertyName(reminder.property_id)
                      }}</span>
                      <span class="reminder-carousel-date">{{
                        formatDate(reminder.due_date)
                      }}</span>
                    </div>
                  </div>
                  <div class="reminder-carousel-priority">
                    <q-chip
                      :color="getPriorityColor(reminder.priority)"
                      text-color="white"
                      size="sm"
                      :label="reminder.priority"
                    />
                  </div>
                </div>
              </q-carousel-slide>
            </q-carousel>
          </div>
        </div>
      </div>
      <!-- Dashboard Grid -->
      <div class="dashboard-grid">
        <!-- Property Status -->
        <div class="dashboard-card property-status-card">
          <div class="card-header">
            <h3 class="card-title">
              <q-icon name="home" color="blue" />
              Property Status
            </h3>
            <q-btn
              flat
              round
              dense
              icon="more_vert"
              @click="openPropertyStatusMenu"
            />
          </div>
          <div class="card-content">
            <div class="property-status-grid">
              <div
                v-for="property in properties"
                :key="property.id"
                class="property-status-item"
                @click="viewPropertyDetails(property)"
              >
                <div class="property-info">
                  <div class="property-name">{{ property.nickname }}</div>
                  <div class="property-address">{{ property.address }}</div>
                </div>
                <div class="property-status">
                  <q-chip
                    :color="
                      getLeaseStatusColor(property.lease?.status || 'Available')
                    "
                    text-color="white"
                    size="sm"
                    :label="
                      getLeaseStatusText(property.lease?.status || 'Available')
                    "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Transactions -->
        <div class="dashboard-card transactions-card">
          <div class="card-header">
            <h3 class="card-title">
              <q-icon name="account_balance_wallet" color="green" />
              Recent Transactions
            </h3>
            <q-btn
              flat
              round
              dense
              icon="more_vert"
              @click="openTransactionsMenu"
            />
          </div>
          <div class="card-content">
            <div v-if="recentTransactions.length === 0" class="empty-state">
              <q-icon
                name="account_balance_wallet"
                size="3rem"
                color="grey-4"
              />
              <p>No recent transactions</p>
            </div>
            <div v-else class="transaction-list">
              <div
                v-for="transaction in recentTransactions"
                :key="transaction.id"
                class="transaction-item"
                @click="viewTransactionDetails(transaction)"
              >
                <div class="transaction-info">
                  <div class="transaction-title">
                    {{ transaction.from }} → {{ transaction.to }}
                  </div>
                  <div class="transaction-details">
                    <span class="transaction-property">{{
                      getPropertyName(transaction.property_id)
                    }}</span>
                    <span class="transaction-date">{{
                      formatDate(transaction.date)
                    }}</span>
                  </div>
                </div>
                <div
                  class="transaction-amount"
                  :class="transaction.type === 'income' ? 'income' : 'expense'"
                >
                  {{ formatCurrency(transaction.amount) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Tasks -->
        <div class="dashboard-card tasks-card">
          <div class="card-header">
            <h3 class="card-title">
              <q-icon name="assignment" color="orange" />
              Recent Tasks
            </h3>
            <q-btn flat round dense icon="more_vert" @click="openTasksMenu" />
          </div>
          <div class="card-content">
            <div v-if="recentTasks.length === 0" class="empty-state">
              <q-icon name="assignment" size="3rem" color="grey-4" />
              <p>No recent tasks</p>
            </div>
            <div v-else class="task-list">
              <div
                v-for="task in recentTasks"
                :key="task.id"
                class="task-item"
                @click="viewTaskDetails(task)"
              >
                <div class="task-info">
                  <div class="task-title">{{ task.observation }}</div>
                  <div class="task-details">
                    <span class="task-property">{{
                      getPropertyName(task.property_id)
                    }}</span>
                    <span class="task-date">{{
                      formatDate(task.report_date)
                    }}</span>
                  </div>
                </div>
                <div class="task-status">
                  <q-chip
                    :color="getTaskStatusColor(task.status)"
                    text-color="white"
                    size="sm"
                    :label="task.status"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Work Reminders Carousel -->
      </div>
    </div>

    <!-- Create Property Modal -->
    <q-dialog v-model="createPropertyDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center">
          <div class="text-h6">Create New Property</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form @submit="saveProperty" class="q-gutter-md">
            <q-input
              v-model="newProperty.nickname"
              label="Property Name *"
              outlined
              required
            />
            <q-input
              v-model="newProperty.address"
              label="Address *"
              outlined
              required
            />
            <q-input
              v-model="newProperty.property_type"
              label="Property Type"
              outlined
            />
            <q-input
              v-model.number="newProperty.square_feet"
              label="Square Feet"
              type="number"
              outlined
            />
            <q-input
              v-model.number="newProperty.bedrooms"
              label="Bedrooms"
              type="number"
              outlined
            />
            <q-input
              v-model.number="newProperty.bathrooms"
              label="Bathrooms"
              type="number"
              outlined
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            unelevated
            label="Create Property"
            color="primary"
            @click="saveProperty"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Create Task Modal -->
    <q-dialog v-model="createTaskDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center">
          <div class="text-h6">Create New Task</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form @submit="saveTask" class="q-gutter-md">
            <q-select
              v-model="newTask.property_id"
              :options="propertyOptions"
              label="Property *"
              outlined
              required
            />
            <q-input
              v-model="newTask.observation"
              label="Task Description *"
              outlined
              required
            />
            <q-input
              v-model="newTask.report_by"
              label="Reported By *"
              outlined
              required
            />
            <q-input
              v-model="newTask.report_date"
              label="Report Date *"
              type="date"
              outlined
              required
            />
            <q-select
              v-model="newTask.status"
              :options="taskStatusOptions"
              label="Status"
              outlined
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            unelevated
            label="Create Task"
            color="primary"
            @click="saveTask"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Create Transaction Modal -->
    <q-dialog v-model="createTransactionDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center">
          <div class="text-h6">Create New Transaction</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form @submit="saveTransaction" class="q-gutter-md">
            <q-select
              v-model="newTransaction.property_id"
              :options="propertyOptions"
              label="Property *"
              outlined
              required
            />
            <q-input
              v-model="newTransaction.from"
              label="From *"
              outlined
              required
            />
            <q-input
              v-model="newTransaction.to"
              label="To *"
              outlined
              required
            />
            <q-input
              v-model.number="newTransaction.amount"
              label="Amount *"
              type="number"
              step="0.01"
              outlined
              required
            />
            <q-select
              v-model="newTransaction.type"
              :options="transactionTypeOptions"
              label="Transaction Type *"
              outlined
              required
            />
            <q-input
              v-model="newTransaction.date"
              label="Date *"
              type="date"
              outlined
              required
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            unelevated
            label="Create Transaction"
            color="primary"
            @click="saveTransaction"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Create Lease Modal -->
    <q-dialog v-model="createLeaseDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center">
          <div class="text-h6">Create New Lease</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form @submit="saveLease" class="q-gutter-md">
            <q-select
              v-model="newLease.property_id"
              :options="propertyOptions"
              label="Property *"
              outlined
              required
            />
            <q-input
              v-model="newLease.landlord"
              label="Landlord *"
              outlined
              required
            />
            <q-input
              v-model="newLease.tenant_name"
              label="Tenant Name *"
              outlined
              required
            />
            <q-input
              v-model="newLease.contract_start_date"
              label="Start Date *"
              type="date"
              outlined
              required
            />
            <q-input
              v-model="newLease.contract_end_date"
              label="End Date *"
              type="date"
              outlined
              required
            />
            <q-input
              v-model.number="newLease.monthly_price"
              label="Monthly Price *"
              type="number"
              step="0.01"
              outlined
              required
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            unelevated
            label="Create Lease"
            color="primary"
            @click="saveLease"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "IndexPage",

  data() {
    return {
      showQuickActions: true,
      currentReminderIndex: 0,

      // Modal states
      createPropertyDialog: false,
      createTaskDialog: false,
      createTransactionDialog: false,
      createLeaseDialog: false,

      // New item forms
      newProperty: {
        nickname: "",
        address: "",
        property_type: "",
        square_feet: null,
        bedrooms: null,
        bathrooms: null,
      },

      newTask: {
        property_id: null,
        observation: "",
        report_by: "",
        report_date: "",
        status: "Open",
      },

      newTransaction: {
        property_id: null,
        from: "",
        to: "",
        amount: null,
        type: "income",
        date: "",
        currency: "USD",
      },

      newLease: {
        property_id: null,
        landlord: "",
        tenant_name: "",
        contract_start_date: "",
        contract_end_date: "",
        monthly_price: null,
      },

      // Sample data
      properties: [
        {
          id: 1,
          nickname: "Sunset Villa",
          address: "123 Sunset Blvd, Los Angeles, CA",
          lease: { status: "Active" },
        },
        {
          id: 2,
          nickname: "Ocean View",
          address: "456 Ocean Dr, Miami, FL",
          lease: { status: "Available" },
        },
        {
          id: 3,
          nickname: "Mountain Lodge",
          address: "789 Mountain Rd, Denver, CO",
          lease: { status: "Active" },
        },
      ],

      recentTasks: [
        {
          id: 1,
          property_id: 1,
          observation: "Fix leaking faucet in kitchen",
          report_date: "2024-01-15",
          status: "Open",
          report_by: "John Smith",
        },
        {
          id: 2,
          property_id: 2,
          observation: "Replace air filter",
          report_date: "2024-01-14",
          status: "Completed",
          report_by: "Maria Garcia",
        },
        {
          id: 3,
          property_id: 3,
          observation: "Inspect smoke detectors",
          report_date: "2024-01-13",
          status: "In Progress",
          report_by: "David Brown",
        },
      ],

      recentTransactions: [
        {
          id: 1,
          property_id: 1,
          from: "Tenant",
          to: "Landlord",
          amount: 3500.0,
          type: "income",
          date: "2024-01-01",
        },
        {
          id: 2,
          property_id: 2,
          from: "Landlord",
          to: "Plumber",
          amount: 150.0,
          type: "expense",
          date: "2024-01-02",
        },
        {
          id: 3,
          property_id: 3,
          from: "Tenant",
          to: "Landlord",
          amount: 2800.0,
          type: "income",
          date: "2024-01-01",
        },
      ],

      workReminders: [
        {
          id: 1,
          property_id: 1,
          title: "Annual HVAC inspection",
          due_date: "2024-02-15",
          priority: "High",
        },
        {
          id: 2,
          property_id: 2,
          title: "Fire extinguisher check",
          due_date: "2024-01-30",
          priority: "Medium",
        },
        {
          id: 3,
          property_id: 3,
          title: "Gutter cleaning",
          due_date: "2024-02-01",
          priority: "Low",
        },
      ],

      // Options
      taskStatusOptions: [
        { label: "Open", value: "Open" },
        { label: "In Progress", value: "In Progress" },
        { label: "Completed", value: "Completed" },
        { label: "Cancelled", value: "Cancelled" },
      ],

      transactionTypeOptions: [
        { label: "Income", value: "income" },
        { label: "Expense", value: "expense" },
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
  },

  methods: {
    // Quick action methods
    openCreatePropertyModal() {
      this.createPropertyDialog = true;
      this.showQuickActions = false;
    },

    openCreateTaskModal() {
      this.createTaskDialog = true;
      this.showQuickActions = false;
    },

    openCreateTransactionModal() {
      this.createTransactionDialog = true;
      this.showQuickActions = false;
    },

    openCreateLeaseModal() {
      this.createLeaseDialog = true;
      this.showQuickActions = false;
    },

    // Save methods
    saveProperty() {
      const newProperty = {
        ...this.newProperty,
        id: Math.max(...this.properties.map((p) => p.id)) + 1,
        lease: { status: "Available" },
      };
      this.properties.push(newProperty);

      // Reset form
      this.newProperty = {
        nickname: "",
        address: "",
        property_type: "",
        square_feet: null,
        bedrooms: null,
        bathrooms: null,
      };

      this.createPropertyDialog = false;
      this.$q.notify({
        type: "positive",
        message: "Property created successfully",
        position: "top",
      });
    },

    saveTask() {
      const newTask = {
        ...this.newTask,
        id: Math.max(...this.recentTasks.map((t) => t.id)) + 1,
      };
      this.recentTasks.unshift(newTask);

      // Reset form
      this.newTask = {
        property_id: null,
        observation: "",
        report_by: "",
        report_date: "",
        status: "Open",
      };

      this.createTaskDialog = false;
      this.$q.notify({
        type: "positive",
        message: "Task created successfully",
        position: "top",
      });
    },

    saveTransaction() {
      const newTransaction = {
        ...this.newTransaction,
        id: Math.max(...this.recentTransactions.map((t) => t.id)) + 1,
      };
      this.recentTransactions.unshift(newTransaction);

      // Reset form
      this.newTransaction = {
        property_id: null,
        from: "",
        to: "",
        amount: null,
        type: "income",
        date: "",
        currency: "USD",
      };

      this.createTransactionDialog = false;
      this.$q.notify({
        type: "positive",
        message: "Transaction created successfully",
        position: "top",
      });
    },

    saveLease() {
      const newLease = {
        ...this.newLease,
        id:
          Math.max(
            ...this.properties.flatMap((p) => (p.lease ? [p.lease.id] : []))
          ) + 1,
        status: "Active",
      };

      // Update property lease status
      const propertyIndex = this.properties.findIndex(
        (p) => p.id === this.newLease.property_id
      );
      if (propertyIndex !== -1) {
        this.properties[propertyIndex].lease = newLease;
      }

      // Reset form
      this.newLease = {
        property_id: null,
        landlord: "",
        tenant_name: "",
        contract_start_date: "",
        contract_end_date: "",
        monthly_price: null,
      };

      this.createLeaseDialog = false;
      this.$q.notify({
        type: "positive",
        message: "Lease created successfully",
        position: "top",
      });
    },

    // Utility methods
    getPropertyName(propertyId) {
      const property = this.properties.find((p) => p.id === propertyId);
      return property ? property.nickname : "Unknown Property";
    },

    formatDate(dateString) {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },

    formatCurrency(value) {
      if (isNaN(value) || value === null || value === "") return "N/A";
      return `$${parseFloat(value).toFixed(2)}`;
    },

    getTaskStatusColor(status) {
      switch (status) {
        case "Open":
          return "orange";
        case "In Progress":
          return "blue";
        case "Completed":
          return "green";
        case "Cancelled":
          return "red";
        default:
          return "grey";
      }
    },

    getLeaseStatusColor(status) {
      switch (status) {
        case "Active":
          return "green";
        case "Available":
          return "orange";
        case "Expired":
          return "red";
        default:
          return "grey";
      }
    },

    getLeaseStatusText(status) {
      switch (status) {
        case "Active":
          return "Leased";
        case "Available":
          return "Available";
        case "Expired":
          return "Expired";
        default:
          return "Unknown";
      }
    },

    getPriorityColor(priority) {
      switch (priority) {
        case "High":
          return "red";
        case "Medium":
          return "orange";
        case "Low":
          return "green";
        default:
          return "grey";
      }
    },

    // View detail methods
    viewPropertyDetails(property) {
      this.$q.notify({
        type: "info",
        message: `Viewing details for ${property.nickname}`,
        position: "top",
      });
      // TODO: Navigate to property details page or open modal
    },

    viewTransactionDetails(transaction) {
      this.$q.notify({
        type: "info",
        message: `Viewing transaction: ${transaction.from} → ${transaction.to}`,
        position: "top",
      });
      // TODO: Navigate to transaction details page or open modal
    },

    viewTaskDetails(task) {
      this.$q.notify({
        type: "info",
        message: `Viewing task: ${task.observation}`,
        position: "top",
      });
      // TODO: Navigate to task details page or open modal
    },

    viewReminderDetails(reminder) {
      this.$q.notify({
        type: "info",
        message: `Viewing reminder: ${reminder.title}`,
        position: "top",
      });
      // TODO: Navigate to reminder details page or open modal
    },

    // Menu methods
    openTasksMenu() {
      this.$q.notify({
        type: "info",
        message: "Tasks menu functionality to be implemented",
        position: "top",
      });
    },

    openTransactionsMenu() {
      this.$q.notify({
        type: "info",
        message: "Transactions menu functionality to be implemented",
        position: "top",
      });
    },

    openRemindersMenu() {
      this.$q.notify({
        type: "info",
        message: "Reminders menu functionality to be implemented",
        position: "top",
      });
    },

    openPropertyStatusMenu() {
      this.$q.notify({
        type: "info",
        message: "Property status menu functionality to be implemented",
        position: "top",
      });
    },
  },
});
</script>

<style scoped>
.dashboard-page {
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

.quick-actions-btn {
  font-weight: 600;
}

/* Quick Actions Panel */
.quick-actions-panel {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.action-card {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  border-radius: 8px;
  background: #f8fafc;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.action-card:hover {
  border-color: #4f46e5;
  background: #f0f4ff;
  transform: translateY(-2px);
}

.action-icon {
  margin-right: 1rem;
}

.action-content h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.action-content p {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
}

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.dashboard-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f8fafc;
}

.card-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-content {
  padding: 1.5rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #9ca3af;
}

.empty-state p {
  margin: 1rem 0 0 0;
  font-size: 0.875rem;
}

/* Task List */
.task-list,
.transaction-list,
.reminder-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.task-item,
.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s;
}

.task-item:hover,
.transaction-item:hover {
  background: #f0f4ff;
  border-color: #4f46e5;
  transform: translateY(-1px);
}

.task-info,
.transaction-info {
  flex: 1;
}

.task-title,
.transaction-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.task-details,
.transaction-details {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.task-property,
.transaction-property {
  font-weight: 500;
}

.task-date,
.transaction-date {
  color: #9ca3af;
}

.transaction-amount {
  font-weight: 600;
  font-size: 1.125rem;
}

.transaction-amount.income {
  color: #059669;
}

.transaction-amount.expense {
  color: #dc2626;
}

/* Property Status Grid */
.property-status-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.property-status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s;
}

.property-status-item:hover {
  background: #f0f4ff;
  border-color: #4f46e5;
  transform: translateY(-1px);
}

/* Reminder Carousel */
.reminder-carousel {
  width: 100%;
}

.reminder-carousel-component {
  border-radius: 8px;
  overflow: hidden;
}

.reminder-slide {
  cursor: pointer;
  transition: all 0.2s;
}

.reminder-slide:hover {
  background: #f0f4ff;
}

.reminder-carousel-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  height: 100%;
}

.reminder-carousel-info {
  flex: 1;
}

.reminder-carousel-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
  font-size: 1rem;
}

.reminder-carousel-details {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.reminder-carousel-property {
  font-weight: 500;
}

.reminder-carousel-date {
  color: #9ca3af;
}

.reminder-carousel-priority {
  margin-left: 1rem;
}

.property-info {
  flex: 1;
}

.property-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.property-address {
  font-size: 0.875rem;
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

  .page-title {
    font-size: 1.875rem;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .task-item,
  .transaction-item,
  .property-status-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .task-details,
  .transaction-details {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>
