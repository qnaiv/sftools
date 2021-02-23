import Vue from 'vue'
import Vuex from 'vuex'
import shortid from 'shortid'
import cloneDeep from 'clone-deep'
import Account from './account'

Vue.use(Vuex)

// ストアの定義
const store = new Vuex.Store({
    state: {
        accounts: []
    },
    actions: {
        getAccounts: state =>{
            chrome.storage.sync.get('accounts', result =>{
                state.commit('getAccountsMutation', [...result.accounts].map(account => new Account(account)) || [])
            })
        },
        updateAccount: ({ commit, state },account) =>{
            console.log("update")
            const updatedAccounts = [...state.accounts]
            const accountCopy = cloneDeep(account)
            
            const updateTargetIdx = updatedAccounts.findIndex(acc=>acc.id === accountCopy.id)
            if(updateTargetIdx === -1){
                throw new Error('target account not found.')
            }
            updatedAccounts[updateTargetIdx] = accountCopy

            chrome.storage.sync.set({accounts: updatedAccounts})
            commit('getAccountsMutation', updatedAccounts)
        },
        insertAccount: ({ commit, state },account) =>{
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
            chrome.storage.sync.set({accounts: updatedAccounts})
            commit('getAccountsMutation', updatedAccounts)
        },
        deleteAccount: ({ commit, state},accountId) =>{
            const updatedAccounts = [...state.accounts]
            const deleteTargetIdx = updatedAccounts.findIndex(account=>account.id === accountId)
            updatedAccounts.splice(deleteTargetIdx,1)

            chrome.storage.sync.set({accounts: updatedAccounts})
            commit('getAccountsMutation', updatedAccounts)

        }
    },
    mutations: {
        getAccountsMutation (state, accounts) {
            
            // eslint-disable-next-line no-param-reassign
            state.accounts = [...accounts].map(account => new Account(account))
            console.log(state.accounts);
        }
    }
})


// ストアをエクスポート
export default store