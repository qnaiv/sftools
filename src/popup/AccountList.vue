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
        :to="{name: ''}"
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
        :to="{name: ''}"
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
    >
      {{ group[0].group }}
      <div
        v-for="(account,index) in group"
        :key="index"
        class="box accounts"
      >
        <div class="controls">
          <button
            class="button is-primary is-small"
            @click="openOrg(account)"
          >
            <span class="icon">
              <i class="mdi mdi-folder-open" />
            </span>
          </button>
          <button
            class="button is-danger is-small"
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
          url: account.loginUrl
        })
      },
      openDevConsole(account) {
        chrome.tabs.create({
          active: true,
          url: account.developerConsoleUrl
        })
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
</style>