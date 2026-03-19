export async function initCloserSelect(targetId, inputId, onChangeCallback) {
    const API_URL = "https://script.google.com/macros/s/AKfycbySHVscjhTYWKf8bLJUGIMJ7AArbsp8cS8wl0O8FyYjYoO2mRzMO8jZhcc_cmhDvYfIhA/exec";
    const container = document.getElementById(targetId);
    const urlInput = document.getElementById(inputId);

    const rankOrder = ["トップセールス", "2軍", "3軍", "育成枠", "審査落のみ"];
    const colors = {
        "トップセールス": "#FFF0F0", // 極薄ピンク
        "2軍": "#F0F7FF",          // 極薄水色
        "3軍": "#FFFFF0",          // 極薄黄色
        "育成枠": "#F2F9F2",        // 極薄緑
        "審査落のみ": "#F5F0FF"       // 極薄紫
    };

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        const filtered = data
            .filter(item => item.rank !== "引退")
            .sort((a, b) => rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank));

        const select = document.createElement('select');
        select.style.backgroundColor = "#ffffff"; // 初期状態（未選択）は白
        select.innerHTML = '<option value="">選択してください</option>';

        filtered.forEach(item => {
            const option = document.createElement('option');
            option.textContent = `${item.name}（${item.rank}）`;
            option.value = item.zoom;
            option.style.backgroundColor = colors[item.rank] || "#ffffff";
            select.appendChild(option);
        });

        select.addEventListener('change', function() {
            if (urlInput) urlInput.value = this.value; 

            // 未選択（インデックス0）なら白、それ以外はoptionの背景色を適用
            if (this.selectedIndex === 0) {
                this.style.backgroundColor = "#ffffff";
            } else {
                this.style.backgroundColor = this.options[this.selectedIndex].style.backgroundColor;
            }

            if (onChangeCallback) onChangeCallback();
        });

        container.innerHTML = '';
        container.appendChild(select);

    } catch (err) {
        container.innerHTML = 'エラー';
    }
}
