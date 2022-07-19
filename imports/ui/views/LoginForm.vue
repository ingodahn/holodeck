<template>
  <div class="container">
    <v-main>
      <v-row>
        <v-col>
          <form class="login-form" @submit.prevent="handleSubmit">
            <div>Sign in as an author to add or edit content</div>
            <div>
              <label for="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Username"
                required
                v-model="username"
              />
            </div>

            <div>
              <label for="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                required
                v-model="password"
              />
            </div>

            <div>
              <button type="submit">Log In</button>
            </div>
          </form>
        </v-col>
      </v-row>
    </v-main>
  </div>
</template>

<script>
import { Meteor } from "meteor/meteor";

export default {
  name: "LoginForm",
  data() {
    return {
      session: this.$root.$data.session,
      username: "",
      password: "",
    };
  },
  components: { },
  methods: {
    handleSubmit(event) {
      Meteor.loginWithPassword(this.username, this.password, (err) => {
        if (err) alert(err);
        this.session.set("mode", "book", "App-login");
      });
    },
  },
};
</script>