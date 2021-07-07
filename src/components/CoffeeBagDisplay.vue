<template>
  <div @click.stop="bagDialog=true" class="align-self-center">
    <v-sheet v-if="title || details" dark color="green darken-4" class="bag">
      <div class="bag-title">
        <h2 class="text-uppercase">{{ title }}</h2>
      </div>
      <v-sheet color="white" class="bag-details">
        <p>{{ details }}</p>
      </v-sheet>
    </v-sheet>

    <v-btn v-else outline color="grey darken-1" class="add-bag">
      <div>add coffee bag details</div>
    </v-btn>

    <coffee-bag-dialog :value.sync="bagDialog" :bag="bag" :roast-date="roastDate" @update="$emit('update', $event)"/>
  </div>
</template>

<script>
import CoffeeBagDialog from './CoffeeBagDialog.vue';

export default {
  name: 'CoffeeBagDisplay',
  components: {
    CoffeeBagDialog,
  },
  props: {
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
      bagDialog: false,
    };
  },
  computed: {
    title() {
      if (!this.bag) return '';

      let title = '';
      if (this.bag.brand) title += this.bag.brand;
      if (this.bag.brand && this.bag.label) title += ': ';
      if (this.bag.label) title += this.bag.label;

      return title;
    },
    details() {
      return [
        this.bag.process,
        this.bag.origin && this.bag.origin.country,
        this.bag.origin && this.bag.origin.elevation,
        this.bag.roastLevel,
        this.bag.flavorNotes && this.bag.flavorNotes.join(', '),
      ].filter(prop => prop).join(' • ');
    },
  },
};
</script>

<style lang="stylus" scoped>
@import '~vuetify/src/stylus/settings/_colors';

.add-bag {
  width: 150px;
  height: 150px;
  border-radius: 18px;
  border-style: dashed;
  border-width: 2px;
  div {
    white-space: normal;
  }
}
.bag {
  display: flex;
  flex-flow: column nowrap;
  width: 150px;
  height: 150px;
  border-radius: 18px;
  flex-direction: column;

  .bag-title {
    padding: 10px;
    height: 75px;
    font-size: 16px;
    font-weight: 400;
    line-height: 15px;
    h2 {
      overflow: hidden;
      font-size: 15px;
      line-height: 15px;
      max-height: 60px;
    }
  }

  .bag-details {
    margin-top: 10px;
    height: 55px;
    max-height: 55px;
    padding: 5px;
    color: $grey.darken-3;

    p {
      overflow: hidden;
      font-size: 10px;
      line-height: 10px;
      max-height: 50px;
    }
  }
}
</style>
