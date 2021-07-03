<template>
  <div class="card block">
    <div class="card-content">
      <p class="title">
        Import
      </p>
      <p>
        sftoolsまたはORGanizer for
        SalesforceでエクスポートしたJSONをインポートします。
      </p>
      <div class="field">
        <label class="label">type</label>
        <div class="control">
          <div class="select">
            <select v-model="importType">
              <option value="sftools">
                sftools
              </option>
              <option value="organizer">
                ORGanizer for Salesforce
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="field">
        <div class="control">
          <input
            ref="uploadFile"
            type="file"
            @change="importFile"
          >
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
  methods: {
    // ファイルを読み込む処理（保存はしない）
    importFile(e) {
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
          importedData = self._getAccountFromOrganizerJson(persedData.accounts)
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
    _getAccountFromOrganizerJson(accounts) {
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
  }
}
</script>

<style>

</style>