<template>
  <q-page class="flex flex-center">
    <div style="width: 100%; max-width: 1400px">
      <div class="page-header">
        <h4 class="page-title">Financial Transaction Management System</h4>
        <div class="header-actions">
          <q-btn
            color="primary"
            icon="add"
            label="Add Transaction"
            @click="openAddTransactionModal"
            class="add-transaction-btn"
          />
          <q-btn
            color="secondary"
            icon="download"
            label="Export CSV"
            @click="exportToCSV"
            class="export-btn"
          />
          <q-btn
            color="secondary"
            icon="picture_as_pdf"
            label="Export PDF"
            @click="exportToPDF"
            class="export-btn"
          />
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="summary-section">
        <div class="summary-card income">
          <div class="summary-icon">
            <q-icon name="trending_up" size="2rem" color="green" />
          </div>
          <div class="summary-content">
            <h3>Total Income</h3>
            <p class="summary-amount">¥{{ formatCurrency(totalIncome) }}</p>
            <p class="summary-period">This Month</p>
          </div>
        </div>

        <div class="summary-card expense">
          <div class="summary-icon">
            <q-icon name="trending_down" size="2rem" color="red" />
          </div>
          <div class="summary-content">
            <h3>Total Expenses</h3>
            <p class="summary-amount">¥{{ formatCurrency(totalExpense) }}</p>
            <p class="summary-period">This Month</p>
          </div>
        </div>

        <div class="summary-card profit">
          <div class="summary-icon">
            <q-icon name="account_balance" size="2rem" color="blue" />
          </div>
          <div class="summary-content">
            <h3>Net Profit</h3>
                          <p class="summary-amount" :class="{ negative: netProfit < 0 }">
                ¥{{ formatCurrency(netProfit) }}
              </p>
              <p class="summary-period">This Month</p>
          </div>
        </div>

        <div class="summary-card transactions">
          <div class="summary-icon">
            <q-icon name="receipt" size="2rem" color="orange" />
          </div>
          <div class="summary-content">
            <h3>Total Transactions</h3>
            <p class="summary-amount">{{ transactions.length }}</p>
            <p class="summary-period">This Month</p>
          </div>
        </div>
      </div>

      <!-- Search and Filter Section -->
      <div class="search-filter-section">
        <div class="search-box">
          <q-input
            v-model="searchTerm"
            placeholder="Search transactions..."
            dense
            outlined
            clearable
            class="search-input"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
        <div class="filter-box">
          <q-select
            v-model="categoryFilter"
            :options="categoryOptions"
            label="Category Filter"
            dense
            outlined
            clearable
            class="filter-select"
          />
          <q-select
            v-model="propertyFilter"
            :options="propertyOptions"
            label="Property Filter"
            dense
            outlined
            clearable
            class="filter-select"
          />
          <q-select
            v-model="typeFilter"
            :options="typeOptions"
            label="Type Filter"
            dense
            outlined
            clearable
            class="filter-select"
          />
          <q-input
            v-model="dateRange"
            label="Date Range"
            dense
            outlined
            readonly
            class="date-range-input"
          >
            <template v-slot:prepend>
              <q-icon name="event" />
            </template>
            <template v-slot:append>
              <q-btn flat round dense icon="clear" @click="clearDateRange" />
            </template>
          </q-input>
        </div>
      </div>

      <!-- Transactions Table -->
      <div class="transactions-container">
        <q-table
          :rows="filteredTransactions"
          :columns="columns"
          row-key="id"
          :pagination="{ rowsPerPage: 20 }"
          :loading="loading"
          class="transactions-table"
        >
          <template v-slot:body-cell-amount="props">
            <q-td :props="props">
              <span
                :class="
                  props.row.type === 'income'
                    ? 'amount-income'
                    : 'amount-expense'
                "
              >
                {{ props.row.type === "income" ? "+" : "-" }}¥{{
                  formatCurrency(props.value)
                }}
              </span>
            </q-td>
          </template>

          <template v-slot:body-cell-category="props">
            <q-td :props="props">
              <q-chip
                :color="getCategoryColor(props.value)"
                text-color="white"
                size="sm"
                :label="props.value"
              />
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                round
                dense
                icon="edit"
                color="primary"
                @click="openEditTransactionModal(props.row, props.rowIndex)"
                title="Edit Transaction"
              />
              <q-btn
                flat
                round
                dense
                icon="delete"
                color="negative"
                @click="deleteTransaction(props.rowIndex)"
                                  title="Delete Transaction"
              />
            </q-td>
          </template>
        </q-table>
      </div>

      <!-- Add/Edit Transaction Dialog -->
      <q-dialog v-model="transactionDialog.open" persistent>
        <q-card style="min-width: 600px; max-width: 90vw">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">
              {{ transactionDialog.isEditing ? "Edit Transaction" : "Add Transaction" }}
            </div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section>
            <q-form @submit.prevent="saveTransaction">
              <div class="form-grid">
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Transaction Type *</label>
                    <q-select
                      v-model="transactionDialog.form.type"
                      :options="typeOptions"
                      outlined
                      dense
                      required
                      @update:model-value="onTypeChange"
                    />
                  </div>

                  <div class="form-group">
                                          <label class="form-label">Category *</label>
                    <q-select
                      v-model="transactionDialog.form.category"
                      :options="getCategoryOptions()"
                      outlined
                      dense
                      required
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                                          <label class="form-label">From *</label>
                    <q-input
                      v-model="transactionDialog.form.from"
                      outlined
                      dense
                                              placeholder="e.g., Tenant name or company"
                      required
                    />
                  </div>

                  <div class="form-group">
                                          <label class="form-label">To *</label>
                    <q-input
                      v-model="transactionDialog.form.to"
                      outlined
                      dense
                                              placeholder="e.g., Property company or recipient"
                      required
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                                          <label class="form-label">Amount *</label>
                    <q-input
                      v-model.number="transactionDialog.form.amount"
                      type="number"
                      outlined
                      dense
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>

                  <div class="form-group">
                                          <label class="form-label">Currency *</label>
                    <q-select
                      v-model="transactionDialog.form.currency"
                      :options="currencyOptions"
                      outlined
                      dense
                      required
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                                          <label class="form-label">Transaction Date *</label>
                    <q-input
                      v-model="transactionDialog.form.date"
                      type="date"
                      outlined
                      dense
                      required
                    />
                  </div>

                  <div class="form-group">
                                          <label class="form-label">Property *</label>
                    <q-select
                      v-model="transactionDialog.form.property_id"
                      :options="propertyOptions"
                      outlined
                      dense
                      required
                    />
                  </div>
                </div>

                <div class="form-group">
                                        <label class="form-label">Notes</label>
                  <q-input
                    v-model="transactionDialog.form.notes"
                    type="textarea"
                    outlined
                    dense
                                          placeholder="Transaction notes..."
                    rows="3"
                  />
                </div>
              </div>

              <div class="form-actions">
                <q-btn
                  label="Cancel"
                  flat
                  color="primary"
                  @click="closeTransactionModal"
                />
                <q-btn
                                      :label="transactionDialog.isEditing ? 'Update' : 'Add'"
                  type="submit"
                  color="primary"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "RentRoll",
  data() {
    return {
      loading: false,
      searchTerm: "",
      categoryFilter: null,
      propertyFilter: null,
      typeFilter: null,
      dateRange: "",

      // Transaction data
      transactions: [
        {
          id: 1,
          type: "income",
                      category: "Rent Income",
            from: "John Smith",
          to: "Sunset Villa",
          amount: 5000.0,
          currency: "CNY",
          date: "2024-01-15",
          property_id: 1,
          notes: "January rent payment",
        },
        {
          id: 2,
          type: "expense",
                      category: "Maintenance",
            from: "Sunset Villa",
            to: "Maintenance Company",
          amount: 800.0,
          currency: "CNY",
          date: "2024-01-20",
          property_id: 1,
                      notes: "AC repair",
        },
        {
          id: 3,
          type: "income",
                      category: "Rent Income",
            from: "Jane Doe",
          to: "Downtown Loft",
          amount: 3500.0,
          currency: "CNY",
          date: "2024-01-10",
          property_id: 2,
          notes: "1月份租金",
        },
        {
          id: 4,
          type: "expense",
          category: "Property Management",
          from: "Downtown Loft",
          to: "Property Management Company",
          amount: 500.0,
          currency: "CNY",
          date: "2024-01-05",
          property_id: 2,
          notes: "January property management fee",
        },
        {
          id: 5,
          type: "expense",
          category: "Utilities",
          from: "Lakeside Retreat",
          to: "Utility Company",
          amount: 300.0,
          currency: "CNY",
          date: "2024-01-25",
          property_id: 3,
          notes: "January utilities",
        },
        {
          id: 6,
          type: "income",
          category: "Rent Income",
          from: "Mike Johnson",
          to: "Lakeside Retreat",
          amount: 4200.0,
          currency: "CNY",
          date: "2024-01-12",
          property_id: 3,
          notes: "January rent payment",
        },
        {
          id: 7,
          type: "expense",
          category: "Insurance",
          from: "Sunset Villa",
          to: "Insurance Company",
          amount: 1200.0,
          currency: "CNY",
          date: "2024-01-08",
          property_id: 1,
          notes: "Annual insurance",
        },
        {
          id: 8,
          type: "expense",
          category: "Cleaning",
          from: "Downtown Loft",
          to: "Cleaning Company",
          amount: 200.0,
          currency: "CNY",
          date: "2024-01-18",
          property_id: 2,
          notes: "Common area cleaning",
        },
      ],

      // Property data
      properties: [
        { id: 1, nickname: "Sunset Villa" },
        { id: 2, nickname: "Downtown Loft" },
        { id: 3, nickname: "Lakeside Retreat" },
      ],

      // Options data
      typeOptions: [
        { label: "Income", value: "income" },
        { label: "Expense", value: "expense" },
      ],

      currencyOptions: [
        { label: "Chinese Yuan (CNY)", value: "CNY" },
        { label: "US Dollar (USD)", value: "USD" },
        { label: "Euro (EUR)", value: "EUR" },
      ],

      // Dialog state
      transactionDialog: {
        open: false,
        isEditing: false,
        form: {
          type: "",
          category: "",
          from: "",
          to: "",
          amount: 0,
          currency: "CNY",
          date: "",
          property_id: null,
          notes: "",
        },
      },

      // Table column definitions
      columns: [
        {
          name: "date",
          label: "Date",
          field: "date",
          align: "left",
          sortable: true,
        },
        {
          name: "type",
          label: "Type",
          field: "type",
          align: "center",
          sortable: true,
        },
        {
          name: "category",
          label: "Category",
          field: "category",
          align: "center",
          sortable: true,
        },
        {
          name: "from",
          label: "From",
          field: "from",
          align: "left",
          sortable: true,
        },
        {
          name: "to",
          label: "To",
          field: "to",
          align: "left",
          sortable: true,
        },
        {
          name: "amount",
          label: "Amount",
          field: "amount",
          align: "right",
          sortable: true,
        },
        {
          name: "currency",
          label: "Currency",
          field: "currency",
          align: "center",
          sortable: true,
        },
        {
          name: "property",
          label: "Property",
          field: (row) => this.getPropertyName(row.property_id),
          align: "left",
          sortable: true,
        },
        {
          name: "notes",
          label: "Notes",
          field: "notes",
          align: "left",
        },
        {
          name: "actions",
          label: "Actions",
          field: "actions",
          align: "center",
        },
      ],
    };
  },

  computed: {
    // Property options
    propertyOptions() {
      return this.properties.map((prop) => ({
        label: prop.nickname,
        value: prop.id,
      }));
    },

    // Category options
    categoryOptions() {
      const categories = [...new Set(this.transactions.map((t) => t.category))];
      return categories.map((cat) => ({ label: cat, value: cat }));
    },

    // Filtered transactions
    filteredTransactions() {
      let filtered = this.transactions;

      // Search filter
      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase();
        filtered = filtered.filter(
          (transaction) =>
            transaction.from.toLowerCase().includes(term) ||
            transaction.to.toLowerCase().includes(term) ||
            transaction.category.toLowerCase().includes(term) ||
            transaction.notes?.toLowerCase().includes(term)
        );
      }

      // 类别筛选
      if (this.categoryFilter) {
        filtered = filtered.filter(
          (transaction) => transaction.category === this.categoryFilter
        );
      }

      // 物业筛选
      if (this.propertyFilter) {
        filtered = filtered.filter(
          (transaction) => transaction.property_id === this.propertyFilter
        );
      }

      // 类型筛选
      if (this.typeFilter) {
        filtered = filtered.filter(
          (transaction) => transaction.type === this.typeFilter
        );
      }

      return filtered;
    },

    // 总收入
    totalIncome() {
      return this.filteredTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
    },

    // 总支出
    totalExpense() {
      return this.filteredTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);
    },

    // 净利润
    netProfit() {
      return this.totalIncome - this.totalExpense;
    },
  },

  methods: {
    // 获取物业名称
    getPropertyName(propertyId) {
      const property = this.properties.find((p) => p.id === propertyId);
      return property ? property.nickname : "未知物业";
    },

    // 格式化货币
    formatCurrency(amount) {
      return new Intl.NumberFormat("zh-CN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    },

    // 获取类别颜色
    getCategoryColor(category) {
      const colorMap = {
        租金收入: "green",
        维修费用: "red",
        物业管理费: "orange",
        水电费: "blue",
        保险费用: "purple",
        清洁费用: "teal",
        其他收入: "green",
        其他支出: "red",
      };
      return colorMap[category] || "grey";
    },

    // 获取类别选项
    getCategoryOptions() {
      const incomeCategories = ["租金收入", "押金收入", "其他收入"];

      const expenseCategories = [
        "维修费用",
        "物业管理费",
        "水电费",
        "保险费用",
        "清洁费用",
        "税费",
        "其他支出",
      ];

      return this.transactionDialog.form.type === "income"
        ? incomeCategories.map((cat) => ({ label: cat, value: cat }))
        : expenseCategories.map((cat) => ({ label: cat, value: cat }));
    },

    // 交易类型改变时的处理
    onTypeChange() {
      this.transactionDialog.form.category = "";
    },

    // 清除日期范围
    clearDateRange() {
      this.dateRange = "";
    },

    // 交易管理方法
    openAddTransactionModal() {
      this.transactionDialog.open = true;
      this.transactionDialog.isEditing = false;
      this.transactionDialog.form = {
        type: "income",
        category: "",
        from: "",
        to: "",
        amount: 0,
        currency: "CNY",
        date: new Date().toISOString().slice(0, 10),
        property_id: null,
        notes: "",
      };
    },

    openEditTransactionModal(transaction, index) {
      this.transactionDialog.open = true;
      this.transactionDialog.isEditing = true;
      this.transactionDialog.form = { ...transaction };
    },

    closeTransactionModal() {
      this.transactionDialog.open = false;
      this.transactionDialog.isEditing = false;
      this.transactionDialog.form = {
        type: "income",
        category: "",
        from: "",
        to: "",
        amount: 0,
        currency: "CNY",
        date: "",
        property_id: null,
        notes: "",
      };
    },

    saveTransaction() {
      if (this.transactionDialog.isEditing) {
        // 更新现有交易
        const index = this.transactions.findIndex(
          (t) => t.id === this.transactionDialog.form.id
        );
        if (index !== -1) {
          this.transactions[index] = { ...this.transactionDialog.form };
        }
      } else {
        // 添加新交易
        const newId =
          this.transactions.length > 0
            ? Math.max(...this.transactions.map((t) => t.id)) + 1
            : 1;
        this.transactions.push({
          id: newId,
          ...this.transactionDialog.form,
        });
      }
      this.closeTransactionModal();
    },

    deleteTransaction(index) {
      this.$q
        .dialog({
          title: "确认删除",
          message: "确定要删除这个交易吗？此操作不可撤销。",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          this.transactions.splice(index, 1);
        });
    },

    // 导出功能
    exportToCSV() {
      // 实现CSV导出功能
      this.$q.notify({
        type: "positive",
        message: "CSV导出功能开发中...",
      });
    },

    exportToPDF() {
      // 实现PDF导出功能
      this.$q.notify({
        type: "positive",
        message: "PDF导出功能开发中...",
      });
    },
  },
});
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem 0;
  border-bottom: 2px solid #e5e7eb;
}

.page-title {
  margin: 0;
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.add-transaction-btn {
  font-weight: 500;
}

.export-btn {
  font-weight: 500;
}

.summary-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.summary-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.summary-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.summary-icon {
  flex-shrink: 0;
}

.summary-content {
  flex: 1;
}

.summary-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.summary-amount {
  margin: 0 0 0.25rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.summary-amount.negative {
  color: #ef4444;
}

.summary-period {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.search-filter-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 300px;
}

.filter-box {
  display: flex;
  gap: 1rem;
}

.filter-select,
.date-range-input {
  min-width: 150px;
}

.transactions-container {
  margin-top: 1rem;
}

.transactions-table {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.amount-income {
  color: #22c55e;
  font-weight: 600;
}

.amount-expense {
  color: #ef4444;
  font-weight: 600;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

@media (max-width: 768px) {
  .summary-section {
    grid-template-columns: 1fr;
  }

  .search-filter-section {
    flex-direction: column;
  }

  .filter-box {
    flex-direction: column;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .header-actions {
    flex-direction: column;
  }
}
</style>
