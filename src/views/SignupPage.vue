<template>
  <v-layout column justify-center pa-3>
    <div>
      <template v-if="!confirming">
        <h2 class="primary--text pb-3 display-2">Signup</h2>
        <v-text-field v-model="email" label="Email" @keyup.enter="signup" autofocus></v-text-field>
        <v-text-field v-model="username" label="Username" @keyup.enter="signup"></v-text-field>
        <v-text-field v-model="password" type="Password" label="Password" @keyup.enter="signup"></v-text-field>
        <v-text-field v-model="passwordCheck" type="Password" label="Confirm Password" @keyup.enter="signup"></v-text-field>
        <v-btn block depressed color="primary" @click="signup" :disabled="signupDisabled" :loading="loading">signup</v-btn>
      </template>
      <template v-else>
        <h2 class="primary--text pb-3 display-2">Verify</h2>
        <p class="subtitle">Please check your email for a confirmation code</p>
        <v-text-field v-model="confirmationCode" label="Confirmation Code" @keyup.enter="verify" autofocus></v-text-field>
        <v-btn block depressed color="primary" @click="verify" :disabled="!confirmationCode" :loading="loading">Verify</v-btn>
      </template>
    </div>
  </v-layout>
</template>

<script>
import Auth from '@aws-amplify/auth';
import { mapActions } from 'vuex';

export default {
  name: 'SignUp',
  props: ['redirect'], // provided by router
  data() {
    return {
      email: '',
      username: '',
      password: '',
      passwordCheck: '',
      confirmationCode: '',
      confirming: false,
      loading: false,
    };
  },
  computed: {
    signupDisabled() {
      return !this.email || !this.username || !this.password || this.passwordCheck !== this.password || this.loading;
    },
  },
  methods: {
    ...mapActions(['login']),
    async signup() {
      if (this.signupDisabled) return;

      try {
        this.loading = true;
        await Auth.signUp({
          username: this.username,
          password: this.password,
          attributes: {
            email: this.email,
          },
        });
        this.loading = false;
        this.confirming = true;
      } catch (e) {
        // TODO handle UsernameExistsException (in case the user signed up but didn't confirm) and use Auth.resendSignUp
        this.loading = false;
        alert(e.message);
      }
    },
    async verify() {
      if (!this.confirmationCode) return;

      try {
        await Auth.confirmSignUp(this.username, this.confirmationCode);
        await Auth.signIn(this.username, this.password);
        // Auth is stupid so I need to refresh token to get user attributes
        const user = await Auth.currentAuthenticatedUser();
        await this.login(user);
        this.loading = false;
        this.confirming = false;
        this.$router.push(this.redirect || '/');
      } catch (e) {
        alert(e.message);
        this.loading = false;
      }
    },
  },
  // TODO reroute user if they're already logged in
};
</script>

