<template>
  <div>
    <div
      v-shortkey="{
        up: ['arrowup'],
        down: ['arrowdown'],
        left: ['arrowleft'],
        right: ['arrowright'],
        altenter: ['alt', 'enter'],
      }"
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
          :to="{ name: 'editAccount' }"
          class="button is-primary"
          tabindex="-1"
        >
          <span class="icon">
            <i class="mdi mdi-plus-thick" />
          </span>
          <span> New </span>
        </router-link>
      </div>
    </div>
    <div id="contents">
      <draggable
        v-model="groupedAccounts"
        @end="onAccountMoved()"
      >
        <AccountGroup
          v-for="(group, index) in groupedAccounts"
          :key="index"
          :group="group"
          :on-delete-group="refreshSearchResult"
          :on-rename-group="refreshSearchResult"
        >
          <draggable
            v-model="group.accounts"
            group="accounts"
            @end="onAccountMoved()"
          >
            <Account
              v-for="account in group.accounts"
              :key="account.id"
              :account="account"
              :is-selected="isSelectedRow(account)"
              :selected-col="selectedCol"
              :on-click-home="openHome"
              :on-click-setup="openSetup"
              :on-click-dev-console="openDevConsole"
            />
          </draggable>
        </AccountGroup>
      </draggable>
    </div>
  </div>
</template>

<script>
import groupBy from 'lodash-es/groupBy'
import draggable from 'vuedraggable'
import Account from '../components/Account.vue'
import AccountGroup from '../components/AccountGroup.vue'
import SfConnection from '../../entity/SfConnection'

export default {
  components: {
    draggable,
    Account,
    AccountGroup,
  },
  data() {
    return {
      innerAccountFilterText: '',
      selectedRow: -1,
      selectedCol: 0,
      groupedAccounts: [],
    }
  },
  computed: {
    accountFilterText: {
      get() {
        return this.innerAccountFilterText
      },
      set(value) {
        this.innerAccountFilterText = value
        this.refreshSearchResult()
        this._resetRowSelection()
      },
    },
    isSelectedRow() {
      return account => this._selectedRowId === account.id
    },
    _selectedRowId() {
      if (
        this.selectedRow < 0 ||
        this.selectedRow >= this._flatGroupedAccounts.length
      ) {
        return null
      }
      return this._flatGroupedAccounts[this.selectedRow].id
    },
    _flatGroupedAccounts() {
      return this.groupedAccounts.map(group => group.accounts).flat()
    },
  },
  async created() {
    // アカウント情報、サインイン自動入力情報を読み込む
    await this.$store.dispatch('loadAccountsFromStorage')
    await this.$store.dispatch('loadSignUpInfoFromStorage')
    this.refreshSearchResult()
  },
  mounted() {
    this.$refs.accountFilter.focus()
  },
  methods: {
    onAccountMoved() {
      // グループ間のアカウント移動をAccount.groupに反映
      this.groupedAccounts.forEach(group => {
        group.accounts.forEach(account => {
          account.group = group.groupName
        })
      })

      // ストレージ更新
      this.$store.dispatch('resetAccounts', this._flatGroupedAccounts)
    },
    openHome(account) {
      new SfConnection().login(account, '/lightning/page/home')
    },
    openDevConsole(account) {
      new SfConnection().login(account, '/_ui/common/apex/debug/ApexCSIPage')
    },
    openSetup(account) {
      new SfConnection().login(account, '/lightning/setup/SetupOneHome/home')
    },
    keyboardAction(event) {
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
    cursorUp() {
      if (this.selectedRow < 1) {
        this.selectedRow = 0
        return
      }
      this.selectedRow -= 1

      this.$scrollTo(`#${this._selectedRowId}`, 0, {
        offset: -200,
        lazy: false,
      })
    },
    cursorDown() {
      if (this.selectedRow >= this._flatGroupedAccounts.length - 1) {
        this.selectedRow = this._flatGroupedAccounts.length - 1
        return
      }
      this.selectedRow += 1

      this.$scrollTo(`#${this._selectedRowId}`, 0, {
        offset: -200,
        lazy: false,
      })
    },
    cursorLeft() {
      if (this.selectedCol < 1) {
        this.selectedCol = 0
        return
      }
      this.selectedCol -= 1
    },
    cursorRight() {
      // アカウントコントロールパネルの右端にCursorがあるとき
      if (this.selectedCol > 1) {
        this.selectedCol = 2
        return
      }
      this.selectedCol += 1
    },
    enterAction() {
      if (this.selectedRow < 0) return

      const targetAccount = this._flatGroupedAccounts[this.selectedRow]
      switch (this.selectedCol) {
        case 0:
          this.openHome(targetAccount)
          break
        case 1:
          this.openSetup(targetAccount)
          break
        case 2:
          this.openDevConsole(targetAccount)
          break
        default:
          break
      }
    },
    refreshSearchResult() {
      const filtered = this._filterAccounts(this.$store.state.accounts)
      this.groupedAccounts = this._groupAccounts(filtered)
    },
    _groupAccounts(accounts) {
      const groupedAccounts = groupBy(accounts, account => account.group)
      const formated = Object.entries(groupedAccounts).map(entry => {
        return { groupName: entry[0], accounts: entry[1] }
      })
      return formated
    },
    _filterAccounts(accounts) {
      return accounts.filter(account => {
        // フィルタ条件：検索ワードと前方一致するグループ、表示名、ユーザ名
        if (!this.innerAccountFilterText) return true

        const matchesDisplayName =
          account.displayName
            .toLowerCase()
            .indexOf(this.innerAccountFilterText.toLowerCase()) !== -1
        const matchesUserName =
          account.userName
            .toLowerCase()
            .indexOf(this.innerAccountFilterText.toLowerCase()) !== -1
        const matchesGroup =
          account.group
            .toLowerCase()
            .indexOf(this.innerAccountFilterText.toLowerCase()) !== -1
        return matchesDisplayName || matchesUserName || matchesGroup
      })
    },
    _resetRowSelection() {
      this.selectedRow = -1
      this.selectedCol = 0
    },
  },
}
</script>

<style scoped>
.header {
  position: sticky;
  top: 0.75rem;
  background-color: #ececec;
  border-radius: 4px;
  z-index: 9999;
  padding: 5px;
}
.header .button {
  margin: 0px 0px 0px 5px !important;
  padding: 1rem !important;
}
</style>