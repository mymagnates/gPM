import { defineStore } from "pinia";
import { db } from "../firebase.js";

// import "firebase/firestore";
// Use the Firestore instance
let gcard = db
  .collection("gbt")
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
  });

export const useCounterStore = defineStore("counter", {
  state: () => ({
    counter: 0,
  }),

  getters: {
    doubleCount: (state) => state.counter * 2,
  },

  actions: {
    increment() {
      this.counter++;
    },
  },
});

export const useGPTStore = defineStore("gpts", {
  state: () => ({
    counter: 0,
  }),

  getters: {
    saveUpdate: (state) => alert("update saved"),
  },

  actions: {
    removeGpt() {
      alert("oh no, rmeoved");
    },
  },
});
