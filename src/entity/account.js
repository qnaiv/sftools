export default class Account{
    constructor(account){
        const acct = account || {}
        this.id = acct.id || ''
        this.displayName = acct.displayName || ''
        this.userName = acct.userName || ''
        this.password = acct.password || ''
        this.group = acct.group || 'general'
        this.orgType = acct.orgType || 'production'
        this.isEncrypted = acct.isEncrypted || false
    }
}