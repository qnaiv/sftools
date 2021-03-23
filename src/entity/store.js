import Vue from 'vue'
import Vuex from 'vuex'
import shortid from 'shortid'
import cloneDeep from 'clone-deep'
import Account from './account'
import AccountEncryptUtil from './Account/AccountEncryptUtil'


Vue.use(Vuex)


// ストアの定義
const store = new Vuex.Store({
    state: {
        accounts: [],
        signUpInfo: {}
    },
    actions: {
        /**
         * ストレージに保存されているアカウント情報をstateにセットする
         * @param {*} state 
         */
        loadAccountsFromStorage: state =>{
            chrome.storage.sync.get('accounts', result =>{
                const accounts = [...result.accounts]
                .map(acc=>new Account(acc))
                .map(
                    // パスワードが暗号化されている場合は復号化する
                    acc => acc.isEncrypted ? AccountEncryptUtil.decryptAccount(acc) : acc
                ) || []

                // stateに反映
                state.commit('setAccountsMutation', accounts)
            })
        },
        /**
         * アカウント情報を更新する
         * 更新対象のIDがない場合、エラーを返す。
         * @param {*} param0 
         * @param {Account} account 更新したいアカウント情報 
         */
        updateAccount: ({ commit, state },account) =>{
            console.log("update")
            const updatedAccounts = [...state.accounts]
            const accountCopy = cloneDeep(account)
                        
            const updateTargetIdx = updatedAccounts.findIndex(acc=>acc.id === accountCopy.id)
            if(updateTargetIdx === -1){
                throw new Error('target account not found.')
            }
            updatedAccounts[updateTargetIdx] = accountCopy
            
            // ストレージ保存用の配列を生成(暗号化されていないパスワードを暗号化する)
            const accountsForStorge = updatedAccounts.map(acc=> acc.isEncrypted ? acc : AccountEncryptUtil.encryptAccount(acc))
            chrome.storage.sync.set({accounts: accountsForStorge})

            // stateに反映
            commit('setAccountsMutation', updatedAccounts)
        },
        /**
         * アカウント情報を登録する
         * 既存のIDの場合、更新する。
         * @param {*} param0 
         * @param {Account} account 
         * @param {boolean} isEncrypted
         */
        insertAccount: ({ commit, state }, account) =>{
            console.log("insert")
            const updatedAccounts = [...state.accounts]
            const accountCopy = cloneDeep(account)
            
            const updateTargetIdx = updatedAccounts.findIndex(acc=>acc.id === accountCopy.id)
            if(updateTargetIdx > -1) {
                // すでに同じidのデータがあれば、そのデータを上書きする
                updatedAccounts[updateTargetIdx] = accountCopy
            }else{
                // 未登録なら、IDを採番して新規登録
                accountCopy.id = shortid.generate()
                updatedAccounts.push(accountCopy)
            }
            
            // ストレージ保存用の配列を生成(暗号化されていないパスワードを暗号化する)
            const accountsForStorge = updatedAccounts.map(acc=> acc.isEncrypted ? acc : AccountEncryptUtil.encryptAccount(acc))
            chrome.storage.sync.set({accounts: accountsForStorge})

            // stateに反映
            commit('setAccountsMutation', updatedAccounts)
        },
        /**
         * アカウント情報を削除する
         * @param {*} param0 
         * @param {string} accountId 削除対象アカウントID
         */
        deleteAccount: ({ commit, state},accountId) =>{
            const updatedAccounts = [...state.accounts]
            const deleteTargetIdx = updatedAccounts.findIndex(account=>account.id === accountId)
            updatedAccounts.splice(deleteTargetIdx,1)

            chrome.storage.sync.set({accounts: updatedAccounts})
            commit('setAccountsMutation', updatedAccounts)
            
        },
        loadSignUpInfoFromStorage: state => {
            chrome.storage.sync.get('signUpInfo', result =>{
                // stateに反映
                state.commit('setSignUpInfoMutation', result.signUpInfo)
            })
        },
        updateSignUpInfo: ({ commit}, signUpInfo) => {
            chrome.storage.sync.set({signUpInfo})
            commit('setSignUpInfoMutation', signUpInfo)
        }
    },
    mutations: {
        /**
         * アカウントリストをstateにセットする
         * @param {*} state 
         * @param {Array<Account>} accounts 
         */
        setAccountsMutation (state, accounts) {
            // if(state.accounts.length === 0) return
            
            console.log(state.accounts);
            // eslint-disable-next-line no-param-reassign
            state.accounts = accounts
        },
        setSignUpInfoMutation (state, signUpInfo) {
            // eslint-disable-next-line no-param-reassign
            state.signUpInfo = signUpInfo
        }
    }
})

// ストアをエクスポート
export default store