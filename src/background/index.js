// OnInstall handler
chrome.runtime.onInstalled.addListener(details => {
  console.log(details)
})

chrome.commands.onCommand.addListener(command=>{
  console.log('Command:', command)
})