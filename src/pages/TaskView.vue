<template>
  <q-page class="task-management-page">
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <h4 class="page-title">Task Management System</h4>
        <div class="header-actions">
          <q-btn
            color="primary"
            icon="add"
            label="Add Task"
            @click="openAddTaskModal"
            class="add-task-btn"
          />
        </div>
      </div>

      <!-- Search and Filter Section -->
      <div class="search-filter-section">
        <div class="search-row">
          <q-input
            v-model="searchTerm"
            placeholder="Search tasks..."
            outlined
            dense
            class="search-input"
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>

          <q-select
            v-model="statusFilter"
            :options="statusOptions"
            label="Status Filter"
            outlined
            dense
            class="filter-select"
            clearable
          />

          <q-select
            v-model="propertyFilter"
            :options="propertyOptions"
            label="Property Filter"
            outlined
            dense
            class="filter-select"
            clearable
          />
        </div>
      </div>

      <!-- Tasks List -->
      <div class="tasks-section">
        <div v-if="filteredTasks.length === 0" class="empty-state">
          <q-icon name="assignment" size="4rem" color="grey-4" />
          <p>No tasks found</p>
        </div>
        <div v-else class="task-list">
          <div v-for="task in filteredTasks" :key="task.id" class="task-card">
            <div class="task-header">
              <div class="task-title">{{ task.observation }}</div>
              <div class="task-actions">
                <q-btn
                  flat
                  round
                  dense
                  icon="visibility"
                  color="primary"
                  @click="viewTaskDetails(task)"
                  title="View Task"
                />
                <q-btn
                  flat
                  round
                  dense
                  icon="edit"
                  color="secondary"
                  @click="editTask(task)"
                  title="Edit Task"
                />
                <q-btn
                  flat
                  round
                  dense
                  icon="delete"
                  color="negative"
                  @click="deleteTask(task)"
                  title="Delete Task"
                />
              </div>
            </div>

            <div class="task-details">
              <div class="detail-row">
                <span class="label">Resolution:</span>
                <span class="value">{{ task.resolution || "Pending" }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Report Date:</span>
                <span class="value">{{ formatDate(task.report_date) }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Resolution Date:</span>
                <span class="value">{{ task.res_date || "Pending" }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Reported By:</span>
                <span class="value">{{ task.report_by }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Property:</span>
                <span class="value">{{
                  getPropertyName(task.property_id)
                }}</span>
              </div>
            </div>

            <div class="task-status">
              <q-chip
                :color="getStatusColor(task.status)"
                text-color="white"
                size="sm"
                :label="task.status"
              />
            </div>

            <!-- Comments Section -->
            <div class="comments-section">
              <h6>Comments ({{ task.comments ? task.comments.length : 0 }})</h6>
              <div class="add-comment">
                <q-input
                  v-model="task.newComment"
                  placeholder="Add a comment..."
                  outlined
                  dense
                  class="comment-input"
                >
                  <template v-slot:append>
                    <q-btn
                      flat
                      round
                      dense
                      icon="send"
                      color="primary"
                      @click="addComment(task)"
                      label="Add Comment"
                    />
                  </template>
                </q-input>
              </div>
              <div class="comments-list">
                <div
                  v-if="!task.comments || task.comments.length === 0"
                  class="no-comments"
                >
                  <p>No comments yet</p>
                </div>
                <div
                  v-else
                  class="comment-item"
                  v-for="comment in task.comments"
                  :key="comment.id"
                >
                  <div class="comment-content">
                    <div class="comment-text">{{ comment.text }}</div>
                    <div class="comment-meta">
                      <span class="comment-author">{{ comment.author }}</span>
                      <span class="comment-date">{{
                        formatDate(comment.date)
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Task Modal -->
    <q-dialog v-model="taskDialog.open" persistent>
      <q-card style="min-width: 500px">
        <q-card-section class="row items-center">
          <div class="text-h6">
            {{ taskDialog.isEditing ? "Edit Task" : "Add Task" }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form @submit="saveTask" class="q-gutter-md">
            <q-select
              v-model="taskDialog.task.property_id"
              :options="propertyOptions"
              label="Property *"
              outlined
              required
            />

            <q-input
              v-model="taskDialog.task.observation"
              label="Observation Description *"
              outlined
              required
              placeholder="Describe the issue or observation..."
            />

            <q-input
              v-model="taskDialog.task.resolution"
              label="Resolution"
              outlined
              placeholder="Describe the resolution..."
            />

            <q-input
              v-model="taskDialog.task.report_date"
              label="Report Date *"
              type="date"
              outlined
              required
            />

            <q-input
              v-model="taskDialog.task.res_date"
              label="Resolution Date"
              type="date"
              outlined
            />

            <q-input
              v-model="taskDialog.task.report_by"
              label="Reported By *"
              outlined
              required
            />

            <q-select
              v-model="taskDialog.task.status"
              :options="statusOptions"
              label="Status"
              outlined
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            unelevated
            label="Save Task"
            color="primary"
            @click="saveTask"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "TaskView",

  data() {
    return {
      searchTerm: "",
      statusFilter: null,
      propertyFilter: null,

      // Sample data
      tasks: [
        {
          id: 1,
          property_id: 1,
          observation: "Fix leaking faucet in kitchen",
          resolution: "Replaced faucet cartridge",
          report_date: "2024-01-15",
          res_date: "2024-01-16",
          status: "Completed",
          report_by: "John Smith",
          comments: [
            {
              id: 1,
              text: "Plumber scheduled for tomorrow",
              author: "Property Manager",
              date: "2024-01-15",
            },
            {
              id: 2,
              text: "Task completed successfully",
              author: "John Smith",
              date: "2024-01-16",
            },
          ],
        },
        {
          id: 2,
          property_id: 2,
          observation: "Replace air filter",
          resolution: "Installed new HEPA filter",
          report_date: "2024-01-14",
          res_date: "2024-01-14",
          status: "Completed",
          report_by: "Maria Garcia",
          comments: [
            {
              id: 3,
              text: "Filter replaced as scheduled",
              author: "Maria Garcia",
              date: "2024-01-14",
            },
          ],
        },
        {
          id: 3,
          property_id: 3,
          observation: "Inspect smoke detectors",
          resolution: "",
          report_date: "2024-01-13",
          res_date: "",
          status: "In Progress",
          report_by: "David Brown",
          comments: [
            {
              id: 4,
              text: "Scheduled for next week",
              author: "David Brown",
              date: "2024-01-13",
            },
          ],
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

      taskDialog: {
        open: false,
        isEditing: false,
        task: {
          property_id: null,
          observation: "",
          resolution: "",
          report_date: "",
          res_date: "",
          status: "Open",
          report_by: "",
        },
      },

      statusOptions: [
        { label: "All Statuses", value: null },
        { label: "Open", value: "Open" },
        { label: "In Progress", value: "In Progress" },
        { label: "Completed", value: "Completed" },
        { label: "Cancelled", value: "Cancelled" },
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

    filteredTasks() {
      let filtered = this.tasks;

      if (this.searchTerm) {
        const search = this.searchTerm.toLowerCase();
        filtered = filtered.filter(
          (task) =>
            task.observation.toLowerCase().includes(search) ||
            task.report_by.toLowerCase().includes(search) ||
            this.getPropertyName(task.property_id)
              .toLowerCase()
              .includes(search)
        );
      }

      if (this.statusFilter) {
        filtered = filtered.filter((task) => task.status === this.statusFilter);
      }

      if (this.propertyFilter) {
        filtered = filtered.filter(
          (task) => task.property_id === this.propertyFilter
        );
      }

      return filtered;
    },
  },

  methods: {
    getPropertyName(propertyId) {
      const property = this.properties.find((p) => p.id === propertyId);
      return property ? property.nickname : "Unknown Property";
    },

    formatDate(dateString) {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },

    getStatusColor(status) {
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

    openAddTaskModal() {
      this.taskDialog.open = true;
      this.taskDialog.isEditing = false;
      this.taskDialog.task = {
        property_id: null,
        observation: "",
        resolution: "",
        report_date: "",
        res_date: "",
        status: "Open",
        report_by: "",
      };
    },

    editTask(task) {
      this.taskDialog.open = true;
      this.taskDialog.isEditing = true;
      this.taskDialog.task = JSON.parse(JSON.stringify(task));
    },

    saveTask() {
      if (this.taskDialog.isEditing) {
        // Update existing task
        const index = this.tasks.findIndex(
          (t) => t.id === this.taskDialog.task.id
        );
        if (index !== -1) {
          this.tasks[index] = JSON.parse(JSON.stringify(this.taskDialog.task));
        }
      } else {
        // Create new task
        const newTask = {
          ...JSON.parse(JSON.stringify(this.taskDialog.task)),
          id: Math.max(...this.tasks.map((t) => t.id)) + 1,
          comments: [],
        };
        this.tasks.push(newTask);
      }

      this.taskDialog.open = false;
      this.$q.notify({
        type: "positive",
        message: this.taskDialog.isEditing
          ? "Task updated successfully"
          : "Task created successfully",
        position: "top",
      });
    },

    deleteTask(task) {
      this.$q
        .dialog({
          title: "Confirm Delete",
          message: "Are you sure you want to delete this task?",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          const index = this.tasks.findIndex((t) => t.id === task.id);
          if (index !== -1) {
            this.tasks.splice(index, 1);
            this.$q.notify({
              type: "positive",
              message: "Task deleted successfully",
              position: "top",
            });
          }
        });
    },

    viewTaskDetails(task) {
      this.$q.notify({
        type: "info",
        message: `Viewing task: ${task.observation}`,
        position: "top",
      });
    },

    addComment(task) {
      if (!task.newComment || task.newComment.trim() === "") return;

      if (!task.comments) {
        task.comments = [];
      }

      const newComment = {
        id: Math.max(...task.comments.map((c) => c.id), 0) + 1,
        text: task.newComment.trim(),
        author: "Current User",
        date: new Date().toISOString().split("T")[0],
      };

      task.comments.push(newComment);
      task.newComment = "";

      this.$q.notify({
        type: "positive",
        message: "Comment added successfully",
        position: "top",
      });
    },
  },
});
</script>

<style scoped>
.task-management-page {
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

.add-task-btn {
  font-weight: 600;
}

/* Search and Filter Section */
.search-filter-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.search-row {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-input {
  min-width: 300px;
  flex: 1;
}

.filter-select {
  min-width: 200px;
}

/* Tasks Section */
.tasks-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

.task-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.task-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.task-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  flex: 1;
  margin-right: 1rem;
}

.task-actions {
  display: flex;
  gap: 0.5rem;
}

.task-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.detail-row {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
}

.value {
  font-size: 1rem;
  color: #1f2937;
}

.task-status {
  margin-bottom: 1.5rem;
}

/* Comments Section */
.comments-section {
  border-top: 1px solid #e5e7eb;
  padding-top: 1.5rem;
}

.comments-section h6 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.add-comment {
  margin-bottom: 1rem;
}

.comment-input {
  width: 100%;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.no-comments {
  text-align: center;
  padding: 2rem;
  color: #9ca3af;
}

.comment-item {
  background: #f8fafc;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #e2e8f0;
}

.comment-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.comment-text {
  font-size: 0.875rem;
  color: #1f2937;
  line-height: 1.5;
}

.comment-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.comment-author {
  font-weight: 500;
}

.comment-date {
  color: #9ca3af;
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

  .search-row {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    min-width: auto;
  }

  .filter-select {
    min-width: auto;
  }

  .task-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .task-actions {
    align-self: flex-end;
  }

  .task-details {
    grid-template-columns: 1fr;
  }
}
</style>
