<template>
  <v-app>
    <v-content>
      <v-container fluid pa-0 fill-height>
        <v-layout v-if="userIsAuthenticated === null" column justify-center align-center>
          <v-progress-circular :size="120" :width="8" color="primary" indeterminate></v-progress-circular>
        </v-layout>
        <router-view v-else/>
      </v-container>
    </v-content>
    <v-bottom-nav
      v-if="userIsAuthenticated && $route.path !== '/login' && $route.path !== '/signup'"
      app mandatory dark color="primary" :value="true" :active="pane"
    >
      <v-btn flat value="list" to="/list">
        <v-icon>list</v-icon>
      </v-btn>

      <v-btn flat value="new" to="/new">
        <v-icon>free_breakfast</v-icon>
      </v-btn>

      <v-btn flat value="settings" to="/settings">
        <v-icon>settings</v-icon>
      </v-btn>
    </v-bottom-nav>
  </v-app>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['userIsAuthenticated']),
    isHome() {
      return this.$route.name === 'home';
    },
    pane() {
      return this.$route.name;
    },
  },
  methods: {
    ...mapActions(['logout']),
    async logout() {
      await this.logout();
      this.$router.push('/login');
    },
  },
};
</script>
