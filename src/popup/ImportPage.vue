<template>
  <div>
    <div class="field">
      <label class="label">Account Text</label>
      <div class="control">
        <textarea
          v-model="importText"
          class="textarea"
          placeholder="10 lines of textarea"
          rows="10"
        />
      </div>
    </div>
    <div class="buttons account-form-buttons">
      <button
        class="button is-primary"
        @click="importAccounts"
      >
        Save
      </button>
      <router-link
        to="/"
        class="button is-link is-light"
      >
        Cancel
      </router-link>
    </div>
  </div>
</template>

<script>
import Account from '../entity/account'

export default {
  data() {
    return {
      importText: '',
    }
  },
  methods: {
    importAccounts() {
      if (!this.importText) return


      const accounts = [...JSON.parse(this.importText)].map(account => new Account(account))
      console.log(accounts);
      accounts.forEach(account=>this.$store.dispatch('insertAccount', account))
      
      this.$router.push('/')
    },
  },
}
</script>

<style>
</style>