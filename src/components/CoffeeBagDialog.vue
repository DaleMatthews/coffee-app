<template>
  <v-dialog v-model="value" full-width max-width fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-card>

      <v-toolbar card dark color="primary">
        <confirm-dialog v-if="bagIsDirty && editable" @yes="close" yes="yes" no="cancel" message="Are you sure? Any new input will be lost.">
          <v-btn icon dark>
            <v-icon>close</v-icon>
          </v-btn>
        </confirm-dialog>
        <v-btn v-else icon dark @click="close">
          <v-icon>close</v-icon>
        </v-btn>

        <v-toolbar-title>Coffee Bag</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn v-if="editable" dark flat @click="update">Save</v-btn>
          <v-btn v-else dark flat @click="editable=true">Edit</v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-form v-if="editable" ref="form" v-model="valid" lazy-validation class="pa-3">
        <v-text-field v-model="editableBag.brand" label="Brand"></v-text-field>
        <v-text-field v-model="editableBag.label" label="Label"></v-text-field>
        <v-text-field v-model="editableBag.process" label="Process"></v-text-field>
        <v-text-field v-model="editableBag.origin.producer" label="Producer"></v-text-field>
        <v-text-field v-model="editableBag.origin.country" label="Country"></v-text-field>
        <v-text-field v-model="editableBag.origin.region" label="Region"></v-text-field>
        <v-text-field v-model="editableBag.origin.farm" label="Farm"></v-text-field>
        <v-text-field v-model="editableBag.origin.elevation" label="Elevation"></v-text-field>

        <div class="pb-3">
          <v-layout align-center>
            <v-text-field v-model="selectedVarietal" @keyup.enter="addVarietal" placeholder="Add a varietal"></v-text-field>
            <v-btn @click="addVarietal">Add</v-btn>
          </v-layout>
          <v-chip v-for="varietal in editableBag.varietals" :key="varietal">
            {{ varietal }} <v-icon right @click="removeVarietal(varietal)">cancel</v-icon>
          </v-chip>
        </div>

        <div class="pb-3">
          <v-layout align-center>
            <v-text-field v-model="selectedFlavorNote" @keyup.enter="addFlavorNote" placeholder="Add a flavor note"></v-text-field>
            <v-btn @click="addFlavorNote">Add</v-btn>
          </v-layout>
          <v-chip v-for="flavorNote in editableBag.flavorNotes" :key="flavorNote">
            {{ flavorNote }} <v-icon right @click="removeFlavorNote(flavorNote)">cancel</v-icon>
          </v-chip>
        </div>

        <h3 class="subheading grey--text text--darken-2">Roast Level</h3>
        <v-slider v-model="roastLevel" always-dirty :color="roastColor" :max="4" :step="1" :tick-labels="roastTicks" ticks="always" tick-size="2"/>
      </v-form>

      <v-layout v-else wrap px-4>
        <v-flex v-if="editableBag.brand || editableBag.label" xs12 py-2>
          <h2 v-if="editableBag.brand" class="headline primary--text">{{ editableBag.brand }}</h2>
          <i v-if="editableBag.label" class="title secondary--text">{{ editableBag.label }}</i>
        </v-flex>

        <v-alert v-if="date" :value="true" color="info" icon="info" outline class="my-2">
          Roasted on {{ date }}
        </v-alert>

        <v-flex xs6 v-for="(prop, index) in bagInfo" :key="index">
          <label class="pt-1 subheading secondary--text">{{ prop.label }}</label>
          <p class="body-1">{{ prop.value }}</p>
        </v-flex>

        <v-flex xs12 v-if="editableBag.notes">
          <label class="pt-1 subheading secondary--text">Notes</label>
          <p class="body-1">{{ editableBag.notes }}</p>
        </v-flex>
      </v-layout>

    </v-card>
  </v-dialog>
</template>

<script>
import { cloneDeep, get, filter } from 'lodash';
import { bagTemplate } from '../utils';
import ConfirmDialog from './ConfirmDialog.vue';

