<template>
  <div class="mb-4">
    <div class="group-header is-flex">
      <div>{{ group.groupName }} [{{ group.accounts.length }}]</div>
      <div class="buttons controls">
        <span
          class="button is-light is-small"
          @click="renameGroup(group)"
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
    <slot />
  </div>
</template>

<script>
import cloneDeep from 'clone-deep'

export default {
  name: 'AccountGroup',
  props: {
    group: Object,
    onDeleteGroup: Function,
    onRenameGroup: Function,
  },
  methods: {
    renameGroup(group) {
      this.$dialog
        .prompt(
          {
            title: '',
          },
          {
            promptHelp: '新しいグループ名を入力してください',
          }
        )
        .then(dialog => {
          if (!dialog.data) return

          group.accounts.forEach(account => {
            const updatedAccount = cloneDeep(account)
            updatedAccount.group = dialog.data
            this.$store.dispatch('updateAccount', updatedAccount)
          })
          group.groupName = dialog.data
          this.onRenameGroup()
        })
        .catch(e => {
          console.log('実行はキャンセルされました')
          console.log(e)
        })
    },
    deleteGroup(group) {
      const self = this
      this.$dialog
        .confirm(
          {
            title: '確認',
            body: 'グループに紐づくアカウントを全て削除してもよろしいですか？',
          },
          {
            okText: 'はい',
            cancelText: 'キャンセル',
          }
        )
        .then(() => {
          group.accounts.forEach(account => {
            self.$store.dispatch('deleteAccount', account.id)
          })
          this.onDeleteGroup(this.group.name)
        })
        .catch(e => {
          console.log('実行はキャンセルされました')
          console.log(e)
        })
    },
  },
}
</script>

<style scoped>
.group-header .controls {
  margin-left: auto;
}
.group-header .button {
  margin: 0px 5px 10px 5px !important;
  padding: 0.5rem !important;
}
</style>