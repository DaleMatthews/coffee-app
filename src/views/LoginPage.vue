<template>
  <v-layout column justify-center pa-3>
    <div>
      <h2 class="primary--text pb-3 display-2">Login</h2>
      <v-text-field v-model="email" label="Username or Email" @keyup.enter="localLogin" autofocus></v-text-field>
      <v-text-field v-model="password" type="Password" label="Password" @keyup.enter="localLogin"></v-text-field>
      <router-link to="/signup">Don't have an account? Signup!</router-link>
      <v-btn block depressed color="primary" class="mt-3" @click="localLogin" :disabled="loginDisabled" :loading="loading">Login</v-btn>
    </div>
  </v-layout>
</template>

<script>
import Auth from '@aws-amplify/auth';
import { mapActions } from 'vuex';

export default {
  props: ['redirect'], // provided by router
  data() {
    return {
      email: '',
      password: '',
      loading: false,
    };
  },
  computed: {
    loginDisabled() {
      return !this.email || !this.password || this.loading;
    },
  },
  methods: {
    ...mapActions(['login']),
    async localLogin() {
      if (this.loginDisabled) return;

      try {
        this.loading = true;
        await Auth.signIn(this.email, this.password);
        // Auth is stupid so I need to refresh token to get user attributes
        const user = await Auth.currentAuthenticatedUser();
        await this.login(user);

        this.loading = false;
        this.$router.push(this.redirect || '/list');
      } catch (e) {
        this.loading = false;
        alert(e.message);
      }
    },
  },
};
</script>
