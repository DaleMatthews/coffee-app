<template>
  <v-dialog persistent v-model="value">
    <slot slot="activator"></slot>
    <v-card>
      <v-toolbar card dense dark color="warning">
        <v-icon>warning</v-icon>
        <v-toolbar-title>Warning</v-toolbar-title>
      </v-toolbar>
      <v-layout column align-center justify-center pa-3>
        <p class="subheading mt-4">{{ message }}</p>

        <v-layout>
          <v-btn @click="$emit(no), value=false" flat color="grey">{{ no }}</v-btn>
          <v-btn @click="$emit(yes), value=false" flat color="warning">{{ yes }}</v-btn>
        </v-layout>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ConfirmDialog',
  data() {
    return {
      value: false,
    };
  },
  props: {
    message: {
      type: String,
      default: 'Are you sure?',
    },
    yes: {
      type: String,
      default: 'yes',
    },
    no: {
      type: String,
      default: 'no',
    },
  },
};
</script>