export default {
  name: 'CoffeeBagDialog',
  components: {
    ConfirmDialog,
  },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    bag: {
      type: Object,
      required: true,
      default() {
        return {};
      },
    },
    roastDate: {
      required: false,
    },
  },
  data() {
    return {
      dialog: false,
      valid: true,
      editableBag: {},
      selectedVarietal: null,
      selectedFlavorNote: null,
      // varietalOptions: ['Bourbon', 'Caturra', 'Colombia', 'Heirloom', 'Gesha', 'Pacamara', 'Typica'],
      roastTicks: ['Light', '', 'Medium', '', 'Dark'],
    };
  },
  watch: {
    bag: {
      handler() {
        this.resetBag();
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    editable: {
      set() {
        this.$delete(this.editableBag, 'coffeeBagId');
      },
      get() {
        return !this.editableBag.coffeeBagId;
      },
    },
    roastLevel: {
      set(val) {
        this.editableBag.roastLevel = ['Light', 'Light-Medium', 'Medium', 'Medium-Dark', 'Dark'][val];
      },
      get() {
        return ['Light', 'Light-Medium', 'Medium', 'Medium-Dark', 'Dark'].indexOf(this.editableBag.roastLevel);
      },
    },
    roastColor() {
      const map = {
        Light: 'brown lighten-1',
        'Light-Medium': 'brown',
        Medium: 'brown darken-1',
        'Medium-Dark': 'brown darken-2',
        Dark: 'brown darken-4',
      };

      return map[this.editableBag.roastLevel];
    },
    bagIsDirty() {
      // TODO
      return true;
    },
    date() {
      if (!this.roastDate) return null;

      const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };

      return (new Date(this.roastDate)).toLocaleDateString('en-US', options);
    },
    // compute bag data to display
    bagInfo() {
      const props = [
        { label: 'Process', value: this.editableBag.process },
        { label: 'Producer', value: get(this.editableBag, 'origin.producer') },
        { label: 'Country', value: get(this.editableBag, 'origin.country') },
        { label: 'Region', value: get(this.editableBag, 'origin.region') },
        { label: 'Farm', value: get(this.editableBag, 'origin.farm') },
        { label: 'Elevation', value: get(this.editableBag, 'origin.elevation') },
        { label: 'Varietals', value: this.editableBag.varietals },
        { label: 'Flavor Notes', value: this.editableBag.flavorNotes },
        { label: 'Roast Level', value: this.editableBag.roastLevel },
      ];

      props.forEach((prop) => {
        if (Array.isArray(prop.value)) prop.value = prop.value.join(', ');
      });

      return filter(props, prop => prop.value);
    },
  },
  methods: {
    addVarietal() {
      // combo box takes a moment to set selectedVarietal for custom input ;(
      // setTimeout(() => {
      if (!this.selectedVarietal) return;
      this.editableBag.varietals.push(this.selectedVarietal);
      this.selectedVarietal = null;
      // }, 50);
    },
    removeVarietal(varietal) {
      this.editableBag.varietals = this.editableBag.varietals.filter(v => v !== varietal);
    },
    addFlavorNote() {
      // combo box takes a moment to set selectedFlavorNote for custom input ;(
      // setTimeout(() => {
      if (!this.selectedFlavorNote) return;
      this.editableBag.flavorNotes.push(this.selectedFlavorNote);
      this.selectedFlavorNote = null;
      // }, 50);
    },
    removeFlavorNote(FlavorNote) {
      this.editableBag.flavorNotes = this.editableBag.flavorNotes.filter(v => v !== FlavorNote);
    },
    resetBag() {
      this.editableBag = { ...cloneDeep(bagTemplate), ...cloneDeep(this.bag) };
      if (!this.editableBag.roastLevel) this.editableBag.roastLevel = 'Medium';
    },
    close() {
      this.resetBag();
      this.$emit('update:value', false);
    },
    update() {
      // TODO validate that at least one value isn't empty
      this.$emit('update', this.editableBag);
      this.$emit('update:value', false);
    },
  },
};
</script>
