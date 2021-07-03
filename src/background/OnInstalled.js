import browser from 'webextension-polyfill'

/**
 * browser.storage.syncに保存されているアカウント情報を.localに移し替える
 * (syncは容量が少ないため)
 */
async function moveAccountSyncToLocal(){
    const syncAccounts = await browser.storage.sync.get('accounts')
    if(syncAccounts && syncAccounts.accounts){
        browser.storage.local.set({accounts: syncAccounts.accounts})
        browser.storage.sync.remove('accounts')
    }

    const syncSignUpInfo = await browser.storage.sync.get('signUpInfo')
    if(syncSignUpInfo && syncSignUpInfo.signUpInfo){
        browser.storage.local.set({signUpInfo: syncSignUpInfo.signUpInfo})
        browser.storage.sync.remove('signUpInfo')
    }
}

export default moveAccountSyncToLocal