<template>
  <div>
    <div class="field">
      <label class="label">Account Text</label>
      <div class="control">
        <textarea
          v-model="accountText"
          class="textarea"
          placeholder="10 lines of textarea"
          rows="10"
          readonly
        />
      </div>
    </div>
    <div class="buttons">
      <router-link
        to="/"
        class="button is-primary"
      >
        Back
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return {
            accountText: ''
        }
    },
    created(){
        const self = this
        chrome.storage.sync.get('accounts', result =>{
                self.accountText = JSON.stringify(result.accounts)
            })
        
    }
}
</script>

<style>

</style>