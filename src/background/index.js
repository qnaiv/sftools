import moveAccountSyncToLocal from './OnInstalled'

// OnInstall handler
chrome.runtime.onInstalled.addListener(details => {
  console.log(details)
  
  if(details.reason === "update"){
    moveAccountSyncToLocal();
  }
})

chrome.commands.onCommand.addListener(command=>{
  console.log('Command:', command)
})