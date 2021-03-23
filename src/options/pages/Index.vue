<template>
  <div>
    <div class="card block">
      <div class="card-content">
        <p class="title">Import</p>
        <p>
          sftoolsまたはORGanizer for
          SalesforceでエクスポートしたJSONをインポートします。
        </p>
        <div class="field">
          <label class="label">type</label>
          <div class="control">
            <div class="select">
              <select v-model="importType">
                <option value="sftools">sftools</option>
                <option value="organizer">ORGanizer for Salesforce</option>
              </select>
            </div>
          </div>
        </div>
        <div class="field">
          <div class="control">
            <input ref="uploadFile" type="file" @change="importJson" />
          </div>
        </div>
      </div>
      <footer class="card-footer">
        <button
          class="card-footer-item"
          :disabled="importedAccount.length === 0"
          @click="saveImportedAccount"
        >
          Import
        </button>
      </footer>
    </div>

    <div class="card block">
      <div class="card-content">
        <p class="title">Export</p>
        <p>json形式でデータをエクスポートします。</p>
      </div>
      <footer class="card-footer">
        <button class="card-footer-item" @click="exportJson">Export</button>
      </footer>
    </div>
    <div class="card block">
      <div class="card-content">
        <p class="title">サインアップ時に自動入力する情報</p>
        <div class="field">
          <label class="label">姓</label>
          <div class="control">
            <input v-model="signUpInfo.lastName" type="text" class="input" />
          </div>
        </div>
        <div class="field">
          <label class="label">姓</label>
          <div class="control">
            <input v-model="signUpInfo.firstName" type="text" class="input" />
          </div>
        </div>
        <div class="field">
          <label class="label">Email</label>
          <div class="control">
            <input v-model="signUpInfo.email" type="text" class="input" />
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
            <input v-model="signUpInfo.company" type="text" class="input" />
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
            <input v-model="signUpInfo.postalCode" type="text" class="input" />
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
  </div>
</template>

<script>
import Account from '../../entity/account'

export default {
  data() {
    return {
      importedAccount: [],
      importType: 'sftools',
    }
  },
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
  created() {
    this.$store.dispatch('loadAccountsFromStorage')
    this.$store.dispatch('loadSignUpInfoFromStorage')
  },
  methods: {
    exportJson() {
      chrome.storage.sync.get('accounts', (result) => {
        const exportData = JSON.stringify(result)
        const blob = new Blob([exportData], { type: 'application/json' })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = 'sftools-data.json'
        link.click()
      })
    },
    // ファイルを読み込む処理（保存はしない）
    importJson(e) {
      const self = this
      const file = e.target.files[0]

      if (!file.type.match('application/json')) {
        console.log('file type invalid.')
        return
      }

      const reader = new FileReader()
      reader.readAsText(file)

      reader.onload = () => {
        const persedData = JSON.parse(reader.result)

        let importedData = []
        if (self.importType === 'organizer') {
          // ORganizer for salesforceからのインポート(sftool用のフォーマットに変換)
          importedData = self.getAccountFromOrganizerJson(persedData.accounts)
        } else {
          // sftoolからのインポート
          importedData = persedData.accounts
        }

        // 読み込み済みアカウントにセット
        self.importedAccount = importedData
      }
    },
    saveImportedAccount() {
      if (!this.importedAccount) return
      // 読み込み済みアカウントを保存
      this.importedAccount.forEach((account) =>
        this.$store.dispatch('insertAccount', account)
      )
      this.importedAccount = []
      this.$refs.uploadFile.value = null
      this.$dialog.alert('インポート完了').then(() => {
        console.log('Closed')
      })
    },
    getAccountFromOrganizerJson(accounts) {
      return accounts.map((account) => {
        return new Account({
          group: account.g,
          displayName: account.n,
          userName: account.u,
          password: account.p,
          orgType: account.r === '0' ? 'production' : 'sandbox',
          isEncrypted: false,
        })
      })
    },
    saveSignUpInfo(){
      this.$store.dispatch('updateSignUpInfo', this.signUpInfo)
    }
  },
}
</script>

<style>
</style>