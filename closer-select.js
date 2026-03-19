export async function initCloserSelect(targetId, inputId, onChangeCallback) {
    const API_URL = "https://script.google.com/macros/s/AKfycbxb282oIXg6UrpqJ1MM2txXEriwJnq8nHiUFqZTpyoI8FJ4zOHFjrQKvqnDhteA9qTl/exec";
    const container = document.getElementById(targetId);
    const urlInput = document.getElementById(inputId);

    // 文字の見やすさを最優先した超薄いパステルカラー
    const rankOrder = ["トップセールス", "2軍", "3軍", "研修生", "審査落ち"];
    const colors = {
        "トップセールス": "#FFF0F0", // 極薄ピンク
        "2軍": "#F0F7FF",          // 極薄水色
        "3軍": "#FFFFF0",          // 極薄黄色
        "研修生": "#F2F9F2",        // 極薄緑
        "審査落ち": "#F5F0FF"       // 極薄紫
    };

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        const filtered = data
            .filter(item => item.rank !== "引退")
            .sort((a, b) => rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank));

        const select = document.createElement('select');
        select.style.width = "100%";
        select.style.padding = "10px";
        select.style.backgroundColor = "#ffffff";
        select.innerHTML = '<option value="">▼ 担当者を選択してください</option>';

        filtered.forEach(item => {
            const option = document.createElement('option');
            option.textContent = `${item.name}（${item.rank}）`;
            option.value = item.zoom;
            option.style.backgroundColor = colors[item.rank] || "#ffffff";
            select.appendChild(option);
        });

        select.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            if (urlInput) urlInput.value = this.value; 

            // 色の連動（未選択時は白、選択時は薄色）
            if (this.selectedIndex === 0) {
                this.style.backgroundColor = "#ffffff";
            } else {
                this.style.backgroundColor = selectedOption.style.backgroundColor;
            }

            if (onChangeCallback) onChangeCallback();
        });

        container.innerHTML = '';
        container.appendChild(select);

    } catch (err) {
        container.innerHTML = '<span style="color:red;">読み込みエラー</span>';
        console.error(err);
    }
}
