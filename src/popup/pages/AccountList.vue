<template>
  <div>
    <div 
      v-shortkey="{up: ['arrowup'], down: ['arrowdown'], left: ['arrowleft'], right: ['arrowright'], altenter: ['alt','enter']}"
      class="header columns is-mobile is-gapless"
      @shortkey="keyboardAction"
    >
      <div class="field column">
        <div class="control">
          <input
            ref="accountFilter"
            v-model="accountFilterText"
            type="text"
            class="input"
            placeholder="filter by group/account/display name"
          >
        </div>
      </div>
      <div class="buttons has-text-right column is-half">
        <router-link
          :to="{name: 'editAccount'}"
          class="button is-primary"
          tabindex="-1"
        >
          <span class="icon">
            <i class="mdi mdi-plus-thick" />
          </span>
          <span>
            New
          </span>
        </router-link>
      </div>
    </div>
    <div id="contents">
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
          :id="rowId(account)"
          :key="account.id"
          class="box accounts"
          :class="{'selectedRow': isSelectedRow(account)}"
        >
          <div class="controls">
            <button
              class="button is-primary"
              :class="{'selectedCol': isSelectedRow(account) && selectedCol === 0}"
              tabindex="-1"
              @click="openHome(account)"
            >
              <span class="icon">
                <i class="mdi mdi-folder-open" />
              </span>
            </button>
            <button
              class="button"
              :class="{'selectedCol': isSelectedRow(account) && selectedCol === 1}"
              tabindex="-1"
              @click="openSetup(account)"
            >
              <span class="icon">
                <i class="mdi mdi-cog-outline" />
              </span>
            </button>
            <button
              class="button is-light"
              :class="{'selectedCol': isSelectedRow(account) && selectedCol === 2}"
              tabindex="-1"
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
            <router-link
              :to="{name: 'editAccount', params: {account}}"
              tabindex="-1"
            >
              <span class="icon">
                <i class="mdi mdi-cog-outline" />
              </span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import groupBy from 'lodash-es/groupBy'
import cloneDeep from 'clone-deep'

export default {
    data() {
      return {
        innerAccountFilterText: '',
        selectedRow: -1,
        selectedCol: 0
      }
    },
    computed:{
        accountFilterText: {
          get(){
            return this.innerAccountFilterText
          },
          set(value){
            this.innerAccountFilterText = value
            this.resetRowSelection()
          }
        },
        accounts() {
            return this.$store.state.accounts
        },
        filteredAccounts() {
          return this.accounts.filter(account=>{
            // フィルタ条件：検索ワードと前方一致するグループ、表示名、ユーザ名
            if(!this.innerAccountFilterText) return true

            const matchesDisplayName = account.displayName.toLowerCase().indexOf(this.innerAccountFilterText.toLowerCase()) !== -1
            const matchesUserName = account.userName.toLowerCase().indexOf(this.innerAccountFilterText.toLowerCase()) !== -1
            const matchesGroup = account.group.toLowerCase().indexOf(this.innerAccountFilterText.toLowerCase()) !== -1
            return matchesDisplayName || matchesUserName || matchesGroup
          }).sort((a,b)=>{
            // ソート条件：グループの昇順、表示名の昇順、ユーザ名の昇順
            if(a.group < b.group) return -1
            if(a.group > b.group) return 1
            if(a.displayName < b.displayName) return -1
            if(a.displayName > b.displayName) return 1
            if(a.userName < b.userName) return -1
            if(a.userName > b.userName) return 1
            return 0
          })
        },
        groupedAccounts() {
          const groupedAccounts = groupBy(this.filteredAccounts, account=>account.group)
          return groupedAccounts
        },
        rowId(){
          return account => account.id
        },
        selectedRowId(){
          if(this.selectedRow < 0 || this.selectedRow >= this.filteredAccounts.length) return null
          return this.filteredAccounts[this.selectedRow].id
        },
        isSelectedRow(){
          return (account) => {
            return this.selectedRowId === this.rowId(account)
          }
        }
    },
    created(){
        this.$store.dispatch('loadAccountsFromStorage')
        this.$store.dispatch('loadSignUpInfoFromStorage')

    },
    mounted () {
      this.$refs.accountFilter.focus();
    },
    methods: {
      openHome(account) {
        chrome.tabs.create({
          active: true,
          url: account.homeUrl
        })
      },
      openDevConsole(account) {
        chrome.tabs.create({
          active: true,
          url: account.developerConsoleUrl
        })
      },
      openSetup(account) {
        chrome.tabs.create({
          active: true,
          url: account.setupUrl
        })
      },
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
      },
      keyboardAction(event){
        switch (event.srcKey) {
          case 'up':
            this.cursorUp()
            break
          case 'down':
            this.cursorDown()
            break
          case 'left':
            this.cursorLeft()
            break
          case 'right':
            this.cursorRight()
            break
          case 'altenter': 
            this.enterAction()
            break
          default:
            break
        }
      },
      cursorUp(){
        if(this.selectedRow < 1) {
          this.selectedRow = 0
          return
        }
        this.selectedRow -= 1
        this.$scrollTo(`#${this.selectedRowId}`, 0, {offset: -200, lazy: false})
      },
      cursorDown(){
        if(this.selectedRow >= this.filteredAccounts.length - 1) {
          this.selectedRow = this.filteredAccounts.length - 1
          return
        }
        this.selectedRow += 1
          this.$scrollTo(`#${this.selectedRowId}`, 0, {offset: -200, lazy: false})
      },
      cursorLeft(){
        if(this.selectedCol < 1){
          this.selectedCol = 0
          return
        }
        this.selectedCol -= 1
      },
      cursorRight(){
        // アカウントコントロールパネルの右端にCursorがあるとき
        if(this.selectedCol > 1){
          this.selectedCol = 2
          return
        }
        this.selectedCol += 1
      },
      enterAction(){
        if(this.selectedRow < 0) return;
        
        const targetAccount = this.filteredAccounts[this.selectedRow]
        switch(this.selectedCol){
          case 0:
            this.openHome(targetAccount)
            break;
          case 1:
            this.openSetup(targetAccount)
            break;
          case 2:
            this.openDevConsole(targetAccount)
            break;
          default: 
            break;
        }
      },
      resetRowSelection(){
        console.log("reset");
        this.selectedRow = -1
        this.selectedCol = 0
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
  .header{
    position: sticky;
    top: 0.75rem;
    background-color: #ececec;
    border-radius: 4px;
    z-index: 9999;
    padding: 5px;
  }
  .header .button{
    margin: 0px 0px 0px 5px !important;
    padding: 1rem !important;
  }
  .selectedRow {
    border: 2px solid #7ba8da;
  }
  .selectedCol {
    border: 2px solid #a0a0a0 !important
  }
</style>