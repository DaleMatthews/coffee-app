<template>
  <v-layout column align-left>
    <view-header>Chronicles</view-header>

    <v-layout v-if="brewLogList.length !== 0" class="date-picker-container px-4">
      <custom-date-picker v-if="showFilters" v-model="startDate" label="Start Date"></custom-date-picker>
      <v-btn depressed color="primary" @click="search">search</v-btn>
    </v-layout>

    <v-layout v-if="loading.fetchingList" column justify-center align-center>
      <v-progress-circular :size="100" :width="8" color="primary" indeterminate></v-progress-circular>
    </v-layout>
    <v-expansion-panel v-else popout>
      <v-expansion-panel-content v-for="item in brewLogList" :key="item.createdAt">
        <BrewListItemHeader slot="header" :item="item"></BrewListItemHeader>
        <BrewListItem :item="item"></BrewListItem>
      </v-expansion-panel-content>
      <v-btn v-if="brewLogList.length === 0 && !oneBrewExists" dark color="primary" class="mt-5" to="/new">log your first brew!</v-btn>
      <v-btn v-else-if="brewLogList.length === 0" @click="resetSearch" dark color="primary" class="mt-5">reset search</v-btn>
    </v-expansion-panel>
    <div v-if="brewLogList.length > 0 && !loading.fetchingList" class="px-3">
      <v-btn class="grey--text text--darken-2" block outline @click="nextPage">next page</v-btn>
    </div>
  </v-layout>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import ViewHeader from '../components/ViewHeader.vue';
import BrewListItem from '../components/BrewListItem.vue';
import BrewListItemHeader from '../components/BrewListItemHeader.vue';
import CustomDatePicker from '../components/CustomDatePicker.vue';

export default {
  components: {
    ViewHeader,
    BrewListItem,
    BrewListItemHeader,
    CustomDatePicker,
  },
  data() {
    return {
      startDate: null,
      showFilters: false,
    };
  },
  computed: {
    ...mapGetters(['brewLogList', 'oneBrewExists']),
    ...mapState(['loading', 'listFilters']),
  },
  watch: {
    // stupid date picker is somehow appending to the wrong element so delay the v-if
    'brewLogList.length': {
      handler(val) {
        this.$nextTick(() => {
          this.showFilters = val !== 0;
        });
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions(['getBrewLogList']),
    ...mapMutations(['SET_LIST_FILTERS']),
    search() {
      // set startDate to very end of day so the search includes brews on that day
      if (this.startDate) {
        var date = new Date(this.startDate);
        date.setHours(23, 59, 59, 999);
        this.SET_LIST_FILTERS({ startDate: date.getTime() });
      } else {
        this.SET_LIST_FILTERS({ startDate: null });
      }
      this.getBrewLogList();
    },
    resetSearch() {
      this.startDate = null;
      this.SET_LIST_FILTERS({ startDate: null });
      this.getBrewLogList();
    },
    nextPage() {
      this.getBrewLogList(this.brewLogList[this.brewLogList.length - 1].createdAt);
    },
  },
};
</script>

<style lang="stylus" scoped>
.date-picker-container {
  flex: 0 1 auto;
}
</style>
