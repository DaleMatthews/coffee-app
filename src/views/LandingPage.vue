<template>
  <v-layout column justify-space-around align-left pa-3>
    <div>
      <h1 class="display-2 primary--text">Coffee</h1>
      <h1 class="display-2 primary--text">Chronicles</h1>
      <v-sheet class="stripe" tile dark color="primary" height="40">
        <v-layout fill-height column justify-center>
          <h2 class="pl-3 title">Your daily brewing log</h2>
        </v-layout>
      </v-sheet>
    </div>
    <div class="text-xs-center">
      <v-btn depressed round large outline color="secondary" to="/login">Login</v-btn>
      <v-btn depressed round large color="secondary" to="/signup">Signup</v-btn>
    </div>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['userIsAuthenticated']),
  },
};
</script>

<style lang="stylus" scoped>
.stripe
  margin-left: -16px
  margin-right: -16px
</style>

