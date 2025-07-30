<template>
  <div class="property-manager">
    <!-- Header Section -->
    <div class="header">
      <h1>Property Portfolio</h1>
      <p>Manage your real estate investments with style</p>
    </div>

    <!-- Search Section -->
    <div class="search-section">
      <div class="search-bar">
        <i class="fas fa-search search-icon"></i>
        <input
          type="text"
          class="search-input"
          placeholder="Search properties..."
          v-model="searchTerm"
          @input="filterProperties"
        />
      </div>
      <div>
        <button
          class="btn btn-primary add-property-btn"
          @click="openAddPropertyModal"
        >
          <i class="fas fa-plus"></i>
          Add Property
        </button>
      </div>
    </div>

    <!-- Properties Grid -->
    <div class="properties-grid">
      <div
        v-for="(property, index) in filteredProperties"
        :key="property.id"
        class="property-card"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <div class="card-header">
          <div class="property-type">{{ property.asset_type }}</div>
          <div class="property-title">{{ property.nickname }}</div>
          <div class="property-address">
            {{ property.address.street }}, {{ property.address.city }},
            {{ property.address.state }} {{ property.address.zip }}
          </div>
        </div>

        <div class="card-content">
          <!-- Lease Status Section -->
          <div class="lease-status-section">
            <div
              class="lease-status-bar"
              :class="getLeaseStatusClass(property)"
              @click="openLeaseDetails(property)"
            >
              <div class="status-icon">
                <i :class="getLeaseStatusIcon(property)"></i>
              </div>
              <div class="status-info">
                <div class="status-text">
                  {{ getLeaseStatusText(property) }}
                </div>
                <div class="status-details">
                  {{ getLeaseStatusDetails(property) }}
                </div>
              </div>
              <div class="status-action">
                <i class="fas fa-chevron-right"></i>
              </div>
            </div>
          </div>

          <div class="property-stats">
            <div class="stat-item">
              <span class="stat-value">{{ property.bedroom }}</span>
              <span class="stat-label">Bedrooms</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ property.full_bathroom }}</span>
              <span class="stat-label">Bathrooms</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ property.size }}</span>
              <span class="stat-label">Sq Ft</span>
            </div>
          </div>

          <div class="property-details">
            <div class="detail-item">
              <i class="fas fa-calendar-alt detail-icon"></i>
              <span class="detail-text">Built {{ property.build_year }}</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-building detail-icon"></i>
              <span class="detail-text">{{ property.story }} Stories</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-car detail-icon"></i>
              <span class="detail-text">{{ property.garage }} Garage</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-ruler-combined detail-icon"></i>
              <span class="detail-text"
                >{{ property.lot_size || "N/A" }} Lot</span
              >
            </div>
          </div>

          <div v-if="property.comment" class="property-comment">
            <i class="fas fa-quote-left quote-icon"></i>
            {{ property.comment }}
          </div>

          <div v-if="property.hoa_name" class="hoa-info">
            <div class="hoa-title">
              <i class="fas fa-users hoa-icon"></i>
              {{ property.hoa_name }}
            </div>
            <div class="hoa-contact">{{ property.hoa_contact }}</div>
          </div>
        </div>

        <div class="card-actions">
          <button
            class="btn btn-primary"
            @click="openEditModal(property, index)"
          >
            <i class="fas fa-edit"></i>
            Edit
          </button>
          <button
            class="btn btn-secondary"
            @click="openEquipmentModal(property, index)"
          >
            <i class="fas fa-tools"></i>
            Equipment
          </button>
          <button class="btn btn-info" @click="openTaskModal(property, index)">
            <i class="fas fa-tasks"></i>
            Tasks
          </button>
        </div>
      </div>
    </div>

    <!-- Add Property Modal -->
    <div
      v-if="addPropertyDialog.open"
      class="modal-overlay"
      @click.self="closeAddPropertyModal"
    >
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">
            <i class="fas fa-plus-circle"></i>
            Add New Property
          </h2>
        </div>
        <div class="modal-content">
          <form @submit.prevent="saveNewProperty">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Property Name *</label>
                <input
                  type="text"
                  class="form-input"
                  v-model="newProperty.nickname"
                  placeholder="e.g., Sunset Villa"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">Property Type *</label>
                <select
                  class="form-input"
                  v-model="newProperty.asset_type"
                  required
                >
                  <option value="">Select type...</option>
                  <option value="House">House</option>
                  <option value="Condo">Condo</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Land">Land</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Build Year *</label>
                <input
                  type="number"
                  class="form-input"
                  v-model="newProperty.build_year"
                  placeholder="e.g., 2010"
                  min="1800"
                  :max="new Date().getFullYear()"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">Stories *</label>
                <input
                  type="number"
                  class="form-input"
                  v-model="newProperty.story"
                  placeholder="e.g., 2"
                  min="1"
                  max="10"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">Bedrooms *</label>
                <input
                  type="number"
                  class="form-input"
                  v-model="newProperty.bedroom"
                  placeholder="e.g., 3"
                  min="0"
                  max="20"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">Full Bathrooms *</label>
                <input
                  type="number"
                  class="form-input"
                  v-model="newProperty.full_bathroom"
                  placeholder="e.g., 2"
                  min="0"
                  max="10"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">Half Bathrooms</label>
                <input
                  type="number"
                  class="form-input"
                  v-model="newProperty.half_bathroom"
                  placeholder="e.g., 1"
                  min="0"
                  max="5"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Garage Spots</label>
                <input
                  type="number"
                  class="form-input"
                  v-model="newProperty.garage"
                  placeholder="e.g., 2"
                  min="0"
                  max="10"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Size (sq ft) *</label>
                <input
                  type="number"
                  class="form-input"
                  v-model="newProperty.size"
                  placeholder="e.g., 2500"
                  min="1"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">Lot Size (sq ft)</label>
                <input
                  type="number"
                  class="form-input"
                  v-model="newProperty.lot_size"
                  placeholder="e.g., 5000"
                  min="0"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Street Address *</label>
                <input
                  type="text"
                  class="form-input"
                  v-model="newProperty.address.street"
                  placeholder="e.g., 123 Main St"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">City *</label>
                <input
                  type="text"
                  class="form-input"
                  v-model="newProperty.address.city"
                  placeholder="e.g., San Francisco"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">State *</label>
                <input
                  type="text"
                  class="form-input"
                  v-model="newProperty.address.state"
                  placeholder="e.g., CA"
                  maxlength="2"
                  style="text-transform: uppercase"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">ZIP Code *</label>
                <input
                  type="text"
                  class="form-input"
                  v-model="newProperty.address.zip"
                  placeholder="e.g., 94102"
                  pattern="[0-9]{5}(-[0-9]{4})?"
                  title="Please enter a valid ZIP code"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">Kitchen Count</label>
                <input
                  type="number"
                  class="form-input"
                  v-model="newProperty.kitchen"
                  placeholder="e.g., 1"
                  min="0"
                  max="5"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Meeting Rooms</label>
                <input
                  type="number"
                  class="form-input"
                  v-model="newProperty.meeting_room"
                  placeholder="e.g., 0"
                  min="0"
                  max="10"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Office Count</label>
                <input
                  type="number"
                  class="form-input"
                  v-model="newProperty.office"
                  placeholder="e.g., 1"
                  min="0"
                  max="10"
                />
              </div>
              <div class="form-group">
                <label class="form-label">HOA Name</label>
                <input
                  type="text"
                  class="form-input"
                  v-model="newProperty.hoa_name"
                  placeholder="e.g., Sunset HOA"
                />
              </div>
              <div class="form-group">
                <label class="form-label">HOA Contact</label>
                <input
                  type="text"
                  class="form-input"
                  v-model="newProperty.hoa_contact"
                  placeholder="e.g., 555-1234 or email@hoa.com"
                />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Comments</label>
              <textarea
                class="form-input form-textarea"
                v-model="newProperty.comment"
                placeholder="Additional notes about this property..."
                rows="3"
              ></textarea>
            </div>
            <div class="form-actions">
              <button
                type="button"
                class="btn btn-secondary"
                @click="closeAddPropertyModal"
              >
                <i class="fas fa-times"></i>
                Cancel
              </button>
              <button type="submit" class="btn btn-primary">
                <i class="fas fa-save"></i>
                Add Property
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div
      v-if="editDialog.open"
      class="modal-overlay"
      @click.self="closeEditModal"
    >
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">
            <i class="fas fa-edit"></i>
            Edit Property
          </h2>
        </div>
        <div class="modal-content">
          <form @submit.prevent="saveEdit">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Property Name</label>
                <input
                  type="text"
                  class="form-input"
                  v-model="editDialog.form.nickname"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">Property Type</label>
                <input
                  type="text"
                  class="form-input"
                  v-model="editDialog.form.asset_type"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">Build Year</label>
                <input
                  type="number"
                  class="form-input"
                  v-model="editDialog.form.build_year"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">Stories</label>
                <input
                  type="number"
                  class="form-input"
                  v-model="editDialog.form.story"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">Bedrooms</label>
                <input
                  type="number"
                  class="form-input"
                  v-model="editDialog.form.bedroom"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">Full Bathrooms</label>
                <input
                  type="number"
                  class="form-input"
                  v-model="editDialog.form.full_bathroom"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">Half Bathrooms</label>
                <input
                  type="number"
                  class="form-input"
                  v-model="editDialog.form.half_bathroom"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Garage Spots</label>
                <input
                  type="number"
                  class="form-input"
                  v-model="editDialog.form.garage"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Size (sq ft)</label>
                <input
                  type="number"
                  class="form-input"
                  v-model="editDialog.form.size"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">Lot Size (sq ft)</label>
                <input
                  type="number"
                  class="form-input"
                  v-model="editDialog.form.lot_size"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Street Address</label>
                <input
                  type="text"
                  class="form-input"
                  v-model="editDialog.form.address.street"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">City</label>
                <input
                  type="text"
                  class="form-input"
                  v-model="editDialog.form.address.city"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">State</label>
                <input
                  type="text"
                  class="form-input"
                  v-model="editDialog.form.address.state"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">ZIP Code</label>
                <input
                  type="text"
                  class="form-input"
                  v-model="editDialog.form.address.zip"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">HOA Name</label>
                <input
                  type="text"
                  class="form-input"
                  v-model="editDialog.form.hoa_name"
                />
              </div>
              <div class="form-group">
                <label class="form-label">HOA Contact</label>
                <input
                  type="text"
                  class="form-input"
                  v-model="editDialog.form.hoa_contact"
                />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Comments</label>
              <textarea
                class="form-input form-textarea"
                v-model="editDialog.form.comment"
                placeholder="Additional notes about this property..."
              ></textarea>
            </div>
            <div class="form-actions">
              <button
                type="button"
                class="btn btn-secondary"
                @click="closeEditModal"
              >
                Cancel
              </button>
              <button type="submit" class="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Equipment Management Dialog -->
    <div
      v-if="equipmentDialog.open"
      class="modal-overlay"
      @click.self="closeEquipmentModal"
    >
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">
            <i class="fas fa-tools"></i>
            Equipment Management - {{ equipmentDialog.property.nickname }}
          </h2>
        </div>
        <div class="modal-content">
          <div class="equipment-section">
            <div class="section-header">
              <h3>Current Equipment</h3>
              <button class="btn btn-primary" @click="openAddEquipmentModal">
                <i class="fas fa-plus"></i>
                Add Equipment
              </button>
            </div>

            <div
              v-if="equipmentDialog.equipment.length === 0"
              class="no-equipment"
            >
              <p>No equipment added yet.</p>
            </div>

            <div v-else class="equipment-list">
              <div
                v-for="(equipment, idx) in equipmentDialog.equipment"
                :key="idx"
                class="equipment-item"
              >
                <div class="equipment-header">
                  <h4>{{ equipment.name }}</h4>
                  <span
                    class="status-badge"
                    :class="equipment.status.toLowerCase()"
                  >
                    {{ equipment.status }}
                  </span>
                </div>
                <div class="equipment-details">
                  <div class="detail-row">
                    <span class="label">Category:</span>
                    <span>{{ equipment.category }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Manufacturer:</span>
                    <span>{{ equipment.manufacture }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Model:</span>
                    <span>{{ equipment.model }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Serial:</span>
                    <span>{{ equipment.serial }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Manufactured Year:</span>
                    <span>{{ equipment.manufactured_year }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Purchased Year:</span>
                    <span>{{ equipment.purchased_year }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Warranty:</span>
                    <span>{{ equipment.warranty_length }} months</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Invoice Price:</span>
                    <span>${{ equipment.invoice_price }}</span>
                  </div>
                </div>
                <div class="equipment-actions">
                  <button
                    class="btn btn-sm btn-secondary"
                    @click="editEquipment(idx)"
                  >
                    <i class="fas fa-edit"></i>
                    Edit
                  </button>
                  <button
                    class="btn btn-sm btn-danger"
                    @click="deleteEquipment(idx)"
                  >
                    <i class="fas fa-trash"></i>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeEquipmentModal">
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Equipment Dialog -->
    <div
      v-if="addEquipmentDialog.open"
      class="modal-overlay"
      @click.self="closeAddEquipmentModal"
    >
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">
            <i class="fas fa-plus"></i>
            {{ addEquipmentDialog.isEditing ? "Edit" : "Add" }} Equipment
          </h2>
        </div>
        <div class="modal-content">
          <form @submit.prevent="saveEquipment">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Status *</label>
                <select
                  class="form-input"
                  v-model="addEquipmentDialog.form.status"
                  required
                >
                  <option value="">Select status...</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Category *</label>
                <input
                  type="text"
                  class="form-input"
                  v-model="addEquipmentDialog.form.category"
                  placeholder="e.g., HVAC, Plumbing, Electrical"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">Name *</label>
                <input
                  type="text"
                  class="form-input"
                  v-model="addEquipmentDialog.form.name"
                  placeholder="e.g., Water Heater"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">Manufacturer *</label>
                <input
                  type="text"
                  class="form-input"
                  v-model="addEquipmentDialog.form.manufacture"
                  placeholder="e.g., Rheem"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">Model</label>
                <input
                  type="text"
                  class="form-input"
                  v-model="addEquipmentDialog.form.model"
                  placeholder="e.g., XR90T06"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Serial Number</label>
                <input
                  type="text"
                  class="form-input"
                  v-model="addEquipmentDialog.form.serial"
                  placeholder="e.g., SN123456789"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Manufactured Year</label>
                <input
                  type="number"
                  class="form-input"
                  v-model="addEquipmentDialog.form.manufactured_year"
                  placeholder="e.g., 2020"
                  min="1900"
                  :max="new Date().getFullYear()"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Purchased Year</label>
                <input
                  type="number"
                  class="form-input"
                  v-model="addEquipmentDialog.form.purchased_year"
                  placeholder="e.g., 2021"
                  min="1900"
                  :max="new Date().getFullYear()"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Warranty Length (months)</label>
                <input
                  type="number"
                  class="form-input"
                  v-model="addEquipmentDialog.form.warranty_length"
                  placeholder="e.g., 60"
                  min="0"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Invoice Price</label>
                <input
                  type="number"
                  class="form-input"
                  v-model="addEquipmentDialog.form.invoice_price"
                  placeholder="e.g., 1500.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div class="form-actions">
              <button
                type="button"
                class="btn btn-secondary"
                @click="closeAddEquipmentModal"
              >
                Cancel
              </button>
              <button type="submit" class="btn btn-primary">
                {{ addEquipmentDialog.isEditing ? "Update" : "Add" }} Equipment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Task Management Dialog -->
    <div
      v-if="taskDialog.open"
      class="modal-overlay"
      @click.self="closeTaskModal"
    >
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">
            <i class="fas fa-tasks"></i>
            Task Management - {{ taskDialog.property.nickname }}
          </h2>
        </div>
        <div class="modal-content">
          <div class="task-section">
            <div class="section-header">
              <h3>Maintenance Tasks</h3>
              <button class="btn btn-primary" @click="openAddTaskModal">
                <i class="fas fa-plus"></i>
                Add Task
              </button>
            </div>

            <div v-if="taskDialog.tasks.length === 0" class="no-tasks">
              <p>No tasks added yet.</p>
            </div>

            <div v-else class="task-list">
              <div
                v-for="(task, idx) in taskDialog.tasks"
                :key="idx"
                class="task-item"
              >
                <div class="task-header">
                  <h4>{{ task.observation }}</h4>
                  <span class="status-badge" :class="task.status.toLowerCase()">
                    {{ task.status }}
                  </span>
                </div>
                <div class="task-details">
                  <div class="detail-row">
                    <span class="label">Resolution:</span>
                    <span>{{ task.resolution || "Pending" }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Report Date:</span>
                    <span>{{ task.report_date }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Resolution Date:</span>
                    <span>{{ task.res_date || "Pending" }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Reported By:</span>
                    <span>{{ task.report_by }}</span>
                  </div>
                </div>

                <!-- Comments Section -->
                <div class="comments-section">
                  <h5>Comments</h5>
                  <div
                    v-if="task.comments && task.comments.length > 0"
                    class="comments-list"
                  >
                    <div
                      v-for="(comment, cIdx) in task.comments"
                      :key="cIdx"
                      class="comment-item"
                    >
                      <div class="comment-header">
                        <span class="comment-author">{{ comment.author }}</span>
                        <span class="comment-date">{{ comment.date }}</span>
                      </div>
                      <div class="comment-text">{{ comment.text }}</div>
                    </div>
                  </div>
                  <div v-else class="no-comments">
                    <p>No comments yet.</p>
                  </div>

                  <div class="add-comment">
                    <textarea
                      v-model="task.newComment"
                      placeholder="Add a comment..."
                      class="comment-input"
                      rows="2"
                    ></textarea>
                    <button
                      class="btn btn-sm btn-primary"
                      @click="addComment(task, idx)"
                    >
                      Add Comment
                    </button>
                  </div>
                </div>

                <div class="task-actions">
                  <button
                    class="btn btn-sm btn-secondary"
                    @click="editTask(idx)"
                  >
                    <i class="fas fa-edit"></i>
                    Edit
                  </button>
                  <button
                    class="btn btn-sm btn-danger"
                    @click="deleteTask(idx)"
                  >
                    <i class="fas fa-trash"></i>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeTaskModal">
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Task Dialog -->
    <div
      v-if="addTaskDialog.open"
      class="modal-overlay"
      @click.self="closeAddTaskModal"
    >
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">
            <i class="fas fa-plus"></i>
            {{ addTaskDialog.isEditing ? "Edit" : "Add" }} Task
          </h2>
        </div>
        <div class="modal-content">
          <form @submit.prevent="saveTask">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Observation *</label>
                <textarea
                  class="form-input"
                  v-model="addTaskDialog.form.observation"
                  placeholder="Describe the issue or observation..."
                  required
                  rows="3"
                ></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">Resolution</label>
                <textarea
                  class="form-input"
                  v-model="addTaskDialog.form.resolution"
                  placeholder="Describe the resolution..."
                  rows="3"
                ></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">Report Date *</label>
                <input
                  type="date"
                  class="form-input"
                  v-model="addTaskDialog.form.report_date"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">Resolution Date</label>
                <input
                  type="date"
                  class="form-input"
                  v-model="addTaskDialog.form.res_date"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Status *</label>
                <select
                  class="form-input"
                  v-model="addTaskDialog.form.status"
                  required
                >
                  <option value="">Select status...</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Reported By *</label>
                <input
                  type="text"
                  class="form-input"
                  v-model="addTaskDialog.form.report_by"
                  placeholder="e.g., John Doe"
                  required
                />
              </div>
            </div>
            <div class="form-actions">
              <button
                type="button"
                class="btn btn-secondary"
                @click="closeAddTaskModal"
              >
                Cancel
              </button>
              <button type="submit" class="btn btn-primary">
                {{ addTaskDialog.isEditing ? "Update" : "Add" }} Task
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
      <div class="modal lease-modal">
        <div class="modal-header">
          <h2 class="modal-title">
            <i class="fas fa-file-contract"></i>
            Lease Details - {{ leaseDetailsDialog.property?.nickname }}
          </h2>
          <button class="modal-close" @click="closeLeaseDetailsModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-content">
          <div v-if="leaseDetailsDialog.lease">
            <!-- Existing Lease Details -->
            <div class="lease-info">
              <div class="lease-header">
                <h3>Current Lease</h3>
                <div class="lease-status-badge active">Active</div>
              </div>

              <div class="lease-details-grid">
                <div class="detail-group">
                  <label class="detail-label">Post Date</label>
                  <div class="detail-value">
                    {{ formatDate(leaseDetailsDialog.lease.post_date) }}
                  </div>
                </div>

                <div class="detail-group">
                  <label class="detail-label">Monthly Rate</label>
                  <div class="detail-value">
                    {{ formatCurrency(leaseDetailsDialog.lease.monthly_rate) }}
                  </div>
                </div>

                <div class="detail-group">
                  <label class="detail-label">Daily Rate</label>
                  <div class="detail-value">
                    {{ formatCurrency(leaseDetailsDialog.lease.daily_rate) }}
                  </div>
                </div>

                <div class="detail-group">
                  <label class="detail-label">Lease Start</label>
                  <div class="detail-value">
                    {{ formatDate(leaseDetailsDialog.lease.lease_start) }}
                  </div>
                </div>

                <div class="detail-group">
                  <label class="detail-label">Lease End</label>
                  <div class="detail-value">
                    {{ formatDate(leaseDetailsDialog.lease.lease_end) }}
                  </div>
                </div>

                <div class="detail-group">
                  <label class="detail-label">Tenant</label>
                  <div class="detail-value">
                    {{ leaseDetailsDialog.lease.tenant_name || "N/A" }}
                  </div>
                </div>
              </div>

              <div class="lease-actions">
                <button class="btn btn-primary" @click="editLease">
                  <i class="fas fa-edit"></i>
                  Edit Lease
                </button>
                <button class="btn btn-secondary" @click="viewApplications">
                  <i class="fas fa-list"></i>
                  View Applications
                </button>
                <button class="btn btn-danger" @click="terminateLease">
                  <i class="fas fa-times"></i>
                  Terminate Lease
                </button>
              </div>
            </div>
          </div>

          <div v-else class="no-lease">
            <div class="no-lease-content">
              <i class="fas fa-home no-lease-icon"></i>
              <h3>No Active Lease</h3>
              <p>This property is currently available for lease.</p>
              <button
                class="btn btn-primary create-lease-btn"
                @click="createNewLease"
              >
                <i class="fas fa-plus"></i>
                Create New Lease
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Lease Modal -->
    <div
      v-if="leaseDialog.open"
      class="modal-overlay"
      @click.self="closeLeaseModal"
    >
      <div class="modal">
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
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Post Date *</label>
                <input
                  type="date"
                  class="form-input"
                  v-model="leaseDialog.lease.post_date"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label">Monthly Rate *</label>
                <input
                  type="number"
                  class="form-input"
                  v-model="leaseDialog.lease.monthly_rate"
                  placeholder="e.g., 2500"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label">Daily Rate *</label>
                <input
                  type="number"
                  class="form-input"
                  v-model="leaseDialog.lease.daily_rate"
                  placeholder="e.g., 100"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label">Lease Start Date *</label>
                <input
                  type="date"
                  class="form-input"
                  v-model="leaseDialog.lease.lease_start"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label">Lease End Date *</label>
                <input
                  type="date"
                  class="form-input"
                  v-model="leaseDialog.lease.lease_end"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label">Tenant Name</label>
                <input
                  type="text"
                  class="form-input"
                  v-model="leaseDialog.lease.tenant_name"
                  placeholder="e.g., John Doe"
                />
              </div>

              <div class="form-group full-width">
                <label class="form-label">Notes</label>
                <textarea
                  class="form-input"
                  v-model="leaseDialog.lease.notes"
                  placeholder="Additional lease details..."
                  rows="3"
                ></textarea>
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
  </div>
</template>

<script>
export default {
  name: "PropertyManager",
  data() {
    return {
      searchTerm: "",
      filteredProperties: [],
      propertyList: [
        {
          id: 1,
          nickname: "Sunset Villa",
          asset_type: "House",
          address: {
            street: "123 Sunset Blvd",
            city: "Los Angeles",
            state: "CA",
            zip: "90210",
          },
          bedroom: 4,
          full_bathroom: 3,
          size: "2,500",
          build_year: 2015,
          story: 2,
          garage: 2,
          lot_size: "0.5 acres",
          comment: "Beautiful modern home with ocean view",
          hoa_name: "Sunset HOA",
          hoa_contact: "555-0123",
          equipment: [
            {
              id: 1,
              status: "Active",
              category: "HVAC",
              name: "Central Air Conditioner",
              manufacture: "Carrier",
              model: "24ABC6",
              serial: "SN123456789",
              manufactured_year: "2020",
              purchased_year: "2021",
              warranty_length: "60",
              invoice_price: "3500.00",
            },
            {
              id: 2,
              status: "Active",
              category: "Plumbing",
              name: "Water Heater",
              manufacture: "Rheem",
              model: "XR90T06",
              serial: "SN987654321",
              manufactured_year: "2019",
              purchased_year: "2020",
              warranty_length: "48",
              invoice_price: "1200.00",
            },
          ],
          tasks: [
            {
              id: 1,
              observation: "AC unit making unusual noise",
              resolution: "Replaced air filter and cleaned condenser coils",
              report_date: "2024-01-15",
              res_date: "2024-01-16",
              status: "Completed",
              report_by: "John Smith",
              comments: [
                {
                  author: "John Smith",
                  date: "2024-01-15",
                  text: "Noticed loud humming sound from AC unit",
                },
                {
                  author: "Mike Johnson",
                  date: "2024-01-16",
                  text: "Filter replaced and coils cleaned. Unit running quietly now.",
                },
              ],
            },
          ],
          lease: {
            post_date: "2023-01-15",
            monthly_rate: "3500.00",
            daily_rate: "120.00",
            lease_start: "2023-02-01",
            lease_end: "2024-02-01",
            tenant_name: "John Doe",
            notes: "Long-term tenant, excellent payment history",
          },
        },
        {
          id: 2,
          nickname: "Ocean View",
          asset_type: "Condo",
          address: {
            street: "456 Ocean Dr",
            city: "Miami",
            state: "FL",
            zip: "33139",
          },
          bedroom: 2,
          full_bathroom: 2,
          size: "1,200",
          build_year: 2018,
          story: 1,
          garage: 1,
          lot_size: "N/A",
          comment: "Luxury condo with beach access",
          hoa_name: "Ocean View HOA",
          hoa_contact: "555-0456",
          equipment: [
            {
              id: 3,
              status: "Active",
              category: "HVAC",
              name: "Mini Split AC",
              manufacture: "Mitsubishi",
              model: "MSZ-FH",
              serial: "SN456789123",
              manufactured_year: "2021",
              purchased_year: "2021",
              warranty_length: "72",
              invoice_price: "2800.00",
            },
          ],
          tasks: [
            {
              id: 2,
              observation: "Kitchen sink clogged",
              resolution: "Cleared drain and replaced faucet",
              report_date: "2024-01-20",
              res_date: "2024-01-21",
              status: "Completed",
              report_by: "Sarah Wilson",
              comments: [
                {
                  author: "Sarah Wilson",
                  date: "2024-01-20",
                  text: "Sink not draining properly",
                },
                {
                  author: "Mike Johnson",
                  date: "2024-01-21",
                  text: "Drain cleared and new faucet installed.",
                },
              ],
            },
          ],
          lease: {
            post_date: "2022-06-01",
            monthly_rate: "2800.00",
            daily_rate: "95.00",
            lease_start: "2022-07-01",
            lease_end: "2023-07-01",
            tenant_name: "Maria Garcia",
            notes: "Lease expired, property available for new tenant",
          },
        },
        {
          id: 3,
          nickname: "Lakeside Retreat",
          asset_type: "House",
          build_year: "2005",
          story: "1",
          bedroom: "3",
          full_bathroom: "2",
          half_bathroom: "1",
          kitchen: "1",
          meeting_room: "0",
          office: "0",
          garage: "1",
          size: "1800",
          lot_size: "8000",
          hoa_name: "Lakeside Community",
          hoa_contact: "555-9012",
          comment:
            "Peaceful lakefront property with private dock. Open floor plan and large windows overlooking the water. Perfect vacation rental.",
          address: {
            street: "789 Lake Shore Dr",
            city: "Crystal Lake",
            state: "IL",
            zip: "60014",
            country: "USA",
          },
          equipment: [
            {
              id: 1,
              status: "Active",
              category: "Plumbing",
              name: "Well Pump",
              manufacture: "Grundfos",
              model: "SQE3-55",
              serial: "SN789123456",
              manufactured_year: "2018",
              purchased_year: "2018",
              warranty_length: "36",
              invoice_price: "2500.00",
            },
            {
              id: 2,
              status: "Active",
              category: "HVAC",
              name: "Heat Pump",
              manufacture: "Trane",
              model: "XR15",
              serial: "SN321654987",
              manufactured_year: "2017",
              purchased_year: "2017",
              warranty_length: "60",
              invoice_price: "4200.00",
            },
          ],
          tasks: [],
        },
      ],
      editDialog: {
        open: false,
        index: null,
        form: {},
      },
      addPropertyDialog: {
        open: false,
      },
      newProperty: {
        nickname: "",
        asset_type: "",
        build_year: "",
        story: "",
        bedroom: "",
        full_bathroom: "",
        half_bathroom: "0",
        kitchen: "1",
        meeting_room: "0",
        office: "0",
        garage: "0",
        size: "",
        lot_size: "",
        hoa_name: "",
        hoa_contact: "",
        comment: "",
        address: {
          street: "",
          city: "",
          state: "",
          zip: "",
          country: "USA",
        },
      },
      equipmentDialog: {
        open: false,
        property: {},
        equipment: [],
      },
      addEquipmentDialog: {
        open: false,
        isEditing: false,
        form: {
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
      },
      taskDialog: {
        open: false,
        property: {},
        tasks: [],
      },
      addTaskDialog: {
        open: false,
        isEditing: false,
        form: {
          observation: "",
          resolution: "",
          report_date: "",
          res_date: "",
          status: "",
          report_by: "",
        },
      },
      leaseDetailsDialog: {
        open: false,
        property: null,
        lease: null,
      },
      leaseDialog: {
        open: false,
        isEditing: false,
        lease: {
          post_date: "",
          monthly_rate: "",
          daily_rate: "",
          lease_start: "",
          lease_end: "",
          tenant_name: "",
          notes: "",
        },
      },
    };
  },
  mounted() {
    this.filteredProperties = [...this.propertyList];
  },
  methods: {
    openAddPropertyModal() {
      this.addPropertyDialog.open = true;
    },

    closeAddPropertyModal() {
      this.addPropertyDialog.open = false;
      this.resetNewPropertyForm();
    },

    resetNewPropertyForm() {
      this.newProperty = {
        nickname: "",
        asset_type: "",
        build_year: "",
        story: "",
        bedroom: "",
        full_bathroom: "",
        half_bathroom: "0",
        kitchen: "1",
        meeting_room: "0",
        office: "0",
        garage: "0",
        size: "",
        lot_size: "",
        hoa_name: "",
        hoa_contact: "",
        comment: "",
        address: {
          street: "",
          city: "",
          state: "",
          zip: "",
          country: "USA",
        },
      };
    },

    saveNewProperty() {
      // Generate new ID
      const newId = Math.max(...this.propertyList.map((p) => p.id)) + 1;

      // Create new property object
      const propertyToAdd = {
        id: newId,
        ...JSON.parse(JSON.stringify(this.newProperty)),
      };

      // Add to property list
      this.propertyList.push(propertyToAdd);

      // Update filtered properties
      this.filterProperties();

      // Close modal and reset form
      this.closeAddPropertyModal();

      // Optional: Show success message or scroll to new property
      console.log("Property added successfully:", propertyToAdd);
    },

    filterProperties() {
      if (!this.searchTerm) {
        this.filteredProperties = [...this.propertyList];
        return;
      }

      const term = this.searchTerm.toLowerCase();
      this.filteredProperties = this.propertyList.filter(
        (property) =>
          property.nickname.toLowerCase().includes(term) ||
          property.address.city.toLowerCase().includes(term) ||
          property.address.state.toLowerCase().includes(term) ||
          property.asset_type.toLowerCase().includes(term)
      );
    },

    openEditModal(property, index) {
      this.editDialog.open = true;
      this.editDialog.index = index;
      this.editDialog.form = JSON.parse(JSON.stringify(property));
    },

    closeEditModal() {
      this.editDialog.open = false;
      this.editDialog.index = null;
      this.editDialog.form = {};
    },

    saveEdit() {
      if (this.editDialog.index !== null) {
        this.propertyList[this.editDialog.index] = JSON.parse(
          JSON.stringify(this.editDialog.form)
        );
        this.filterProperties(); // Refresh filtered list
      }
      this.closeEditModal();
    },

    openEquipmentModal(property, index) {
      this.equipmentDialog.open = true;
      this.equipmentDialog.property = property;
      this.equipmentDialog.equipment = JSON.parse(
        JSON.stringify(property.equipment || [])
      );
    },

    closeEquipmentModal() {
      this.equipmentDialog.open = false;
      this.equipmentDialog.property = {};
      this.equipmentDialog.equipment = [];
    },

    openAddEquipmentModal() {
      this.addEquipmentDialog.open = true;
      this.addEquipmentDialog.isEditing = false;
      this.addEquipmentDialog.form = {
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
      };
    },

    closeAddEquipmentModal() {
      this.addEquipmentDialog.open = false;
      this.addEquipmentDialog.isEditing = false;
      this.addEquipmentDialog.form = {
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
      };
    },

    saveEquipment() {
      if (this.addEquipmentDialog.isEditing) {
        // Find the index of the equipment to be edited
        const index = this.equipmentDialog.equipment.findIndex(
          (e) => e.id === this.addEquipmentDialog.form.id
        );
        if (index !== -1) {
          this.equipmentDialog.equipment[index] = JSON.parse(
            JSON.stringify(this.addEquipmentDialog.form)
          );
        }
      } else {
        // Generate new ID for new equipment
        const maxId =
          this.equipmentDialog.equipment.length > 0
            ? Math.max(...this.equipmentDialog.equipment.map((e) => e.id || 0))
            : 0;
        this.equipmentDialog.equipment.push({
          id: maxId + 1,
          ...JSON.parse(JSON.stringify(this.addEquipmentDialog.form)),
        });
      }
      this.closeAddEquipmentModal();
      this.equipmentDialog.equipment = JSON.parse(
        JSON.stringify(this.equipmentDialog.equipment)
      ); // Ensure deep copy
    },

    editEquipment(index) {
      this.addEquipmentDialog.open = true;
      this.addEquipmentDialog.isEditing = true;
      this.addEquipmentDialog.form = JSON.parse(
        JSON.stringify(this.equipmentDialog.equipment[index])
      );
    },

    deleteEquipment(index) {
      this.equipmentDialog.equipment.splice(index, 1);
      this.equipmentDialog.equipment = JSON.parse(
        JSON.stringify(this.equipmentDialog.equipment)
      ); // Ensure deep copy
    },

    openTaskModal(property, index) {
      this.taskDialog.open = true;
      this.taskDialog.property = property;
      this.taskDialog.tasks = JSON.parse(JSON.stringify(property.tasks || []));
    },

    closeTaskModal() {
      this.taskDialog.open = false;
      this.taskDialog.property = {};
      this.taskDialog.tasks = [];
    },

    openAddTaskModal() {
      this.addTaskDialog.open = true;
      this.addTaskDialog.isEditing = false;
      this.addTaskDialog.form = {
        observation: "",
        resolution: "",
        report_date: "",
        res_date: "",
        status: "",
        report_by: "",
      };
    },

    closeAddTaskModal() {
      this.addTaskDialog.open = false;
      this.addTaskDialog.isEditing = false;
      this.addTaskDialog.form = {
        observation: "",
        resolution: "",
        report_date: "",
        res_date: "",
        status: "",
        report_by: "",
      };
    },

    saveTask() {
      if (this.addTaskDialog.isEditing) {
        // Find the index of the task to be edited
        const index = this.taskDialog.tasks.findIndex(
          (t) => t.id === this.addTaskDialog.form.id
        );
        if (index !== -1) {
          this.taskDialog.tasks[index] = JSON.parse(
            JSON.stringify(this.addTaskDialog.form)
          );
        }
      } else {
        // Generate new ID for new task
        const maxId =
          this.taskDialog.tasks.length > 0
            ? Math.max(...this.taskDialog.tasks.map((t) => t.id || 0))
            : 0;
        this.taskDialog.tasks.push({
          id: maxId + 1,
          comments: [],
          ...JSON.parse(JSON.stringify(this.addTaskDialog.form)),
        });
      }
      this.closeAddTaskModal();
      this.taskDialog.tasks = JSON.parse(JSON.stringify(this.taskDialog.tasks)); // Ensure deep copy
    },

    editTask(index) {
      this.addTaskDialog.open = true;
      this.addTaskDialog.isEditing = true;
      this.addTaskDialog.form = JSON.parse(
        JSON.stringify(this.taskDialog.tasks[index])
      );
    },

    deleteTask(index) {
      this.taskDialog.tasks.splice(index, 1);
      this.taskDialog.tasks = JSON.parse(JSON.stringify(this.taskDialog.tasks)); // Ensure deep copy
    },

    addComment(task, index) {
      if (!task.newComment || task.newComment.trim() === "") return;

      const newComment = {
        author: "You", // Assuming the user is the author for now
        date: new Date().toISOString().slice(0, 10),
        text: task.newComment.trim(),
      };

      if (!task.comments) {
        task.comments = [];
      }

      task.comments.push(newComment);
      task.newComment = ""; // Clear the input field
      this.taskDialog.tasks = JSON.parse(JSON.stringify(this.taskDialog.tasks)); // Ensure deep copy
    },

    openLeaseDetails(property) {
      this.leaseDetailsDialog.open = true;
      this.leaseDetailsDialog.property = property;

      // Check if property has an active lease
      if (
        property.lease &&
        property.lease.lease_end &&
        new Date(property.lease.lease_end) > new Date()
      ) {
        // Property has an active lease
        this.leaseDetailsDialog.lease = JSON.parse(
          JSON.stringify(property.lease)
        );
      } else {
        // Property has no active lease
        this.leaseDetailsDialog.lease = null;
      }
    },

    closeLeaseDetailsModal() {
      this.leaseDetailsDialog.open = false;
      this.leaseDetailsDialog.property = null;
      this.leaseDetailsDialog.lease = null;
    },

    editLease() {
      this.leaseDialog.open = true;
      this.leaseDialog.isEditing = true;
      this.leaseDialog.lease = JSON.parse(
        JSON.stringify(this.leaseDetailsDialog.lease)
      );
    },

    viewApplications() {
      alert(
        "View Applications clicked for property: " +
          this.leaseDetailsDialog.property?.nickname
      );
      // Implement navigation or modal for applications
    },

    terminateLease() {
      alert(
        "Terminate Lease clicked for property: " +
          this.leaseDetailsDialog.property?.nickname
      );
      // Implement termination logic
    },

    createNewLease() {
      this.leaseDialog.open = true;
      this.leaseDialog.isEditing = false;
      this.leaseDialog.lease = {
        post_date: "",
        monthly_rate: "",
        daily_rate: "",
        lease_start: "",
        lease_end: "",
        tenant_name: "",
        notes: "",
      };
    },

    closeLeaseModal() {
      this.leaseDialog.open = false;
      this.leaseDialog.isEditing = false;
      this.leaseDialog.lease = {
        post_date: "",
        monthly_rate: "",
        daily_rate: "",
        lease_start: "",
        lease_end: "",
        tenant_name: "",
        notes: "",
      };
    },

    saveLease() {
      const propertyIndex = this.propertyList.findIndex(
        (p) => p.id === this.leaseDetailsDialog.property.id
      );

      if (propertyIndex !== -1) {
        // Save lease to property
        this.propertyList[propertyIndex].lease = JSON.parse(
          JSON.stringify(this.leaseDialog.lease)
        );

        // Update the lease details dialog
        this.leaseDetailsDialog.lease = JSON.parse(
          JSON.stringify(this.leaseDialog.lease)
        );

        // Show success message
        this.$q.notify({
          type: "positive",
          message: this.leaseDialog.isEditing
            ? "Lease updated successfully"
            : "Lease created successfully",
          position: "top",
        });
      }

      this.closeLeaseModal();
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

    getLeaseStatusClass(property) {
      // Check if property has an active lease
      if (
        property.lease &&
        property.lease.lease_end &&
        new Date(property.lease.lease_end) > new Date()
      ) {
        return "leased";
      }
      return "available";
    },

    getLeaseStatusIcon(property) {
      if (this.getLeaseStatusClass(property) === "leased") {
        return "fas fa-file-contract";
      }
      return "fas fa-home";
    },

    getLeaseStatusText(property) {
      if (this.getLeaseStatusClass(property) === "leased") {
        return "Leased";
      }
      return "Available";
    },

    getLeaseStatusDetails(property) {
      if (this.getLeaseStatusClass(property) === "leased") {
        return `${this.formatCurrency(property.lease.monthly_rate)}/month`;
      }
      return "Click to create lease";
    },
  },
};
</script>

<style scoped>
.property-manager {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  background: #f8fafc;
  min-height: 100vh;
  padding: 2rem;
  color: #334155;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.header h1 {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #3b82f6;
}

.header p {
  font-size: 1.1rem;
  color: #64748b;
}

.search-section {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.search-bar {
  position: relative;
  max-width: 400px;
  flex: 1;
}

.search-input {
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: #ffffff;
  color: #374151;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
}

.add-property-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.add-property-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.properties-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.property-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.6s ease-out forwards;
  opacity: 0;
}

.property-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #d1d5db;
}

.card-header {
  background: #3b82f6;
  padding: 1.5rem;
  color: white;
  position: relative;
}

.property-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.property-address {
  opacity: 0.9;
  font-size: 0.9rem;
}

.property-type {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.card-content {
  padding: 1.5rem;
}

.lease-status-section {
  margin-bottom: 1.5rem;
  cursor: pointer;
}

.lease-status-bar {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  gap: 0.75rem;
}

.lease-status-bar:hover {
  background-color: #e2e8f0;
  border-color: #d1d5db;
}

.status-icon {
  font-size: 1.25rem;
  color: #3b82f6;
  flex-shrink: 0;
}

.status-info {
  flex: 1;
}

.status-text {
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
}

.status-details {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.status-action {
  font-size: 0.875rem;
  color: #6b7280;
  flex-shrink: 0;
}

.property-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f1f5f9;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: #3b82f6;
  display: block;
}

.stat-label {
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 0.25rem;
}

.property-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 6px;
  transition: all 0.2s ease;
  border: 1px solid #f1f5f9;
}

.detail-item:hover {
  background: #f1f5f9;
  border-color: #e2e8f0;
}

.detail-icon {
  width: 16px;
  height: 16px;
  color: #64748b;
  flex-shrink: 0;
}

.detail-text {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
}

.property-comment {
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  padding: 1rem;
  border-radius: 0 6px 6px 0;
  margin-bottom: 1.5rem;
  font-style: italic;
  color: #92400e;
  border: 1px solid #fde68a;
}

.quote-icon {
  margin-right: 0.5rem;
  opacity: 0.7;
}

.hoa-info {
  background: #d1fae5;
  border: 1px solid #a7f3d0;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
}

.hoa-title {
  font-weight: 600;
  color: #065f46;
  margin-bottom: 0.5rem;
}

.hoa-icon {
  margin-right: 0.5rem;
}

.hoa-contact {
  color: #047857;
  font-size: 0.875rem;
}

.card-actions {
  padding: 0 1.5rem 1.5rem;
  display: flex;
  gap: 0.75rem;
}

.edit-btn {
  width: 100%;
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.edit-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.modal-header {
  background: #3b82f6;
  color: white;
  padding: 1.5rem;
  text-align: center;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
}

.modal-content {
  padding: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-group {
  position: relative;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background: #ffffff;
  color: #374151;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  min-height: 80px;
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background-color: #4b5563;
}

.btn-info {
  background-color: #06b6d4;
  color: white;
}

.btn-info:hover {
  background-color: #0891b2;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
}

.btn-danger:hover {
  background-color: #dc2626;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.status-badge.open {
  background-color: #3b82f6; /* Blue */
}
.status-badge.in-progress {
  background-color: #f59e0b; /* Orange */
}
.status-badge.completed {
  background-color: #22c55e; /* Green */
}
.status-badge.cancelled {
  background-color: #ef4444; /* Red */
}

.equipment-section,
.task-section {
  margin-bottom: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
}

.no-equipment,
.no-tasks {
  text-align: center;
  padding: 1rem;
  color: #64748b;
  font-style: italic;
}

.equipment-list,
.task-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.equipment-item,
.task-item {
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.equipment-header,
.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.equipment-header h4,
.task-header h4 {
  font-size: 1rem;
  font-weight: 500;
  color: #374151;
  flex: 1;
  margin-right: 1rem;
}

.status-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
}

.status-badge.active {
  background-color: #22c55e; /* Green */
}
.status-badge.inactive {
  background-color: #ef4444; /* Red */
}
.status-badge.maintenance {
  background-color: #f59e0b; /* Orange */
}
.status-badge.retired {
  background-color: #6b7280; /* Gray */
}

.equipment-details,
.task-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #4b5563;
}

.label {
  font-weight: 500;
  color: #374151;
}

.equipment-actions,
.task-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.comments-section {
  margin-top: 1rem;
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.comment-item {
  background: #f1f5f9;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #64748b;
}

.comment-author {
  font-weight: 500;
}

.comment-date {
  font-style: italic;
}

.comment-text {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 400;
}

.add-comment {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.comment-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  background: #ffffff;
  color: #374151;
}

.comment-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.no-comments {
  text-align: center;
  padding: 0.5rem;
  color: #64748b;
  font-style: italic;
  font-size: 0.875rem;
}

.lease-modal .modal-header {
  background: #4f46e5; /* Darker blue for lease modal */
}

.lease-modal .modal-title {
  color: white;
}

.lease-modal .modal-close {
  color: white;
}

.lease-modal .modal-content {
  padding: 1.5rem;
}

.lease-modal .form-grid {
  grid-template-columns: 1fr; /* Single column for lease form */
  gap: 0.75rem;
}

.lease-modal .form-group {
  position: relative;
}

.lease-modal .form-label {
  color: #4b5563;
  font-size: 0.875rem;
}

.lease-modal .form-input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  background: #f9fafb;
  color: #374151;
}

.lease-modal .form-input:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.lease-modal .form-textarea {
  min-height: 100px;
}

.lease-modal .modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.lease-modal .full-width {
  grid-column: 1 / -1; /* Make full-width input span across columns */
}

.lease-modal .lease-info {
  margin-bottom: 1.5rem;
}

.lease-modal .lease-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.lease-modal .lease-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
}

.lease-modal .lease-status-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
}

.lease-modal .lease-details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.lease-modal .detail-group {
  display: flex;
  flex-direction: column;
}

.lease-modal .detail-label {
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.lease-modal .detail-value {
  font-size: 1rem;
  font-weight: 500;
  color: #374151;
}

.lease-modal .lease-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.lease-modal .no-lease {
  text-align: center;
  padding: 2rem;
  color: #64748b;
  font-style: italic;
}

.lease-modal .no-lease-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.lease-modal .no-lease-icon {
  font-size: 3rem;
  color: #e0e7ff;
}

.lease-modal .create-lease-btn {
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.lease-modal .create-lease-btn:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .property-manager {
    padding: 1rem;
  }

  .properties-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .header h1 {
    font-size: 2rem;
  }

  .property-details {
    grid-template-columns: 1fr;
  }

  .property-stats {
    flex-direction: column;
    gap: 0.75rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }
}

.lease-status-bar.leased {
  background-color: #ecfdf5;
  border-color: #10b981;
}

.lease-status-bar.leased .status-icon {
  color: #10b981;
}

.lease-status-bar.available {
  background-color: #fef3c7;
  border-color: #f59e0b;
}

.lease-status-bar.available .status-icon {
  color: #f59e0b;
}

.lease-status-bar.available .status-text {
  color: #92400e;
}

.lease-status-bar.available .status-details {
  color: #b45309;
}
</style>
