<template>
  <div>
    <h4 class="title is-4">
      アカウントを新規登録
    </h4>
    <div class="field">
      <label class="label">Display Name</label>
      <div class="control">
        <input
          v-model="displayName"
          type="text"
          class="input"
        >
      </div>
    </div>
    <div class="field">
      <label class="label">User Name</label>
      <div class="control">
        <input
          v-model="userName"
          type="text"
          class="input"
        >
      </div>
    </div>
    <div class="field">
      <label class="label">Password</label>
      <div class="control">
        <input
          v-model="password"
          type="password"
          class="input"
        >
      </div>
    </div>
    <div class="field">
      <label class="label">Group:</label>
      <div class="control">
        <div class="select">
          <select v-model="group">
            <option
              v-if="!groups"
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
    <div class="field is-grouped">
      <div class="control">
        <button
          class="button is-primary"
          @click="saveAccount"
        >
          Save
        </button>
      </div>
      <div class="control">
        <button
          class="button is-link is-light"
          @click="cancel"
        >
          Cancel
        </button>
      </div>
      <div
        v-if="id"
        class="control"
      >
        <button
          class="button is-danger"
          @click="deleteAccount"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
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
            newGroup: ''
        }
    },
    computed: {
      groups() {
        const uniqueGroupList = Array.from(new Set(this.$store.state.accounts.map((account) => account.group)))
        return uniqueGroupList
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
      this.group = this.account.group || 'general'
      this.orgType = this.account.orgType || 'production'
    },
    methods:{
        saveAccount(){
          this.$store.dispatch('upsertAccount', {
            id: this.id,
            displayName: this.displayName,
            userName: this.userName,
            password: this.password,
            group: this.newGroup ? this.newGroup : this.group,
            orgType: this.orgType
          })
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
          })
          .then(function() {
            self.$store.dispatch('deleteAccount', self.id)
            self.$router.push('/')
          })
          .catch(function(e) {
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

</style>