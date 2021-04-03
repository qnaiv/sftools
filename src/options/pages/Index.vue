<template>
  <div>
    <account-import-form />
    <account-export-form />
    <sign-up-info-form />
  </div>
</template>

<script>
import AccountExportForm from '../components/AccountExportForm.vue'
import AccountImportForm from '../components/AccountImportForm.vue'
import SignUpInfoForm from '../components/SignUpInfoForm.vue'

export default{
  components: { SignUpInfoForm, AccountImportForm, AccountExportForm }, 

  created() {
    this.$store.dispatch('loadAccountsFromStorage')
    this.$store.dispatch('loadSignUpInfoFromStorage')
  },
}
</script>

<style>
</style>