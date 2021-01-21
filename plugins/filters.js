import Vue from "vue";

Vue.filter("formatMoney", function (value) {
  return value === null || value === ""
    ? ""
    : new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
});
