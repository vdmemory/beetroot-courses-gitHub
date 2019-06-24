let playlist = [];
let thisMusic = null;
let firstMusic = null;
const progressBar = document.querySelector('.player_progress');
const PLAYER = document.querySelector('.player');
document.addEventListener('DOMContentLoaded', contentLoaded);
PLAYER.addEventListener('click', onClick);

/**
 * Получает обьект данных с сервера, записывает в переменную, выводит список плейлиста
 */
function contentLoaded() {
    const AJAX = new XMLHttpRequest();
    AJAX.open('GET', 'data/playlist.json', true);
    AJAX.onreadystatechange = () => {
        if (AJAX.readyState != 4) {
            return;
        };
        const TEMPLATE = document.querySelector('.tmpl-list');
        const PLAYLIST = document.querySelector('.list');
        playlist = JSON.parse(AJAX.responseText).playlist;
        playlist.forEach((item, i) => {
            const CLONE_TEMPLATE = TEMPLATE.content.cloneNode(true);
            CLONE_TEMPLATE.querySelector('.list_icon');
            CLONE_TEMPLATE.querySelector('.list_name').innerText = item.track;
            CLONE_TEMPLATE.querySelector('.list_audio').src = 'track/' + item.file;
            CLONE_TEMPLATE.querySelector('.list_audio').setAttribute('data-key-id', i);
            PLAYLIST.appendChild(CLONE_TEMPLATE);
        });

        document.querySelectorAll('.list_time').forEach((item) => {
            let duration;
            item.nextElementSibling.onloadedmetadata = function () {
                durationTime = item.nextElementSibling.duration;
                return item.innerText = (durationTime / 60).toFixed(2).replace('.', ':');
            }
        });
        firstMusic = document.querySelector('[data-key-id]');
        allMusic = document.querySelectorAll('[data-key-id]');
    };
    AJAX.send();
}

/**
 * Проверят целевой элемент клика и запускает определенную функцию
 * @param {object} event - встроенные объект событий
 */
function onClick(event) {
    const TARGET = event.target;
    switch (true) {
        case TARGET.classList.contains('list_hover'):
            playAudioTrack(TARGET.closest('li').querySelector('[data-key-id]'));
            return;
        case TARGET.id == 'Play':
            playPause();
            return;
        case TARGET.id == 'Next':
            playNext();
            return;
        case TARGET.id == 'Previous':
            playPre();
            return;
        case TARGET.classList.contains('player_progress'):
            playProgress(event);
            return;
        case TARGET.id == 'Muted':
            muted();
            return;
        case TARGET.id == 'Repeat':
            repeat();
            return;     
        case TARGET.id == 'Shuffle':
            shuffle();
            return; 
    }
}

/* main functions */

/**
 * Воспроизведение аудио трека со списка по событию
 * @param {*} AUDIO - DOM элемент аудио трека
 */
function playAudioTrack(AUDIO) {
    clearsValues();
    playAudio(AUDIO);
    assign(AUDIO);
    addTackInfo(AUDIO);
    endedTrack();
    progressBarLoaded();
    return;
}

/**
 * Воспроизведение аудио трека по клике на кнопку -Play
 * Если трек играет выполнить паузу, если нет - воспроизвести первый трек из списка
 * @param {*} AUDIO - DOM элемент аудио трека
 */
function playPause() {
    let colorPlay = document.querySelector('#Play').parentNode.style
    if (!thisMusic) {
        colorPlay.fill = "orange";
        playAudioTrack(firstMusic);
        return;
    }
    if (thisMusic.paused) {
        colorPlay.fill = "orange";
        thisMusic.play();
        return;
    }
    colorPlay.fill = "white";
    thisMusic.pause();
    return;
}

/**
 * Воспроизведение следующий аудио трека по клике на кнопку -Next
 * Если воспроизводимый трек последний в списке - воспроизвести первый трек из списка
 * @param {*} AUDIO - DOM элемент аудио трека
 */
function playNext() {
    if (!thisMusic) return alert('Select audio track.');
    let keyIdMusic = thisMusic.dataset.keyId * 1 + 1;
    let nextMusic = document.querySelector(`[data-key-id = "${keyIdMusic}"]`);
    if (thisMusic.classList.contains('random')) return playShuffle();
    return (nextMusic) ? playAudioTrack(nextMusic) : playAudioTrack(firstMusic);
}

/**
 * Воспроизведение предидущий аудио трека по клике на кнопку -Previous
 * Если воспроизводимый трек первый в списке - воспроизвести последний трек из списка
 * @param {*} AUDIO - DOM элемент аудио трека
 */
