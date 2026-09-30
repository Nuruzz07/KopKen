async function loadCatalog({
    supabaseClient = null,
    fetchImpl = fetch
} = {}) {
    let parsedMenu = [];

    try {
        if (supabaseClient) {
            const { data, error } = await supabaseClient
                .from('menus')
                .select('*')
                .eq('is_active', true);

            if (!error && data && data.length > 0) {
                data.forEach(item => {
                    parsedMenu.push({
                        id: item.id,
                        name: item.name,
                        cat: item.category,
                        type: item.type,
                        singlePrice: parseFloat(item.single_price) || 15000,
                        realPrice: parseFloat(item.real_price) || 0,
                        badge: item.badge || '',
                        img: item.img || '',
                        imgs: (
                            item.imgs &&
                            Array.isArray(item.imgs) &&
                            item.imgs.length > 0
                        ) ? item.imgs : null,
                        opts: (
                            item.options &&
                            Array.isArray(item.options) &&
                            item.options.length > 0
                        ) ? item.options : ['Varian Default Paket']
                    });
                });
            }
        }
    } catch (e) {
        console.warn("Gagal memuat menu Supabase:", e);
    }

    if (parsedMenu.length === 0) {
        try {
            const menuRes = await fetchImpl('./menu.json');

            if (menuRes.ok) {
                const menuData = await menuRes.json();

                if (menuData && menuData["Kopi Kenangan"]) {
                    const kk = menuData["Kopi Kenangan"];
                    const catMap = {
                        coffee: 'coffee',
                        nonCoffee: 'noncoffee',
                        oatside: 'frappe',
                        frappe: 'frappe',
                        food: 'bakery',
                        baru: 'new'
                    };

                    if (kk.satuan) {
                        for (const key in kk.satuan) {
                            if (Array.isArray(kk.satuan[key])) {
                                kk.satuan[key].forEach(item => {
                                    parsedMenu.push({
                                        id: item.id || `kk_${Math.random()}`,
                                        name: item.name || item.nama,
                                        singlePrice: parseFloat(item.price) || 15000,
                                        realPrice: parseFloat(item.real_price) || 0,
                                        cat: catMap[key] || 'coffee',
                                        badge: item.badge || (item.isNew ? 'NEW' : ''),
                                        img: item.img || item.image || 'https://placehold.co/400x400/9C532B/FBF5EE?text=Kopi+Kenangan',
                                        type: (key === 'food' || item.isFood) ? 'food' : 'drink'
                                    });
                                });
                            }
                        }
                    }

                    if (kk.bundling && Array.isArray(kk.bundling)) {
                        kk.bundling.forEach(b => {
                            parsedMenu.unshift({
                                id: b.id || `bundle_${Math.random()}`,
                                cat: 'bundling',
                                name: b.name || b.nama,
                                singlePrice: parseFloat(b.price) || 35000,
                                realPrice: parseFloat(b.real_price) || 0,
                                type: 'bundling',
                                badge: b.badge || '🎁 BUNDLE',
                                img: b.img || b.image,
                                imgs: b.imgs || (b.img ? [b.img] : null),
                                opts: b.options || b.opts || ['Varian Default Paket']
                            });
                        });
                    }
                }
            }
        } catch (e) {
            console.warn("Gagal memuat menu.json:", e);
        }
    }

    return parsedMenu;
}

function normalizeProduct(product) {
    return {
        ...product,
        singlePrice: parseFloat(product.singlePrice) || 15000,
        realPrice: parseFloat(product.realPrice) || 0,
        opts: (
            Array.isArray(product.opts) &&
            product.opts.length > 0
        ) ? product.opts : ['Varian Default Paket']
    };
}

function searchCatalog(products, query, limit = 50) {
    if (!Array.isArray(products)) return [];

    const q = String(query || '').trim().toLowerCase();

    if (!q) return products.slice(0, limit);

    return products
        .filter(product => {
            const name = String(product.name || '').toLowerCase();
            const cat = String(product.cat || '').toLowerCase();

            return name.includes(q) || cat.includes(q);
        })
        .slice(0, limit);
}

function getProductById(products, productId) {
    if (!Array.isArray(products)) return null;

    return products.find(
        product => String(product.id) === String(productId)
    ) || null;
}

window.BintangCatalog = {
    loadCatalog,
    normalizeProduct,
    searchCatalog,
    getProductById
};

window.BintangCatalog.filterByCategory = function(products, category, keyword = '') {
    if (!Array.isArray(products)) return [];

    const q = String(keyword || '').toLowerCase().trim();

    return products.filter(product => {
        const matchesCategory = product.cat === category;
        const name = String(product.name || '').toLowerCase();
        const matchesKeyword = q === '' || name.includes(q);

        return matchesCategory && matchesKeyword;
    });
};
