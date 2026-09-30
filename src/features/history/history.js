(function () {
    function getHistory() {
        try {
            return JSON.parse(localStorage.getItem('bintang_order_history') || '[]');
        } catch (e) {
            return [];
        }
    }

    function renderOrderHistory({ formatRp }) {
        const container = document.getElementById('history-items-list');
        const history = getHistory();

        if (!container) return;

        if (history.length === 0) {
            container.innerHTML =
                '<p class="text-xs text-gray-500 italic text-center py-6">Belum ada riwayat pesanan.</p>';
            return;
        }

        container.innerHTML = '';

        history.forEach((h, idx) => {
            container.innerHTML += `
                <div class="bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
                    <div class="flex justify-between items-center mb-1">
                        <span class="text-[10px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full uppercase">${h.orderType}</span>
                        <span class="text-[10px] text-gray-400 font-medium">${h.date}</span>
                    </div>
                    <h4 class="font-extrabold text-xs text-kenangan-dark">${h.outletName}</h4>
                    <p class="text-[11px] text-gray-600 line-clamp-2 mt-0.5">${h.itemsSummary}</p>
                    <div class="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                        <span class="text-xs font-extrabold text-kenangan-primary">${formatRp(h.grandTotal)}</span>
                        <button onclick="reorderHistoryItem(${idx})" class="px-3 py-1 rounded-xl bg-kenangan-dark hover:bg-kenangan-primary text-white text-[11px] font-bold transition flex items-center gap-1 active:scale-95 cursor-pointer">
                            <i class="fas fa-arrow-rotate-right text-[10px]"></i> Pesan Lagi
                        </button>
                    </div>
                </div>
            `;
        });
    }

    function getHistoryItem(index) {
        return getHistory()[index];
    }

    function clearOrderHistory({ onRender, onToast }) {
        localStorage.removeItem('bintang_order_history');
        onRender();
        onToast("Riwayat pesanan dibersihkan");
    }

    window.BintangHistory = {
        getHistory,
        getHistoryItem,
        renderOrderHistory,
        clearOrderHistory
    };
})();
