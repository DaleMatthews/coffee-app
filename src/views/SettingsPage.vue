<template>
  <v-layout column align-left>
    <view-header>Settings</view-header>
    <v-layout align-center justify-center>
      <v-btn block dark color="amber darken-4" class="ma-4" @click="logoutAndRoute">Log Out</v-btn>
    </v-layout>
  </v-layout>
</template>

<script>
import { mapActions } from 'vuex';
import ViewHeader from '../components/ViewHeader.vue';

export default {
  components: {
    ViewHeader,
  },
  methods: {
    ...mapActions(['logout']),
    async logoutAndRoute() {
      await this.logout();
      this.$router.push('/login');
    },
  },
};
</script>
