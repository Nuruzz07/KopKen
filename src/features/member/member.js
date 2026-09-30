(function () {
    async function lookupCustomerLoyaltyHistory({
        supabaseClient,
        formatRp,
        onTap,
        onToast
    }) {
        onTap();

        const input = document.getElementById('history-lookup-wa');
        const summaryBox = document.getElementById('loyalty-summary-box');
        const summaryText = document.getElementById('loyalty-summary-text');
        const subText = document.getElementById('loyalty-sub-text');

        if (!input || !input.value.trim()) {
            onToast("Masukkan nomor WhatsApp terlebih dahulu!");
            return;
        }

        let cleanWa = input.value.trim().replace(/[^0-9]/g, '');

        if (cleanWa.startsWith('0')) {
            cleanWa = '62' + cleanWa.slice(1);
        } else if (!cleanWa.startsWith('62')) {
            cleanWa = '62' + cleanWa;
        }

        if (summaryBox) summaryBox.classList.remove('hidden');

        if (summaryText) {
            summaryText.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Memeriksa data langganan...';
        }

        try {
            if (!supabaseClient) throw new Error("Database belum terhubung");

            const { data: cust, error } = await supabaseClient
                .from('customers')
                .select('*')
                .eq('phone_number', cleanWa)
                .single();

            if (error || !cust) {
                if (summaryText) {
                    summaryText.innerHTML = `👋 Nomor WhatsApp belum tercatat sebagai langganan.`;
                }

                if (subText) {
                    subText.textContent = `Yuk selesaikan pesanan pertamamu hari ini!`;
                }

                return;
            }

            const totalOrders = cust.total_orders || 1;
            const totalSpent = cust.total_spent || 0;

            if (summaryText) {
                summaryText.innerHTML = `⭐ <b>Halo Kak ${cust.customer_name || 'Pelanggan'}!</b>`;
            }

            if (subText) {
                subText.innerHTML =
                    `Kamu sudah order <b>${totalOrders} kali</b> dengan total jajan <b>${formatRp(totalSpent)}</b>. 🫶☕`;
            }
        } catch (e) {
            if (summaryText) {
                summaryText.innerHTML = `⚠️ Data belum dapat dimuat.`;
            }
        }
    }

    async function searchMemberCode({
        supabaseClient,
        value,
        onApply
    }) {
        const query = value.trim().toLowerCase();
        const suggestBox = document.getElementById('memberSuggestBox');

        if (!suggestBox) return;

        if (query.length < 2) {
            suggestBox.style.display = 'none';
            suggestBox.innerHTML = '';
            return;
        }

        try {
            if (!supabaseClient) return;

            const { data, error } = await supabaseClient
                .from('members')
                .select('*')
                .ilike('member_code', `${query}%`)
                .limit(4);

            if (!error && data && data.length > 0) {
                suggestBox.innerHTML = data.map(m => `
                    <div onclick="applyMemberProfile('${m.member_code}', '${encodeURIComponent(m.customer_name)}', '${m.customer_phone}', '${m.favorite_outlet_name || ''}')"
                         style="padding: 10px 12px; cursor: pointer; border-bottom: 1px solid #f1f1f1; display: flex; justify-content: space-between; align-items: center; text-align: left;"
                         onmouseover="this.style.background='#faf5f0'"
                         onmouseout="this.style.background='white'">
                        <div>
                            <strong style="color: #9C532B; font-size: 13px;">@${m.member_code}</strong>
                            <div style="font-size: 11px; color: #777;">Outlet: ${m.favorite_outlet_name || 'Bebas'}</div>
                        </div>
                        <span style="font-size: 11px; background: #E8D8C8; color: #5c2d16; padding: 2px 8px; border-radius: 12px; font-weight: 600;">Pakai</span>
                    </div>
                `).join('');

                suggestBox.style.display = 'block';
            } else {
                suggestBox.style.display = 'none';
            }
        } catch (e) {
            suggestBox.style.display = 'none';
        }
    }

    function applyMemberProfile({
        code,
        encodedName,
        phone,
        outletName,
        allOutlets,
        onOutletSelected,
        onToast
    }) {
        const name = decodeURIComponent(encodedName);

        localStorage.setItem("bintang_member_session", JSON.stringify({
            code,
            name,
            phone,
            outlet: outletName
        }));

        const memberInput = document.getElementById('memberCodeInput');
        if (memberInput) memberInput.value = code;

        const suggestBox = document.getElementById('memberSuggestBox');
        if (suggestBox) suggestBox.style.display = 'none';

        if (outletName && Array.isArray(allOutlets)) {
            const found = allOutlets.find(
                o => o.name.toLowerCase() === outletName.toLowerCase()
            );

            if (found) onOutletSelected(found);
        }

        onToast(`✨ Profil <b>@${code}</b> terpasang!`);
    }

    window.BintangMember = {
        lookupCustomerLoyaltyHistory,
        searchMemberCode,
        applyMemberProfile
    };
})();
