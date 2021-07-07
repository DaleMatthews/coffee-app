<template>
  <v-layout column>
    <view-header>New Entry</view-header>

    <v-layout column pa-3>
      <confirm-dialog v-if="itemHasData || noLastBrewLog" @reset="reset" yes="reset" no="cancel">
        <v-btn outline block color="error">reset</v-btn>
      </confirm-dialog>
      <v-btn v-else outline block color="primary" @click="prefill">use previous values</v-btn>
    </v-layout>

    <brew-form :template="item" :item-has-data.sync="itemHasData" submit-text="create" @submit="create"/>
  </v-layout>
</template>

<script>
import { cloneDeep } from 'lodash';
import { mapActions, mapGetters } from 'vuex';
import { brewTemplate } from '../utils';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import ViewHeader from '../components/ViewHeader.vue';
import BrewForm from '../components/BrewForm.vue';

export default {
  components: {
    ConfirmDialog,
    ViewHeader,
    BrewForm,
  },
  props: {
    template: {
      type: Object,
      default() { return {}; },
    },
  },
  data() {
    return {
      item: { ...cloneDeep(brewTemplate), ...cloneDeep(this.template), attachments: [] },
      itemHasData: false,
    };
  },
  computed: {
    ...mapGetters(['lastBrewLog']),
    noLastBrewLog() {
      return this.lastBrewLog === null;
    },
  },
  methods: {
    ...mapActions(['createBrew']),
    prefill() {
      if (this.noLastBrewLog) this.item = cloneDeep(brewTemplate);
      else this.item = { ...cloneDeep(brewTemplate), ...cloneDeep(this.lastBrewLog), attachments: [] };
    },
    async create(brew) {
      await this.createBrew(brew);
      this.$router.push('/list');
    },
    reset() {
      this.item = cloneDeep(brewTemplate);
    },
  },
};
</script>
