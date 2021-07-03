<template>
  <ValidationObserver v-slot="{ invalid }">
    <h4 class="title is-4">
      アカウントを新規登録
    </h4>
    <ValidationProvider
      v-slot="{ errors }"
      rules="required"
      name="Display Name"
    >
      <div class="field">
        <label class="label">Display Name</label>
        <div class="control">
          <input
            v-model="displayName"
            type="text"
            class="input"
          >
        </div>
        <div class="text-danger">
          {{ errors[0] }}
        </div>
      </div>
    </ValidationProvider>
    <ValidationProvider
      v-slot="{ errors }"
      rules="required"
      name="User Name"
    >
      <div class="field">
        <label class="label">User Name</label>
        <div class="control">
          <input
            v-model="userName"
            type="text"
            class="input"
          >
        </div>
        <div class="text-danger">
          {{ errors[0] }}
        </div>
      </div>
    </ValidationProvider>
    <ValidationProvider
      v-slot="{ errors }"
      vid="password"
      rules="required"
      name="Password"
    >
      <label class="label">Password</label>
      <div class="field has-addons">
        <div class="control">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            class="input is-fullwidth"
          >
        </div>
        <div class="control">
          <a
            class="button"
            @click="showPassword = !showPassword"
          >
            Show
          </a>
        </div>
      </div>
      <div class="text-danger">
        {{ errors[0] }}
      </div>
    </ValidationProvider>
    <ValidationProvider
      v-slot="{ errors }"
      rules="required|passwordConfirmed:password"
      name="ConfirmedPassword"
    >
      <label class="label">ConfirmPassword</label>
      <div class="field">
        <div class="control">
          <input
            v-model="confirmPassword"
            type="password"
            class="input is-fullwidth"
          >
        </div>
        <div class="text-danger">
          {{ errors[0] }}
        </div>
      </div>
    </ValidationProvider>
    <div class="field">
      <label class="label">Group:</label>
      <div class="control">
        <div class="select">
          <select v-model="group">
            <option
              v-if="!groups.find(g=>g.group==='general')"
              value="general"
            >
              general
            </option>
            <option
              v-for="(g) in groups"
              :key="g"
              :value="g"
            >
              {{ g }}
            </option>
            <option value="">
              Other
            </option>
          </select>
        </div>
      </div>
    </div>
    <div class="field">
      <div
        v-if="!group"
        class="control"
      >
        <input
          v-model="newGroup"
          type="text"
          class="input"
        >
      </div>
    </div>
    <div class="field">
      <label class="label">Org Type:</label>
      <div class="control">
        <div class="select">
          <select v-model="orgType">
            <option value="sandbox">
              Sandbox
            </option>
            <option value="production">
              Production / Dev
            </option>
            <option>Other</option>
          </select>
        </div>
      </div>
    </div>
    <div class="buttons account-form-buttons">
      <button
        class="button is-primary"
        :disabled="invalid"
        @click="saveAccount"
      >
        Save
      </button>
      <button
        v-if="!id && isExistSignUpInfo"
        class="button is-muted"
        :disabled="invalid"
        @click="createAccount"
      >
        Create
      </button>
      <button
        class="button is-link is-light"
        @click="cancel"
      >
        Cancel
      </button>
      <button
        v-if="id"
        class="button delete-button is-danger"
        @click="deleteAccount"
      >
        Delete
      </button>
    </div>
  </ValidationObserver>
</template>

<script>
import querystring from 'querystring'
import { ValidationProvider, extend, ValidationObserver } from 'vee-validate';
import { required, confirmed } from 'vee-validate/dist/rules';

extend('required', required);
extend('passwordConfirmed', confirmed);


export default {
    components: {
      ValidationProvider,
      ValidationObserver
    },
    props: {
      account: {
        type: Object,
        default(){return {}}
      }
    },
    data(){
        return {
            id: '',
            displayName: '',
            userName: '',
            password: '',
            group: 'general',
            orgType: 'production',
            newGroup: '',
            showPassword: false
        }
    },
    computed: {
      groups() {
        const uniqueGroupList = Array.from(new Set(this.$store.state.accounts.map((account) => account.group)))
        return uniqueGroupList
      },
      isExistSignUpInfo() {
        const {signUpInfo} = this.$store.state
        if(signUpInfo){
          return true
        }
        return false
      }
    },
    created(){
      console.log(this.account);
      if(!this.account){
        return
      }
      this.id = this.account.id || ''
      this.displayName = this.account.displayName || ''
      this.userName = this.account.userName || ''
      this.password = this.account.password || ''
      this.confirmPassword = this.account.password || ''
      this.group = this.account.group || 'general'
      this.orgType = this.account.orgType || 'production'
    },
    methods:{
        saveAccount(){
          const methodName = this.id ? 'updateAccount' : 'insertAccount'
          this.$store.dispatch(methodName, {
            id: this.id,
            displayName: this.displayName,
            userName: this.userName,
            password: this.password,
            group: this.newGroup ? this.newGroup : this.group,
            orgType: this.orgType
          })
          this.$router.push('/')
        },
        createAccount(){
          const methodName = 'insertAccount'
          this.$store.dispatch(methodName, {
            displayName: this.displayName,
            userName: this.userName,
            password: this.password,
            group: this.newGroup ? this.newGroup : this.group,
            orgType: this.orgType
          })

          // サインアップ画面を開く
          const signUpUrl = 'https://developer.salesforce.com/signup'
          const {signUpInfo} = this.$store.state || {}
          signUpInfo.userName = this.userName
          window.open(`${signUpUrl}?${querystring.stringify(signUpInfo)}`)

          // ホーム画面に戻る
          this.$router.push('/')
        },
        deleteAccount(){
          const self = this
          this.$dialog.confirm({
            title: '確認',
            body: '本当に削除してもよろしいですか？'
          },{
            okText: 'はい',
            cancelText: 'キャンセル',
          }).then(() => {
            self.$store.dispatch('deleteAccount', self.id)
            self.$router.push('/')
          }).catch((e) => {
            console.log(e)
            console.log('実行はキャンセルされました');
          });

        },
        cancel(){
          this.$router.push('/')
        }
    }
}


</script>

<style>
.button.delete-button{
    margin-left: auto;
}
</style>