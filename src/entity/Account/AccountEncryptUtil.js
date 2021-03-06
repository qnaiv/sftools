
import cloneDeep from 'clone-deep'
import CryptoJS from "crypto-js"

const secretKey = 'sfscrtky'

export default class AccountEncryptUtil{

    /**
     * アカウントリスト内のパスワードを暗号化して、新しいインスタンスで返す。
     * @param {Array<Account>} accounts 
     */
    static encryptAccounts(accounts) {
        const encrypted = []
        accounts.forEach(account=>encrypted.push(this.encryptAccount(account)))
        return encrypted
    }

    /**
     * アカウント内のパスワードを暗号化して、新しいインスタンスで返す。
     * @param {Account} account
     */
    static encryptAccount(account){
        if(account.isEncrypted){
            throw Error('Account already encrypted.')
        }
        const accountCopy = cloneDeep(account)
        accountCopy.password = CryptoJS.AES.encrypt(accountCopy.password, secretKey).toString()
        accountCopy.isEncrypted = true
        return accountCopy
    }

    static decryptAccount(account){
        if(!account.isEncrypted){
            throw Error('Account already decrypted.')
        }
        const ac = cloneDeep(account)
        ac.password = CryptoJS.AES.decrypt(ac.password, secretKey).toString(CryptoJS.enc.Utf8)
        ac.isEncrypted = false
        return ac
    }
}