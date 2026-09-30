(function () {
    function persistCart(cart, selectedOutlet, currentOrderType) {
        try {
            localStorage.setItem("bintang_cart", JSON.stringify(cart));
            localStorage.setItem("cart", JSON.stringify(cart));

            if (selectedOutlet !== undefined) {
                localStorage.setItem("bintang_selected_outlet", JSON.stringify(selectedOutlet));
                localStorage.setItem("selectedOutlet", JSON.stringify(selectedOutlet));
            }

            if (currentOrderType !== undefined) {
                localStorage.setItem("bintang_order_type", currentOrderType);
            }
        } catch (e) {}
    }

    function updateCartUI(cart) {
        const badge = document.getElementById('cart-badge');
        const countText = document.getElementById('cart-item-count-text');
        const totalQty = cart.reduce((sum, c) => sum + (c.qty || 1), 0);

        if (countText) countText.textContent = `${totalQty} Item`;

        if (badge) {
            if (totalQty > 0) {
                badge.classList.remove('hidden');
                badge.textContent = totalQty;
            } else {
                badge.classList.add('hidden');
            }
        }
    }

    function addToCartFromModal({
        cart,
        currentModalItem,
        modalPriceCache,
        editingCartIndex,
        selectedOutlet,
        currentOrderType,
        onAnimation,
        onToast,
        onCloseModal,
        onUpdateCartUI
    }) {
        if (!currentModalItem) return cart;

        const itemName = currentModalItem.name;
        const details = [];
        const chosenPrice = modalPriceCache;

        if (currentModalItem.type === 'bundling') {
            details.push(document.getElementById('mod-bundle-sel')?.value || '');
        } else if (currentModalItem.type === 'drink') {
            const temp = document.querySelector('input[name="mod-temp"]:checked')?.value || 'Ice';
            const sizePick = document.querySelector('input[name="mod-size-pick"]:checked')?.value || 'Regular';
            const sugar = document.querySelector('input[name="mod-sugar"]:checked')?.value || 'Normal Sugar';

            details.push(temp);
            details.push(sizePick);

            if (sugar !== 'Normal Sugar') details.push(sugar);

            if (temp === 'Ice') {
                const ice = document.querySelector('input[name="mod-ice"]:checked')?.value || 'Normal Ice';
                if (ice !== 'Normal Ice') details.push(ice);
            }

            document.querySelectorAll('.mod-addons-chk:checked').forEach(chk => {
                details.push(chk.value);
            });
        }

        const note = document.getElementById('mod-note')?.value || '';

        if (editingCartIndex !== null) {
            cart[editingCartIndex] = {
                item: currentModalItem,
                name: currentModalItem.name,
                details: details.join(', '),
                note,
                price: chosenPrice,
                qty: cart[editingCartIndex].qty || 1
            };

            onToast("Pesanan di keranjang diperbarui!");
        } else {
            cart.push({
                item: currentModalItem,
                name: currentModalItem.name,
                details: details.join(', '),
                note,
                price: chosenPrice,
                qty: 1
            });

            onAnimation();
            onToast(`<b>${itemName}</b><br>Berhasil masuk ke keranjang!`);
        }

        persistCart(cart, selectedOutlet, currentOrderType);
        onCloseModal();
        onUpdateCartUI();

        return cart;
    }

    function addCustomRequestToCart({
        cart,
        selectedOutlet,
        currentOrderType,
        onClose,
        onUpdateCartUI,
        onToast
    }) {
        const name = document.getElementById('req-menu-name')?.value.trim();
        if (!name) return cart;

        const price = parseFloat(document.getElementById('req-menu-price')?.value) || 18000;
        const note = document.getElementById('req-menu-note')?.value.trim() || '';

        cart.push({
            item: {
                id: 'custom_req_' + Date.now(),
                name: `✍️ [Request] ${name}`,
                isCustom: true
            },
            name: `✍️ [Request] ${name}`,
            details: '[REQUEST KUSTOM]',
            note,
            price,
            qty: 1
        });

        persistCart(cart, selectedOutlet, currentOrderType);
        onClose();
        onUpdateCartUI();
        onToast(`Request <b>${name}</b> berhasil masuk ke keranjang!`);

        return cart;
    }

    window.BintangCart = {
        persistCart,
        updateCartUI,
        addToCartFromModal,
        addCustomRequestToCart
    };
})();
