<template>
  <!-- TODO add method icon -->
  <v-layout row justify-space-between>
    <v-flex>
      <h2 class="title py-2 primary--text">{{ date }}</h2>
      <i v-if="subtitle" class="body-1">{{ subtitle }}</i>
    </v-flex>
    <v-flex px-3 class="rating">
      <v-layout fill-height column justify-center align-end>
        <p class="subheading">{{ item.rating }}</p>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'BrewListItemHeader',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {
    date() {
      const options = { weekday: 'long', month: 'long', day: 'numeric' };

      return (new Date(this.item.createdAt)).toLocaleDateString('en-US', options);
    },
    subtitle() {
      const bag = this.item.coffeeBag;
      if (!bag) return '';

      let subtitle = '';
      if (bag.brand) subtitle += bag.brand;
      if (bag.brand && bag.label) subtitle += ': ';
      if (bag.label) subtitle += bag.label;

      return subtitle;
    },
  },
};
</script>

<style scoped>
  p {
    margin: 0;
  }
  .rating {
    flex-shrink: 0;
  }
</style>
