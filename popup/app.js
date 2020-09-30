const addListeners = async (el, type, callback) => (
    document.querySelector(el).addEventListener(type, callback)
)


const loadListeners = async () => {
    await addListeners('.reload', 'click', async event => {
        event.preventDefault();

        chrome.runtime.reload();
    })
}

window.addEventListener('load', async (event) => {
    await loadListeners();
})