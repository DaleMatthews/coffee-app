<template>
  <v-layout column>

    <coffee-bag-display :bag="item.coffeeBag" :roast-date="item.roastDate" @update="updateBag"></coffee-bag-display>

    <v-form ref="form" v-model="valid" lazy-validation class="pa-3">

      <!-- roast date picker -->
      <custom-date-picker v-model="item.roastDate" label="Roast Date"></custom-date-picker>

      <!-- text fields -->
      <v-text-field v-model="item.method" label="Method"></v-text-field>
      <v-text-field v-model="item.grinder" label="Grinder"></v-text-field>
      <v-text-field v-model="item.grindSetting" label="Grind Setting"></v-text-field>
      <v-text-field v-model="item.temperature" label="Temperature"></v-text-field>
      <v-text-field v-model="item.time.total" label="Total Time"></v-text-field>
      <v-text-field v-model="item.time.bloom" label="Bloom Time"></v-text-field>
      <v-text-field v-model="item.time.drain" label="Drain Time"></v-text-field>

      <!-- notes and rating -->
      <v-textarea v-model="item.notes" label="Notes"></v-textarea>
      <v-slider
        v-model="item.rating"
        label="Rating"
        thumb-label="always"
        always-dirty
        :max="10"
        ticks :step="0.5"
        :color="ratingColor"
        class="pt-3 px-3"
      ></v-slider>

      <!-- image uploading -->
      <v-subheader>Images</v-subheader>
      <attachments-grid show-add :attachments.sync="item.attachments"/>

      <v-btn
        v-if="itemHasDataComputed"
        outline
        block
        color="primary"
        :disabled="!valid"
        @click="submit"
        :loading="brewSubmitting || pictureIsUploading"
      >
        {{ submitText }}
      </v-btn>

    </v-form>

  </v-layout>
</template>

<script>
import { cloneDeep, some } from 'lodash';
import { mapState } from 'vuex';
import { brewTemplate } from '../utils';
import AttachmentsGrid from '../components/AttachmentsGrid.vue';
import CoffeeBagDisplay from '../components/CoffeeBagDisplay.vue';
import CustomDatePicker from '../components/CustomDatePicker.vue';

export default {
  components: {
    AttachmentsGrid,
    CoffeeBagDisplay,
    CustomDatePicker,
  },
  props: {
    template: {
      type: Object,
      default() { return {}; },
    },
    submitText: {
      type: String,
      required: true,
    },
    itemHasData: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      valid: true,
      item: { ...cloneDeep(brewTemplate), ...cloneDeep(this.template) },
    };
  },
  computed: {
    ...mapState({
      brewSubmitting: state => state.loading.brewSubmitting,
    }),
    ratingColor() {
      if (this.item.rating < 3) return 'lime';
      if (this.item.rating < 5.5) return 'light-green';
      if (this.item.rating < 8) return 'green';
      if (this.item.rating < 10) return 'green darken-2';
      return 'green darken-4';
    },
    itemHasDataComputed() {
      let val;
      if (!this.item) val = false;
      else {
        val = some([
          this.item.method,
          this.item.grinder,
          this.item.grindSetting,
          this.item.temperature,
          this.item.time.total,
          this.item.time.bloom,
          this.item.time.drain,
          this.item.notes,
        ]);
      }
      this.$emit('update:itemHasData', val);
      return val;
    },
    pictureIsUploading() {
      return some(this.item.attachments, a => a.progress !== 100);
    },
  },
  watch: {
    template: {
      immediate: true,
      deep: true,
      handler(val) {
        if (this.$refs.form) this.$refs.form.reset();
        this.item = cloneDeep(val);
      },
    },
  },
  methods: {
    submit() {
      if (!this.$refs.form.validate()) return;
      this.$emit('submit', { ...this.item, attachments: this.item.attachments.map(a => a.key) });
    },
    updateBag(val) {
      this.item.coffeeBag = cloneDeep(val);
    },
  },
};
</script>
