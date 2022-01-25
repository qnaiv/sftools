<template>
  <div class="card block">
    <div class="card-content">
      <p class="title">
        Export
      </p>
      <p>json形式でデータをエクスポートします。</p>
    </div>
    <footer class="card-footer">
      <button
        class="card-footer-item" 
        @click="exportJson"
      >
        Export
      </button>
    </footer>
  </div>
</template>

<script>
import browser from 'webextension-polyfill'

export default {
  methods: {
    async exportJson() {
      const result = await browser.storage.local.get('accounts')
      const exportData = JSON.stringify(result)
      const blob = new Blob([exportData], { type: 'application/json' })
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = 'sftools-data.json'
      link.click()
    },
  },
}
</script>

<style>
</style>