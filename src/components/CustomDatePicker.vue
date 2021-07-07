<template>
  <v-dialog ref="dialog" v-model="modal" :return-value.sync="dateFormatted" persistent lazy full-width width="290px">
    <template v-slot:activator="{ on }">
      <v-text-field v-model="dateFormatted" :label="label" prepend-icon="event" readonly clearable v-on="on"></v-text-field>
    </template>
    <v-date-picker v-model="dateFormatted" scrollable>
      <v-spacer></v-spacer>
      <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
      <v-btn flat color="primary" @click="$refs.dialog.save(dateFormatted)">OK</v-btn>
    </v-date-picker>
  </v-dialog>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'update:value',
  },
  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      required: true,
    },
  },
  data() {
    return {
      modal: false,
    };
  },
  computed: {
    dateFormatted: {
      get() {
        if (!this.value) return '';
        return new Date(this.value).toISOString().split('T')[0];
      },
      set(newValue) {
        var values = newValue.split('-');
        var date = new Date();
        date.setYear(values[0]);
        date.setMonth(Number(values[1]) - 1);
        date.setDate(Number(values[2]));
        date.setHours(0, 0, 0, 0);
        this.$emit('update:value', newValue ? date.getTime() : null);
      },
    },
  },
};
</script>
