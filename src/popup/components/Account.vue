<template>
  <div
    :id="account.id"
    :key="account.id"
    class="box accounts"
    :class="{ selectedRow: isSelected }"
  >
    <div class="controls">
      <button
        class="button is-primary"
        :class="{
          selectedCol: isSelected && selectedCol === 0,
        }"
        tabindex="-1"
        @click="onClickHome(account)"
      >
        <span class="icon">
          <i class="mdi mdi-folder-open" />
        </span>
      </button>
      <button
        class="button"
        :class="{
          selectedCol: isSelected && selectedCol === 1,
        }"
        tabindex="-1"
        @click="onClickSetup(account)"
      >
        <span class="icon">
          <i class="mdi mdi-cog-outline" />
        </span>
      </button>
      <button
        class="button is-light"
        :class="{
          selectedCol: isSelected && selectedCol === 2,
        }"
        tabindex="-1"
        @click="onClickDevConsole(account)"
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
        :to="{ name: 'editAccount', params: { account } }"
        tabindex="-1"
      >
        <span class="icon">
          <i class="mdi mdi-cog-outline" />
        </span>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Account',
  props: {
    account: Object,
    isSelected: Boolean,
    selectedCol: Number,
    onClickHome: Function,
    onClickSetup: Function,
    onClickDevConsole: Function,
  },
}
</script>

<style scoped>
.accounts {
  display: flex;
  align-items: center;
  margin: 5px;
  padding: 2px 10px;
}
.accounts .name {
  padding: 0 10px;
  word-break: break-all;
  flex: 1;
}
.accounts .edit {
  margin-left: auto;
}

.accounts .controls .button {
  margin: 0px !important;
  padding: 1rem !important;
}
.selectedRow {
  border: 2px solid #7ba8da;
}
.selectedCol {
  border: 2px solid #a0a0a0 !important;
}
</style>