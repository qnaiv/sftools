<template>
  <div>
    <div class="buttons is-right">
      <router-link
        :to="{name: 'editAccount'}"
        class="button is-primary is-small"
      >
        <span class="icon">
          <i class="mdi mdi-plus-thick" />
        </span>
        <span>
          New
        </span>
      </router-link>
      <router-link
        :to="{name: 'import'}"
        class="button is-outlined is-small"
      >
        <span class="icon">
          <i class="mdi mdi-import" />
        </span>
        <span>
          Import 
        </span>
      </router-link>
      <router-link
        :to="{name: 'export'}"
        class="button is-outlined is-small"
      >
        <span class="icon">
          <i class="mdi mdi-export" />
        </span>
        <span>
          Export 
        </span>
      </router-link>
    </div>
    <div
      v-for="(group, index) in groupedAccounts"
      :key="index"
      class="mb-4"
    >
      <div class="group-header is-flex">
        <div>{{ group[0].group }} [{{ group.length }}]</div>
        <div class="buttons controls">
          <span
            class="button is-light is-small"
            @click="editGroup(group)"
          >
            <i class="mdi mdi-pencil" />
          </span>

          <span
            class="button is-danger is-light is-small"
            @click="deleteGroup(group)"
          >
            <i class="mdi mdi-delete" />
          </span>
        </div>
      </div>
      <div
        v-for="(account) in group"
        :key="account.id"
        class="box accounts"
      >
        <div class="controls">
          <button
            class="button is-primary"
            @click="openOrg(account)"
          >
            <span class="icon">
              <i class="mdi mdi-folder-open" />
            </span>
          </button>
          <!-- <button
            class="button"
            @click="openIncognito(account)"
          >
            <span class="icon">
              <i class="mdi mdi-incognito" />
            </span>
          </button> -->
          <button
            class="button is-light"
            @click="openDevConsole(account)"
          >
            <span class="icon">
              <i class="mdi mdi-console" />
            </span>
          </button>
        </div>
        <div class="name pl-3">
          <p>{{ account.displayName }}</p>
          <p class="is-size-7">
            {{ account.userName }}
          </p>
        </div>
        <div class="edit">
          <router-link :to="{name: 'editAccount', params: {account}}">
            <span class="icon">
              <i class="mdi mdi-cog-outline" />
            </span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import groupBy from 'lodash-es/groupBy'
import cloneDeep from 'clone-deep'

export default {
    computed:{
        accounts() {
            return this.$store.state.accounts
        },
        groupedAccounts() {
          const groupedAccounts = groupBy(this.$store.state.accounts, account=>account.group)
          return groupedAccounts
        }
    },
    created(){
        this.$store.dispatch('getAccounts')
    },
    methods: {
      openOrg(account) {
        chrome.tabs.create({
          active: true,
          url: account.loginUrlWithParam
        })
      },
      openDevConsole(account) {
        chrome.tabs.create({
          active: true,
          url: account.developerConsoleUrl
        })
      },
      // openIncognito(account) {
     
      //   const script = `document.getElementById('username_container').getElementsByClassName('username')[0].value = account.userName`
      //   chrome.windows.create({
      //     incognito: true,
      //     url: account.loginUrl
      //   },(window)=>{
      //     console.log(window);
      //       chrome.tabs.executeScript(null, {code: script})
      //   })
        
      // },
      editGroup(group){
        this.$dialog.prompt({
          title: "",
        }, {
          promptHelp: '新しいグループ名を入力してください'
        }).then(dialog => {
          if(!dialog.data) return
          
          group.forEach(account=>{
            const updatedAccount = cloneDeep(account)
            updatedAccount.group = dialog.data
            this.$store.dispatch('updateAccount', updatedAccount)
          })
        })
        .catch((e) => {
          console.log('実行はキャンセルされました');
          console.log(e);

        });
      },
      deleteGroup(group){
          const self = this
          this.$dialog.confirm({
            title: '確認',
            body: 'グループに紐づくアカウントを全て削除してもよろしいですか？'
          },{
            okText: 'はい',
            cancelText: 'キャンセル',
          }).then(() => {
            group.forEach(account=>{
              self.$store.dispatch('deleteAccount', account.id)
            })
          }).catch((e) => {
            console.log('実行はキャンセルされました');
            console.log(e);
          });
      }
    }
}
</script>

<style scoped>
  .accounts{
    display: flex;
    align-items: center;
    margin: 5px;
    padding: 2px 10px;
  }
  .accounts .name{
    padding: 0 10px;
  }
  .accounts .edit{
    margin-left: auto;
  }
  .group-header .controls{
    margin-left: auto;
  }
  .group-header .button{
    margin: 0px 5px 10px 5px !important;
    padding: 0.5rem !important;
  }
  .accounts .controls .button{
    margin: 0px !important;
    padding: 1rem !important;
      }
</style>