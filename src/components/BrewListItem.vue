<template>
  <div class="px-3">
    <v-layout column align-center pb-3 pt-1>
      <coffee-bag-display v-if="item.coffeeBag" :bag="item.coffeeBag" :roast-date="item.roastDate"/>
    </v-layout>
    <v-layout px-3 wrap>
      <v-flex xs6 v-for="(prop, index) in brewInfo" :key="index">
        <label class="pt-1 subheading secondary--text">{{ prop.label }}</label>
        <p class="body-1">{{ prop.value }}</p>
      </v-flex>
      <v-flex xs12 v-if="item.notes">
        <label class="pt-2 subheading secondary--text">Notes</label>
        <p>{{ item.notes }}</p>
      </v-flex>
    </v-layout>
    <!-- TODO Flavor Graph -->
    <attachments-grid v-if="item.attachments && item.attachments.length" :attachments="item.attachments"/>
    <v-layout row align-center>
      <v-btn outline color="grey darken-4" class="mb-3 brew-item-action" :to="{ name: 'new', params: { template: item } }">
        use as template
      </v-btn>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn outline color="grey darken-4" class="mb-3 brew-item-action" v-on="on">Actions</v-btn>
        </template>
        <v-list>
          <v-list-tile @click="editingBrew=true">
            <v-list-tile-title>Edit</v-list-tile-title>
          </v-list-tile>
          <confirm-dialog @yes="deleteBrew(item)" yes="yes" no="cancel" message="Are you sure you want to delete this brew entry?">
            <v-list-tile>
              <v-list-tile-title>Delete</v-list-tile-title>
            </v-list-tile>
          </confirm-dialog>
        </v-list>
      </v-menu>
    </v-layout>

    <v-dialog v-if="editingBrew" v-model="editingBrew" full-width max-width fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar card dark color="primary" class="mb-3">
          <confirm-dialog @yes="editingBrew=false" yes="yes" no="cancel" message="Are you sure? Any new input will be lost.">
            <v-btn icon dark>
              <v-icon>close</v-icon>
            </v-btn>
          </confirm-dialog>

          <v-toolbar-title>Edit Entry</v-toolbar-title>
        </v-toolbar>

        <brew-form :template="item" submit-text="save" @submit="save"/>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { get, filter } from 'lodash';
import { mapActions } from 'vuex';
import CoffeeBagDisplay from './CoffeeBagDisplay.vue';
import AttachmentsGrid from './AttachmentsGrid.vue';
import BrewForm from './BrewForm.vue';
import ConfirmDialog from './ConfirmDialog.vue';

export default {
  name: 'BrewListItem',
  components: {
    CoffeeBagDisplay,
    AttachmentsGrid,
    BrewForm,
    ConfirmDialog,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      editingBrew: false,
    };
  },
  computed: {
    brewInfo() {
      const props = [
        { label: 'Method', value: this.item.method },
        { label: 'Grinder', value: this.item.grinder },
        { label: 'Grind Setting', value: this.item.grindSetting },
        { label: 'Temperature', value: this.item.temperature },
        { label: 'Bloom Time', value: get(this.item, 'time.bloom') },
        { label: 'Drain Time', value: get(this.item, 'time.drain') },
        { label: 'Total Time', value: get(this.item, 'time.total') },
      ];

      return filter(props, prop => prop.value);
    },
  },
  methods: {
    ...mapActions(['updateBrew', 'deleteBrew']),
    async save(brew) {
      await this.updateBrew(brew);
      this.editingBrew = false;
    },
  },
};
</script>

<style lang="stylus" scoped>
.brew-item-action
  flex: 1
</style>
