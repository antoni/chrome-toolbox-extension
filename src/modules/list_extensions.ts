// module ExtensionLister {
// List all installed extensions
export const listExtension = (consumer: (ExtensionInfo) => void) => {
    chrome.management.getAll(extInfos => extInfos.forEach(consumer));
}
// }