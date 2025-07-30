<template>
  <div class="container-fluid">
    <div class="q-pa-md" style="max-width: 80%">
      <q-form class="q-gutter-sm">
        <div class="row q-pa-sm q-gutter-sm">
          <q-input
            class="col-lg-12 col-sm-12"
            filled
            v-model="newTask.description"
            label="Description"
          />
          <q-input
            class="col-lg-3"
            filled
            v-model="newTask.req_by"
            label="Reported By"
          />
          <q-input
            class="col-lg-3"
            filled
            v-model="newTask.req_date"
            label="Date"
          />
          <q-input
            class="col-lg-2"
            filled
            v-model="newTask.close_flag"
            label="Check to Close"
          />
          <q-input
            class="col-lg-3"
            filled
            v-model="newTask.close_date"
            label="Close Date"
          />
        </div>

        <div class="row q-pa-sm q-gutter-sm">
          <div
            v-for="(tsk, idx) in newTask.resolutions"
            :key="idx"
            class="row q-pa-sm q-gutter-sm"
          >
            <q-input
              class="col-lg-12"
              filled
              v-model="tsk.comment"
              label="Comment"
            />
            <q-input
              class="col-lg-4"
              filled
              v-model="tsk.comm_by"
              label="Comment By"
            />
            <q-input
              class="col-lg-4"
              filled
              v-model="tsk.comm_date"
              label="Comment Date"
            />
          </div>
        </div>

        <div class="row q-pa-sm q-gutter-sm">
          <q-btn label="Submit" @click="alert('good')" color="primary" />
          <q-btn
            label="Reset"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          />
        </div>
      </q-form>

      <!-- Comment History Section -->
      <div class="q-mt-xl">
        <h5>Comment History</h5>
        <q-form @submit.prevent="addComment">
          <div class="row q-gutter-sm q-mb-md">
            <q-input
              class="col-8"
              filled
              v-model="newComment.comment"
              label="Add a comment"
              type="textarea"
              autogrow
              rows="2"
              :max-rows="6"
              required
            />
            <q-input
              class="col-2"
              filled
              v-model="newComment.user_name"
              label="User Name"
              required
            />
            <q-input
              class="col-2"
              filled
              v-model="newComment.role"
              label="Role"
              required
            />
          </div>
          <div class="row q-gutter-sm q-mb-md">
            <q-btn label="Add Comment" type="submit" color="primary" />
          </div>
        </q-form>
        <q-list bordered separator class="bg-grey-1">
          <q-item v-for="(item, idx) in commentsSorted" :key="idx">
            <q-item-section>
              <div class="text-caption text-grey">{{ item.date }}</div>
              <div class="q-mt-xs">{{ item.comment }}</div>
              <div class="text-caption text-blue-8 q-mt-xs">
                By: {{ item.user_name }} ({{ item.role }})
              </div>
            </q-item-section>
          </q-item>
          <q-item v-if="comments.length === 0">
            <q-item-section>
              <div class="text-grey">No comments yet.</div>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <!-- End Comment History Section -->
    </div>
  </div>
</template>

<script>
export default {
  name: "taskEntry",
  data() {
    return {
      newTask: {
        req_date: "",
        req_by: "",
        description: "",
        resolutions: [
          {
            comment: "",
            comm_by: "",
            comm_date: "",
            task_status: "",
          },
        ],
      },
      comments: [
        // Example:
        // { date: '2024-07-20 10:00', comment: 'Initial task created.', user_id: 'u1', user_name: 'Alice', role: 'manager' }
      ],
      newComment: {
        comment: "",
        user_id: "u-demo",
        user_name: "",
        role: "",
      },
    };
  },
  computed: {
    commentsSorted() {
      // Sort by date descending
      return this.comments
        .slice()
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    },
  },
  methods: {
    addComment() {
      if (
        !this.newComment.comment ||
        !this.newComment.user_name ||
        !this.newComment.role
      )
        return;
      const now = new Date();
      const dateStr =
        now.getFullYear() +
        "-" +
        String(now.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(now.getDate()).padStart(2, "0") +
        " " +
        String(now.getHours()).padStart(2, "0") +
        ":" +
        String(now.getMinutes()).padStart(2, "0");
      this.comments.unshift({
        date: dateStr,
        comment: this.newComment.comment,
        user_id: this.newComment.user_id,
        user_name: this.newComment.user_name,
        role: this.newComment.role,
      });
      this.newComment.comment = "";
    },
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
