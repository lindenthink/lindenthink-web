const configPath = 'live2d/message.json'

String.prototype.renderTip = function (context) {
    let tokenReg = /(\\)?\{([^\{\}\\]+)(\\)?\}/g;
    return this.replace(tokenReg, function (word, slash1, token, slash2) {
        if (slash1 || slash2) {
            return word.replace('\\', '');
        }
        let variable = token.replace(/\s/g, '');
        return  context[variable] || '';
    });
};

initTips();

function bindTip() {
    fetch(configPath).then(response => response.json()).then(data => {
        bindEvents(data.events, 3000)
    });
}


function initTips(){
    fetch(configPath).then(response => response.json()).then(data => {
        showReferrer(data.referrers, 10000);
        bindEvents(data.events, 3000)
        setInterval(() => showRolling(data.rolling, 8000), 30000)
    });
}

function showReferrer(referrers, timeout=12000) {
    let text = referrers['default']
    let title = document.title.split(' - ')[0]
    if (document.referrer !== '') {
        let referrer = document.createElement('a');
        referrer.href = document.referrer;
        let domain = referrer.hostname.split('.')[1];
        if(referrers.hasOwnProperty(domain)) {
            text = referrers[domain]
        }
    }
    showMessage(pickRandom(text).renderTip({title: title}), timeout);
}

function bindEvents(events, timeout=4000) {
    Object.keys(events).map(type => {
        events[type].map(ev => {
            if (ev.hasOwnProperty('selector')) {
                let els = document.querySelectorAll(ev.selector)
                for (let i = 0; i < els.length; i++) {
                    let el = els[i]
                    el?.addEventListener(type, e => {
                        let text = pickRandom(ev.text)
                        text = text.renderTip({text: el.innerText})
                        showMessage(text, 3000)
                    })
                }
            } else {
                document.addEventListener(type, e => {
                    showMessage(pickRandom(ev.text), timeout);
                })
            }
        })
    })
}

function showRolling(rolling, timeout=8000) {
    let key = pickRandom(Object.keys(rolling));
    let text = '', context = {}, val = rolling[key]
   
    switch(key) {
        case 'hitokoto': 
        case 'jinrishici': {
            fetch(val.url).then(response => response.json()).then(res => {
                text = val.text
                if(key === 'hitokoto') {
                    context = {
                        content: res.hitokoto,
                        author: res.from_who,
                        title: res.from,
                    }
                } else {
                    context = {
                        content: res.data.content,
                        dynasty: res.data.origin.dynasty,
                        author: res.data.origin.author,
                        title: res.data.origin.title,
                    }
                }
                showMessage(text.renderTip(context), timeout);
            })
            break;
        }
        case 'hours': {
            let curHour = new Date().getHours()
            for(let itemKey  in val) {
                let rangeHour = itemKey.split('-')
                if(curHour >= rangeHour[0] && curHour < rangeHour[1]){
                    text = pickRandom(val[itemKey])
                    break;
                }
            }
            break;
        }
        case 'seasons': {
            // https://wannianli.tianqi.com/jieri/
            let now = new Date()
            let month = now.getMonth() + 1 + ''
            let date = now.getDate() + ''
            let year = now.getFullYear()
            let itemKey = month.padStart(2, '0') + '/' + date.padStart(2, '0')
            text = pickRandom(val[itemKey])
            context = {year: year, intverval_1949: year-1949}
            break;
        }
    }
    if(!text) {
        return
    }
    showMessage(text.renderTip(context), timeout);
}

let tipTimer = null;
function showMessage(text, timeout){    
    if (tipTimer !== null) {
        clearTimeout(tipTimer)
    }
    let el = document.querySelector('.message');
    el.innerHTML = text;
    el.style.transition = 'opacity 200ms'; 
    el.style.opacity = '1';

    if (timeout === null) timeout = 5000;
    tipTimer = setTimeout(() =>{
        el.style.transition = 'opacity 200ms'; 
        el.style.opacity = '0';
    }, timeout)
}

function pickRandom(target) {
    return Array.isArray(target) ? target[Math.floor(Math.random() * target.length)] : target
}