function playPre() {
    if (!thisMusic) return alert('Select audio track.');
    let keyIdMusic = thisMusic.dataset.keyId * 1 - 1;
    let nextMusic = document.querySelector(`[data-key-id = "${keyIdMusic}"]`);
    let endMusic = document.querySelector(`[data-key-id = "${playlist.length - 1}"]`);
    if (thisMusic.classList.contains('random')) return playShuffle();
    return (nextMusic) ? playAudioTrack(nextMusic) : playAudioTrack(endMusic);
}

/**
 * Воспроизведение трека ко клику на -progressBar
 */
function playProgress(event) {
    const TARGET = event.target;
    if (!thisMusic) return alert('Select audio track.');
    let current = event.pageX - event.target.closest('.player_nav').offsetLeft - event.target.offsetLeft - 20;
    let clickedValue = current * event.target.max / event.target.offsetWidth;
    thisMusic.currentTime = thisMusic.duration * (clickedValue / 100);
};

/**
 * Отключение/включение звука по на кнопку -Muted
 */
function muted() {
    let colorMuted = document.querySelector('#Muted').style;
    if (!thisMusic) return alert('Select audio track.');
    if (thisMusic.muted) {
        colorMuted.fill = "#3e4a43";
        allMusic.forEach(item => item.muted = false);
        return;
    }
    colorMuted.fill = "darkorange";
    allMusic.forEach(item => item.muted = true);
    return;
};

/**
 * Отключение/включение повторения аудио трека по клику на кнопку -Repeat
 */
function repeat() {
    let colorRepeat = document.querySelector('#Repeat').style
    if (!thisMusic) return alert('Select audio track.');
    if (thisMusic.hasAttribute('loop')) {
        colorRepeat.fill = "#3e4a43";
        return thisMusic.removeAttribute('loop');  
    }
    colorRepeat.fill = "darkorange";
    return thisMusic.setAttribute('loop', '');
};

/**
 * Создает класс, необходимый для определения функцией ended() порядкавоспроизводимого аудио трека по клику на кнопку -Shuffle
 */
function shuffle() {
    let colorShuffle = document.querySelector('#Shuffle').style
    if (!thisMusic) return alert('Select audio track.');
    if (thisMusic.classList.contains('random')) {
        colorShuffle.fill = "#3e4a43";
        return allMusic.forEach(item => item.classList.remove('random'));
    }
    colorShuffle.fill = "darkorange";
    return allMusic.forEach(item => item.classList.add('random'));
};

/* secondary functions */

/**
 * Загружает и воспроизводит аудио трек
 * @param {*} AUDIO - DOM элемент аудио трека
 */
function playAudio(AUDIO) {
    let SVG_ICON = AUDIO.parentNode.querySelector('.list_icon svg')
    AUDIO.load();
    SVG_ICON.style.display = "block"
    AUDIO.play().catch(() => { });
    return;
}

/**
 * Записывает ссылку на аудио трек в глобальную переменную
 * @param {*} AUDIO - DOM элемент аудио трека
 */
function assign(AUDIO) {
    thisMusic = AUDIO;
    return;
}

/**
 * Ставит все треки на паузу
 */
function clearsValues() {
    const SVG_PLAY = document.querySelectorAll('.list_icon svg');
    allMusic.forEach(item => item.pause());
    SVG_PLAY.forEach(item => item.style.display = "none");
    return;
}

/**
 * Счетчик прогрессбар, запускается при воспроизведении аудио трека
 */
function progressBarLoaded() {
    thisMusic.addEventListener('timeupdate', (() => {
        if (thisMusic.duration > 0) return progressBar.value = ((thisMusic.currentTime / thisMusic.duration) * 100);
    }));
};

/**
 * Заполнение информации по воспроизводимому аудио треку в левый sideBar:
 *  - картинки аудио трека;
 *  - автора;
 *  - названия аудио трека.
 * @param {*} AUDIO - DOM элемент аудио трека
 */
function addTackInfo(AUDIO) {
    const DETAIL = document.querySelector('.detail');
    let idAudio = thisMusic.dataset.keyId;
    DETAIL.querySelector('.detail_picture').src = playlist[idAudio].image ? "img/" + playlist[idAudio].image : "img/placeholder.png";
    DETAIL.querySelector('.detail_title').innerText = playlist[idAudio].track;
    DETAIL.querySelector('.detail_subtitle').innerText = playlist[idAudio].author;
};

/**
 * Определяет произвольный аудио трек по клике на кнопку -Shuffle
 * @param {*} AUDIO - DOM элемент аудио трека
 */
function playShuffle() {
    if (!thisMusic) return alert('Select audio track.');
    let keyIdRandom = Math.floor(Math.random() * playlist.length);
    let randomMusic = document.querySelector(`[data-key-id = "${keyIdRandom}"]`);
    return playAudioTrack(randomMusic);
}

/**
 * Запускает следующий или произвольный трек после окончания предидущего
 */
function endedTrack() { 
    return thisMusic.addEventListener('ended', (() => playNext()));
};
