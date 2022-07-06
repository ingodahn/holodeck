<template>
  <div>
    <v-form>
      <v-row>
        <v-col v-if="mode == 'allUsers'">
          <v-btn color="success" class="mx-1 my-1" @click="mode = 'newUser'"
            >New User</v-btn
          >
          <v-list>
            <v-list-item-group>
              <v-list-item
                v-for="(user, i) in allUsers"
                :key="i"
                @click="showUserDetails(user)"
              >
                <v-list-item-content>
                  <v-list-item-title v-text="user.name"></v-list-item-title>
                  <v-list-item-subtitle
                    v-text="user.username"
                  ></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-col>
        <v-col v-else>
          <v-text-field v-model="user.name" label="Name"></v-text-field>
          <v-text-field v-model="user.username" label="Username"></v-text-field>
          <v-text-field v-model="user.email" label="Email"></v-text-field>
          <v-text-field v-model="user.password" label="Password"></v-text-field>
          <v-text-field
            v-model="user.passwordConfirm"
            label="Confirm Password"
          ></v-text-field>
          <v-btn color="primary" @click="saveUser">Speichern</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import { Meteor } from "meteor/meteor";
export default {
  data() {
    return {
      user: {
        name: "",
        email: "",
        password: "",
        passwordConfirm: "",
        role: "",
        isAdmin: false,
        isActive: false,
      },
      mode: "allUsers",
    };
  },
  methods: {
    showUserDetails(user) {
      this.user = user;
      this.mode = "userDetails";
    },
    saveUser() {
      if (this.user.password != this.user.passwordConfirm) {
        alert("Passwords do not match");
        return;
      }
      if (this.user._id) {
        Meteor.call("userUpdate", this.user);
      } else {
        Meteor.call("userInsert", this.user);
      }
      this.mode = "allUsers";
    },
    newUser () {
      this.user = {
        name: "",
        email: "",
        password: "",
        passwordConfirm: "",
      };
      this.mode = "userDetails";
    },
  },
  meteor: {
    allUsers() {
      return Meteor.users.find({}).fetch();
    },
  },
};
</script>