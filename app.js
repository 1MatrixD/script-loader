const __PATCH__ = `chrome-extension://${chrome.runtime.id}`;
const __LIBS__ = `${__PATCH__}/libs`;
const __SCRIPT__ = `${__PATCH__}/scripts/${location.host}`;

const request = ({ url, type = 'text' }) => (
    new Promise(resolve => {
        fetch(url)
            .then(res => resolve(res[type]()))
    })
)

const getFileTypeByFileName = ({ fileName }) => {
    let type;

    if (fileName.endsWith('.css')) {
        type = 'style';
    } else {
        type = 'script';
    }

    return type
}

const appendScript = ({ fileName, data, type = getFileTypeByFileName({ fileName }) }) => {
    let el = document.createElement(type);
        el.innerHTML = data;
    document.body.appendChild(el);
}

!(async function() {
    let config = await request({ url: `${__PATCH__}/config.json`, type: 'json' });
    let host = location.hostname;
    let files = config.files[host];

    if (files === undefined) {
        return;
    }

    console.log(`%cЗагружаю...`, 'color: white');

    files.forEach(async fileName => {
        let url, data, type;
        
        if (fileName.startsWith('%')) {
            url = config.dict[fileName.slice(1)];
            type = 'script';
        } else {
            url = `${__SCRIPT__}/${fileName}`;
        }

        data = await request({ url });

        appendScript({ fileName, data, type });

        console.log(`Загрузил %c${fileName.replace('%', '')}`, 'color: lime');
    });
})()