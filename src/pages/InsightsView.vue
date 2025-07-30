<template>
  <q-page class="insights-page">
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <h4 class="page-title">Data Analytics & Reports</h4>
        <div class="header-actions">
          <q-btn
            color="primary"
            icon="refresh"
            label="Refresh Data"
            @click="refreshData"
            class="refresh-btn"
          />
          <q-btn
            color="secondary"
            icon="download"
            label="Export Report"
            @click="exportReport"
            class="export-btn"
          />
        </div>
      </div>

      <!-- Property Selection -->
      <div class="property-selection-section">
        <div class="section-header">
          <h5 class="section-title">Select Analysis Scope</h5>
          <div class="selection-controls">
            <q-btn
              flat
              color="primary"
              label="Select All"
              @click="selectAllProperties"
              size="sm"
            />
            <q-btn
              flat
              color="secondary"
              label="Clear"
              @click="clearPropertySelection"
              size="sm"
            />
          </div>
        </div>

        <div class="property-grid">
          <div
            v-for="property in properties"
            :key="property.id"
            class="property-card"
            :class="{ selected: selectedProperties.includes(property.id) }"
            @click="togglePropertySelection(property.id)"
          >
            <div class="property-info">
              <h6 class="property-name">{{ property.nickname }}</h6>
              <p class="property-address">{{ property.address }}</p>
            </div>
            <div class="selection-indicator">
              <q-icon
                :name="
                  selectedProperties.includes(property.id)
                    ? 'check_circle'
                    : 'radio_button_unchecked'
                "
                :color="
                  selectedProperties.includes(property.id) ? 'primary' : 'grey'
                "
                size="sm"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Date Range Selection -->
      <div class="date-range-section">
        <div class="section-header">
          <h5 class="section-title">Time Range</h5>
        </div>
        <div class="date-controls">
          <div class="date-inputs">
            <q-select
              v-model="selectedFromMonth"
              :options="monthOptions"
              label="From Month"
              outlined
              dense
              class="month-select"
            />
            <q-select
              v-model="selectedFromYear"
              :options="yearOptions"
              label="From Year"
              outlined
              dense
              class="year-select"
            />
            <q-select
              v-model="selectedToMonth"
              :options="monthOptions"
              label="To Month"
              outlined
              dense
              class="month-select"
            />
            <q-select
              v-model="selectedToYear"
              :options="yearOptions"
              label="To Year"
              outlined
              dense
              class="year-select"
            />
          </div>
        </div>
        <div class="quick-dates-row">
          <q-btn
            flat
            color="primary"
            label="This Month"
            @click="setCurrentMonth"
            size="sm"
          />
          <q-btn
            flat
            color="primary"
            label="Last Month"
            @click="setLastMonth"
            size="sm"
          />
          <q-btn
            flat
            color="primary"
            label="This Quarter"
            @click="setCurrentQuarter"
            size="sm"
          />
          <q-btn
            flat
            color="primary"
            label="Last Quarter"
            @click="setLastQuarter"
            size="sm"
          />
          <q-btn
            flat
            color="primary"
            label="Year to Date"
            @click="setYearToDate"
            size="sm"
          />
          <q-btn
            flat
            color="primary"
            label="Last Year"
            @click="setLastYear"
            size="sm"
          />
        </div>
      </div>

      <!-- Financial Performance KPI -->
      <div class="kpi-section">
        <div class="section-header">
          <h5 class="section-title">Financial Performance Analysis</h5>
        </div>

        <!-- Financial Summary Cards -->
        <div class="summary-cards">
          <div class="summary-card income">
            <div class="card-icon">
              <q-icon name="trending_up" size="2rem" color="green" />
            </div>
            <div class="card-content">
              <h6 class="card-title">Total Income</h6>
              <p class="card-value">{{ formatCurrency(totalIncome) }}</p>
              <p class="card-change positive">+{{ incomeGrowth }}%</p>
            </div>
          </div>

          <div class="summary-card expense">
            <div class="card-icon">
              <q-icon name="trending_down" size="2rem" color="red" />
            </div>
            <div class="card-content">
              <h6 class="card-title">Total Expense</h6>
              <p class="card-value">{{ formatCurrency(totalExpense) }}</p>
              <p class="card-change negative">+{{ expenseGrowth }}%</p>
            </div>
          </div>

          <div class="summary-card profit">
            <div class="card-icon">
              <q-icon name="account_balance" size="2rem" color="blue" />
            </div>
            <div class="card-content">
              <h6 class="card-title">Net Profit</h6>
              <p class="card-value">{{ formatCurrency(netProfit) }}</p>
              <p
                class="card-change"
                :class="profitGrowth >= 0 ? 'positive' : 'negative'"
              >
                {{ profitGrowth >= 0 ? "+" : "" }}{{ profitGrowth }}%
              </p>
            </div>
          </div>

          <div class="summary-card roi">
            <div class="card-icon">
              <q-icon name="analytics" size="2rem" color="purple" />
            </div>
            <div class="card-content">
              <h6 class="card-title">Return on Investment</h6>
              <p class="card-value">{{ roiPercentage }}%</p>
              <p class="card-change positive">+{{ roiGrowth }}%</p>
            </div>
          </div>
        </div>

        <!-- Financial Charts -->
        <div class="charts-container">
          <div class="chart-card">
            <h6 class="chart-title">Income & Expense Trend</h6>
            <div class="chart-content">
              <div class="chart-bars">
                <div
                  class="chart-bar income-bar"
                  style="
                    height: 80%;
                    background: linear-gradient(to top, #10b981, #34d399);
                  "
                >
                  <span class="bar-label">Income</span>
                  <span class="bar-value">$125K</span>
                </div>
                <div
                  class="chart-bar expense-bar"
                  style="
                    height: 45%;
                    background: linear-gradient(to top, #ef4444, #f87171);
                  "
                >
                  <span class="bar-label">Expense</span>
                  <span class="bar-value">$45K</span>
                </div>
                <div
                  class="chart-bar profit-bar"
                  style="
                    height: 65%;
                    background: linear-gradient(to top, #3b82f6, #60a5fa);
                  "
                >
                  <span class="bar-label">Profit</span>
                  <span class="bar-value">$80K</span>
                </div>
              </div>
              <div class="chart-legend">
                <div class="legend-item">
                  <span class="legend-color income"></span>
                  <span>Income</span>
                </div>
                <div class="legend-item">
                  <span class="legend-color expense"></span>
                  <span>Expense</span>
                </div>
                <div class="legend-item">
                  <span class="legend-color profit"></span>
                  <span>Profit</span>
                </div>
              </div>
            </div>
          </div>

          <div class="chart-card">
            <h6 class="chart-title">Analysis by Category</h6>
            <div class="chart-content">
              <div class="pie-chart">
                <div
                  class="pie-segment maintenance"
                  style="transform: rotate(0deg); background: #ef4444"
                >
                  <span class="segment-label">Maintenance 35%</span>
                </div>
                <div
                  class="pie-segment utilities"
                  style="transform: rotate(126deg); background: #f59e0b"
                >
                  <span class="segment-label">Utilities 25%</span>
                </div>
                <div
                  class="pie-segment insurance"
                  style="transform: rotate(216deg); background: #3b82f6"
                >
                  <span class="segment-label">Insurance 20%</span>
                </div>
                <div
                  class="pie-segment other"
                  style="transform: rotate(288deg); background: #10b981"
                >
                  <span class="segment-label">Other 20%</span>
                </div>
              </div>
              <div class="pie-legend">
                <div class="legend-item">
                  <span class="legend-color maintenance"></span>
                  <span>Maintenance</span>
                </div>
                <div class="legend-item">
                  <span class="legend-color utilities"></span>
                  <span>Utilities</span>
                </div>
                <div class="legend-item">
                  <span class="legend-color insurance"></span>
                  <span>Insurance</span>
                </div>
                <div class="legend-item">
                  <span class="legend-color other"></span>
                  <span>Other</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Task Management KPI -->
      <div class="kpi-section">
        <div class="section-header">
          <h5 class="section-title">Task Management Analysis</h5>
        </div>

        <!-- Task Summary Cards -->
        <div class="summary-cards">
          <div class="summary-card open-tasks">
            <div class="card-icon">
              <q-icon name="pending" size="2rem" color="orange" />
            </div>
            <div class="card-content">
              <h6 class="card-title">Open Tasks</h6>
              <p class="card-value">{{ openTasksCount }}</p>
              <p class="card-change">{{ openTasksChange }}%</p>
            </div>
          </div>

          <div class="summary-card completed-tasks">
            <div class="card-icon">
              <q-icon name="task_alt" size="2rem" color="green" />
            </div>
            <div class="card-content">
              <h6 class="card-title">Completed Tasks</h6>
              <p class="card-value">{{ completedTasksCount }}</p>
              <p class="card-change positive">+{{ completedTasksChange }}%</p>
            </div>
          </div>

          <div class="summary-card avg-completion">
            <div class="card-icon">
              <q-icon name="schedule" size="2rem" color="blue" />
            </div>
            <div class="card-content">
              <h6 class="card-title">Average Completion Time</h6>
              <p class="card-value">{{ avgCompletionTime }} days</p>
              <p class="card-change negative">+{{ completionTimeChange }}%</p>
            </div>
          </div>

          <div class="summary-card task-efficiency">
            <div class="card-icon">
              <q-icon name="speed" size="2rem" color="purple" />
            </div>
            <div class="card-content">
              <h6 class="card-title">Task Efficiency</h6>
              <p class="card-value">{{ taskEfficiency }}%</p>
              <p class="card-change positive">+{{ efficiencyChange }}%</p>
            </div>
          </div>
        </div>

        <!-- Task Charts -->
        <div class="charts-container">
          <div class="chart-card">
            <h6 class="chart-title">Task Status Distribution</h6>
            <div class="chart-content">
              <div class="donut-chart">
                <div class="donut-hole"></div>
                <div
                  class="donut-segment open"
                  style="transform: rotate(0deg); background: #f59e0b"
                >
                  <span class="segment-label">Open 25%</span>
                </div>
                <div
                  class="donut-segment in-progress"
                  style="transform: rotate(90deg); background: #3b82f6"
                >
                  <span class="segment-label">In Progress 30%</span>
                </div>
                <div
                  class="donut-segment completed"
                  style="transform: rotate(198deg); background: #10b981"
                >
                  <span class="segment-label">Completed 45%</span>
                </div>
              </div>
              <div class="donut-legend">
                <div class="legend-item">
                  <span class="legend-color open"></span>
                  <span>Open</span>
                </div>
                <div class="legend-item">
                  <span class="legend-color in-progress"></span>
                  <span>In Progress</span>
                </div>
                <div class="legend-item">
                  <span class="legend-color completed"></span>
                  <span>Completed</span>
                </div>
              </div>
            </div>
          </div>

          <div class="chart-card">
            <h6 class="chart-title">Task Completion Trend</h6>
            <div class="chart-content">
              <div class="line-chart">
                <div
                  class="chart-line"
                  style="background: linear-gradient(45deg, #3b82f6, #60a5fa)"
                >
                  <div
                    class="data-point"
                    style="left: 10%; top: 60%"
                    data-value="40"
                  ></div>
                  <div
                    class="data-point"
                    style="left: 30%; top: 45%"
                    data-value="55"
                  ></div>
                  <div
                    class="data-point"
                    style="left: 50%; top: 35%"
                    data-value="65"
                  ></div>
                  <div
                    class="data-point"
                    style="left: 70%; top: 25%"
                    data-value="75"
                  ></div>
                  <div
                    class="data-point"
                    style="left: 90%; top: 15%"
                    data-value="85"
                  ></div>
                </div>
                <div class="chart-axis">
                  <div class="axis-label">Jan</div>
                  <div class="axis-label">Feb</div>
                  <div class="axis-label">Mar</div>
                  <div class="axis-label">Apr</div>
                  <div class="axis-label">May</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contract Execution KPI -->
      <div class="kpi-section">
        <div class="section-header">
          <h5 class="section-title">Lease Execution Analysis</h5>
        </div>

        <!-- Contract Summary Cards -->
        <div class="summary-cards">
          <div class="summary-card active-contracts">
            <div class="card-icon">
              <q-icon name="description" size="2rem" color="green" />
            </div>
            <div class="card-content">
              <h6 class="card-title">Active Leases</h6>
              <p class="card-value">{{ activeContractsCount }}</p>
              <p class="card-change positive">+{{ activeContractsChange }}%</p>
            </div>
          </div>

          <div class="summary-card expiring-contracts">
            <div class="card-icon">
              <q-icon name="warning" size="2rem" color="orange" />
            </div>
            <div class="card-content">
              <h6 class="card-title">Expiring Leases</h6>
              <p class="card-value">{{ expiringContractsCount }}</p>
              <p class="card-change">{{ expiringContractsChange }}%</p>
            </div>
          </div>

          <div class="summary-card contract-value">
            <div class="card-icon">
              <q-icon name="attach_money" size="2rem" color="blue" />
            </div>
            <div class="card-content">
              <h6 class="card-title">Total Lease Value</h6>
              <p class="card-value">{{ formatCurrency(totalContractValue) }}</p>
              <p class="card-change positive">+{{ contractValueChange }}%</p>
            </div>
          </div>

          <div class="summary-card renewal-rate">
            <div class="card-icon">
              <q-icon name="autorenew" size="2rem" color="purple" />
            </div>
            <div class="card-content">
              <h6 class="card-title">Renewal Rate</h6>
              <p class="card-value">{{ renewalRate }}%</p>
              <p class="card-change positive">+{{ renewalRateChange }}%</p>
            </div>
          </div>
        </div>

        <!-- Contract Charts -->
        <div class="charts-container">
          <div class="chart-card">
            <h6 class="chart-title">Lease Expiration Distribution</h6>
            <div class="chart-placeholder">
              <q-icon name="calendar_today" size="4rem" color="grey-4" />
              <p>Lease Expiration Time Distribution</p>
            </div>
          </div>

          <div class="chart-card">
            <h6 class="chart-title">Lease Value Analysis</h6>
            <div class="chart-placeholder">
              <q-icon name="bar_chart" size="4rem" color="grey-4" />
              <p>Lease Value Bar Chart</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tax/Rent Roll Analysis -->
      <div class="kpi-section">
        <div class="section-header">
          <h5 class="section-title">Tax & Rent Analysis</h5>
        </div>

        <!-- Tax Summary Cards -->
        <div class="summary-cards">
          <div class="summary-card rental-income">
            <div class="card-icon">
              <q-icon name="home" size="2rem" color="green" />
            </div>
            <div class="card-content">
              <h6 class="card-title">Rental Income</h6>
              <p class="card-value">{{ formatCurrency(totalRentalIncome) }}</p>
              <p class="card-change positive">+{{ rentalIncomeChange }}%</p>
            </div>
          </div>

          <div class="summary-card tax-liability">
            <div class="card-icon">
              <q-icon name="receipt" size="2rem" color="red" />
            </div>
            <div class="card-content">
              <h6 class="card-title">Tax Liability</h6>
              <p class="card-value">{{ formatCurrency(totalTaxLiability) }}</p>
              <p class="card-change negative">+{{ taxLiabilityChange }}%</p>
            </div>
          </div>

          <div class="summary-card net-income">
            <div class="card-icon">
              <q-icon name="account_balance_wallet" size="2rem" color="blue" />
            </div>
            <div class="card-content">
              <h6 class="card-title">Net Income</h6>
              <p class="card-value">{{ formatCurrency(netIncome) }}</p>
              <p
                class="card-change"
                :class="netIncomeChange >= 0 ? 'positive' : 'negative'"
              >
                {{ netIncomeChange >= 0 ? "+" : "" }}{{ netIncomeChange }}%
              </p>
            </div>
          </div>

          <div class="summary-card occupancy-rate">
            <div class="card-icon">
              <q-icon name="people" size="2rem" color="purple" />
            </div>
            <div class="card-content">
              <h6 class="card-title">Occupancy Rate</h6>
              <p class="card-value">{{ occupancyRate }}%</p>
              <p class="card-change positive">+{{ occupancyRateChange }}%</p>
            </div>
          </div>
        </div>

        <!-- Tax/Rent Charts -->
        <div class="charts-container">
          <div class="chart-card">
            <h6 class="chart-title">Rental Income by Property</h6>
            <div class="chart-content">
              <div class="stacked-bar-chart">
                <div class="property-row">
                  <span class="property-name">Sunset Villa</span>
                  <div
                    class="income-bar"
                    style="width: 75%; background: #10b981"
                  >
                    <span class="bar-value">$35K</span>
                  </div>
                </div>
                <div class="property-row">
                  <span class="property-name">Ocean View</span>
                  <div
                    class="income-bar"
                    style="width: 85%; background: #3b82f6"
                  >
                    <span class="bar-value">$40K</span>
                  </div>
                </div>
                <div class="property-row">
                  <span class="property-name">Mountain Lodge</span>
                  <div
                    class="income-bar"
                    style="width: 60%; background: #f59e0b"
                  >
                    <span class="bar-value">$28K</span>
                  </div>
                </div>
                <div class="property-row">
                  <span class="property-name">City Center</span>
                  <div
                    class="income-bar"
                    style="width: 90%; background: #8b5cf6"
                  >
                    <span class="bar-value">$42K</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="chart-card">
            <h6 class="chart-title">Tax Classification Analysis</h6>
            <div class="chart-content">
              <div class="tax-pie-chart">
                <div
                  class="pie-segment property-tax"
                  style="transform: rotate(0deg); background: #ef4444"
                >
                  <span class="segment-label">Property Tax 40%</span>
                </div>
                <div
                  class="pie-segment income-tax"
                  style="transform: rotate(144deg); background: #f59e0b"
                >
                  <span class="segment-label">Income Tax 30%</span>
                </div>
                <div
                  class="pie-segment other-tax"
                  style="transform: rotate(252deg); background: #3b82f6"
                >
                  <span class="segment-label">Other Tax 20%</span>
                </div>
                <div
                  class="pie-segment deductions"
                  style="transform: rotate(324deg); background: #10b981"
                >
                  <span class="segment-label">Deductions 10%</span>
                </div>
              </div>
              <div class="tax-legend">
                <div class="legend-item">
                  <span class="legend-color property-tax"></span>
                  <span>Property Tax</span>
                </div>
                <div class="legend-item">
                  <span class="legend-color income-tax"></span>
                  <span>Income Tax</span>
                </div>
                <div class="legend-item">
                  <span class="legend-color other-tax"></span>
                  <span>Other Tax</span>
                </div>
                <div class="legend-item">
                  <span class="legend-color deductions"></span>
                  <span>Deductions</span>
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
  name: "InsightsView",

  data() {
    return {
      // Property selection
      properties: [
        { id: 1, nickname: "Sunset Villa", address: "123 Sunset Blvd, LA" },
        { id: 2, nickname: "Ocean View", address: "456 Ocean Dr, Miami" },
        {
          id: 3,
          nickname: "Mountain Lodge",
          address: "789 Mountain Rd, Denver",
        },
        { id: 4, nickname: "City Center", address: "321 Main St, NYC" },
      ],
      selectedProperties: [1, 2, 3, 4], // Default to all properties

      // Date range
      dateRange: {
        from: "2024/01/01",
        to: "2024/12/31",
      },
      selectedFromMonth: "January",
      selectedFromYear: 2024,
      selectedToMonth: "December",
      selectedToYear: 2024,
      monthOptions: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      yearOptions: [2020, 2021, 2022, 2023, 2024, 2025],

      // Financial KPI data
      totalIncome: 125000,
      totalExpense: 45000,
      netProfit: 80000,
      roiPercentage: 12.5,
      incomeGrowth: 8.5,
      expenseGrowth: 3.2,
      profitGrowth: 15.2,
      roiGrowth: 2.1,

      // Task KPI data
      openTasksCount: 15,
      completedTasksCount: 45,
      avgCompletionTime: 3.2,
      taskEfficiency: 85,
      openTasksChange: -5,
      completedTasksChange: 12,
      completionTimeChange: -8,
      efficiencyChange: 5,

      // Contract KPI data
      activeContractsCount: 8,
      expiringContractsCount: 2,
      totalContractValue: 250000,
      renewalRate: 92,
      activeContractsChange: 0,
      expiringContractsChange: 50,
      contractValueChange: 8.5,
      renewalRateChange: 3,

      // Tax/Rent KPI data
      totalRentalIncome: 98000,
      totalTaxLiability: 22000,
      netIncome: 76000,
      occupancyRate: 95,
      rentalIncomeChange: 6.5,
      taxLiabilityChange: 4.2,
      netIncomeChange: 7.8,
      occupancyRateChange: 2.1,
    };
  },

  methods: {
    // Property selection methods
    togglePropertySelection(propertyId) {
      const index = this.selectedProperties.indexOf(propertyId);
      if (index > -1) {
        this.selectedProperties.splice(index, 1);
      } else {
        this.selectedProperties.push(propertyId);
      }
    },

    selectAllProperties() {
      this.selectedProperties = this.properties.map((p) => p.id);
    },

    clearPropertySelection() {
      this.selectedProperties = [];
    },

    // Date range methods
    setCurrentMonth() {
      const today = new Date();
      this.selectedFromMonth = this.monthOptions[today.getMonth()];
      this.selectedFromYear = today.getFullYear();
      this.selectedToMonth = this.monthOptions[today.getMonth()];
      this.selectedToYear = today.getFullYear();
    },

    setLastMonth() {
      const today = new Date();
      today.setMonth(today.getMonth() - 1);
      this.selectedFromMonth = this.monthOptions[today.getMonth()];
      this.selectedFromYear = today.getFullYear();
      this.selectedToMonth = this.monthOptions[today.getMonth()];
      this.selectedToYear = today.getFullYear();
    },

    setCurrentQuarter() {
      const today = new Date();
      const month = today.getMonth();
      const quarter = Math.floor(month / 3);
      const startMonth = quarter * 3;
      this.selectedFromMonth = this.monthOptions[startMonth];
      this.selectedFromYear = today.getFullYear();
      this.selectedToMonth = this.monthOptions[startMonth + 2];
      this.selectedToYear = today.getFullYear();
    },

    setLastQuarter() {
      const today = new Date();
      const month = today.getMonth();
      const quarter = Math.floor(month / 3);
      const startMonth = quarter * 3;
      const lastQuarterStart = startMonth - 3;
      const lastQuarterYear =
        lastQuarterStart < 0 ? today.getFullYear() - 1 : today.getFullYear();
      const adjustedStartMonth =
        lastQuarterStart < 0 ? lastQuarterStart + 12 : lastQuarterStart;
      this.selectedFromMonth = this.monthOptions[adjustedStartMonth];
      this.selectedFromYear = lastQuarterYear;
      this.selectedToMonth = this.monthOptions[adjustedStartMonth + 2];
      this.selectedToYear = lastQuarterYear;
    },

    setYearToDate() {
      const today = new Date();
      this.selectedFromMonth = this.monthOptions[0];
      this.selectedFromYear = today.getFullYear();
      this.selectedToMonth = this.monthOptions[today.getMonth()];
      this.selectedToYear = today.getFullYear();
    },

    setLastYear() {
      this.selectedFromYear = this.selectedFromYear - 1;
      this.selectedToYear = this.selectedToYear - 1;
    },

    // Utility methods
    formatCurrency(amount) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    },

    refreshData() {
      // Simulate data refresh
      this.$q.notify({
        type: "positive",
        message: "Data refreshed",
        position: "top",
      });
    },

    exportReport() {
      // Simulate report export
      this.$q.notify({
        type: "positive",
        message: "Exporting report...",
        position: "top",
      });
    },
  },
});
</script>

