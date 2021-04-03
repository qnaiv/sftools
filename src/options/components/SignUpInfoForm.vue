<template>
  <div class="card block">
    <div class="card-content">
      <p class="title">
        サインアップ時に自動入力する情報
      </p>
      <div class="field">
        <label class="label">姓</label>
        <div class="control">
          <input
            v-model="signUpInfo.lastName"
            type="text"
            class="input"
          >
        </div>
      </div>
      <div class="field">
        <label class="label">名</label>
        <div class="control">
          <input
            v-model="signUpInfo.firstName"
            type="text"
            class="input"
          >
        </div>
      </div>
      <div class="field">
        <label class="label">Email</label>
        <div class="control">
          <input
            v-model="signUpInfo.email"
            type="text"
            class="input"
          >
        </div>
      </div>
      <div class="field">
        <label class="label">役割</label>
        <div class="control">
          <div class="select">
            <select v-model="signUpInfo.role">
              <option
                value="Developer"
              >
                開発者
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="field">
        <label class="label">会社</label>
        <div class="control">
          <input
            v-model="signUpInfo.company"
            type="text"
            class="input"
          >
        </div>
      </div>
      <div class="field">
        <label class="label">国</label>
        <div class="control">
          <div class="select">
            <select v-model="signUpInfo.country">
              <option
                value="JP"
              >
                日本
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="field">
        <label class="label">郵便番号</label>
        <div class="control">
          <input
            v-model="signUpInfo.postalCode"
            type="text"
            class="input"
          >
        </div>
      </div>
    </div>
    <footer class="card-footer">
      <button
        class="card-footer-item"
        @click="saveSignUpInfo"
      >
        Save
      </button>
    </footer>
  </div>
</template>

<script>
export default {
  computed:{
    signUpInfo() {
      return this.$store.state.signUpInfo || {
        lastName: '',
        firstName: '',
        email: '',
        role: 'Developer',
        company: '',
        country: 'JP',
        postalCode: ''
      }
    }
  },
  methods: {
    saveSignUpInfo(){
      this.$dialog.alert('保存完了').then(() => {
        console.log('Closed')
        this.$store.dispatch('updateSignUpInfo', this.signUpInfo)
      })
    }
  }
}
</script>

<style>

</style>