<style scoped>
.insights-page {
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

.refresh-btn,
.export-btn {
  font-weight: 600;
}

/* Property Selection Section */
.property-selection-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  margin: 0;
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 600;
}

.selection-controls {
  display: flex;
  gap: 0.5rem;
}

.property-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.property-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
}

.property-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
}

.property-card.selected {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.property-info {
  flex: 1;
}

.property-name {
  margin: 0 0 0.25rem 0;
  font-weight: 600;
  color: #1f2937;
}

.property-address {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.selection-indicator {
  margin-left: 1rem;
}

/* Date Range Section */
.date-range-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.date-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.date-inputs {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.month-select,
.year-select {
  width: 120px;
  min-width: 120px;
}

.quick-dates-row {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  padding-top: 0.5rem;
  border-top: 1px solid #e5e7eb;
}

/* KPI Sections */
.kpi-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.summary-card {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-icon {
  margin-right: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-content {
  flex: 1;
}

.card-title {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.card-value {
  margin: 0 0 0.25rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.card-change {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
}

.card-change.positive {
  color: #059669;
}

.card-change.negative {
  color: #dc2626;
}

/* Charts Container */
.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.chart-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
}

.chart-title {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

/* Chart Styles */
.chart-content {
  position: relative;
  height: 200px;
  padding: 1rem;
}

/* Bar Chart Styles */
.chart-bars {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 120px;
  padding: 0 20px;
}

.chart-bar {
  width: 40px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.bar-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 8px;
  text-align: center;
}

.bar-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  position: absolute;
  top: -25px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.chart-legend {
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-color.income {
  background: #10b981;
}
.legend-color.expense {
  background: #ef4444;
}
.legend-color.profit {
  background: #3b82f6;
}

/* Pie Chart Styles */
.pie-chart {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto;
}

.pie-segment {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  clip: rect(0, 60px, 120px, 60px);
  transform-origin: 50% 50%;
}

.pie-segment.maintenance {
  transform: rotate(0deg);
}
.pie-segment.utilities {
  transform: rotate(126deg);
}
.pie-segment.insurance {
  transform: rotate(216deg);
}
.pie-segment.other {
  transform: rotate(288deg);
}

.segment-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.75rem;
  color: white;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  text-align: center;
  width: 80px;
}

.pie-legend {
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
}

.pie-legend .legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.pie-legend .legend-color {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 3px;
}

.legend-color.maintenance {
  background: #ef4444;
}
.legend-color.utilities {
  background: #f59e0b;
}
.legend-color.insurance {
  background: #3b82f6;
}
.legend-color.other {
  background: #10b981;
}

/* Donut Chart Styles */
.donut-chart {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto;
}

.donut-hole {
  position: absolute;
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
}

.donut-segment {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  clip: rect(0, 60px, 120px, 60px);
  transform-origin: 50% 50%;
}

.legend-color.open {
  background: #f59e0b;
}
.legend-color.in-progress {
  background: #3b82f6;
}
.legend-color.completed {
  background: #10b981;
}

.donut-legend {
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
}

/* Line Chart Styles */
.line-chart {
  position: relative;
  height: 120px;
  padding: 20px;
}

.chart-line {
  position: absolute;
  width: 80%;
  height: 2px;
  top: 50%;
  left: 10%;
  background: linear-gradient(45deg, #3b82f6, #60a5fa);
}

.data-point {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #3b82f6;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.data-point::after {
  content: attr(data-value);
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  font-weight: 600;
  color: #3b82f6;
}

.chart-axis {
  position: absolute;
  bottom: 0;
  left: 10%;
  width: 80%;
  display: flex;
  justify-content: space-between;
}

.axis-label {
  font-size: 0.75rem;
  color: #6b7280;
  text-align: center;
}

/* Calendar Chart Styles */
.calendar-chart {
  position: relative;
  height: 120px;
  padding: 20px;
}

.month-grid {
  position: relative;
  width: 100%;
  height: 80px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.month-label {
  position: absolute;
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 600;
}

.month-label:nth-child(1) {
  left: 10%;
  top: 10%;
}
.month-label:nth-child(2) {
  left: 35%;
  top: 10%;
}
.month-label:nth-child(3) {
  left: 60%;
  top: 10%;
}
.month-label:nth-child(4) {
  left: 85%;
  top: 10%;
}

.contract-dot {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.contract-dot::after {
  content: attr(data-count);
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  font-weight: 600;
  color: #1f2937;
}

.contract-dot.active {
  background: #10b981;
}
.contract-dot.expiring {
  background: #f59e0b;
}

.calendar-legend {
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
}

.legend-color.active {
  background: #10b981;
}
.legend-color.expiring {
  background: #f59e0b;
}

/* Bar Chart Styles */
.bar-chart {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 120px;
  padding: 0 20px;
}

.bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60px;
}

.bar-fill {
  width: 100%;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 20px;
}

.bar-value {
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.bar-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 8px;
  text-align: center;
}

/* Stacked Bar Chart Styles */
.stacked-bar-chart {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 120px;
  padding: 10px;
}

.property-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.property-name {
  font-size: 0.875rem;
  color: #6b7280;
  width: 100px;
  flex-shrink: 0;
}

.income-bar {
  height: 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 8px;
  position: relative;
}

.income-bar .bar-value {
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* Tax Pie Chart Styles */
.tax-pie-chart {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto;
}

.tax-legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin-top: 1rem;
  gap: 0.5rem;
}

.legend-color.property-tax {
  background: #ef4444;
}
.legend-color.income-tax {
  background: #f59e0b;
}
.legend-color.other-tax {
  background: #3b82f6;
}
.legend-color.deductions {
  background: #10b981;
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

  .property-grid {
    grid-template-columns: 1fr;
  }

  .summary-cards {
    grid-template-columns: 1fr;
  }

  .charts-container {
    grid-template-columns: 1fr;
  }

  .date-controls {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
