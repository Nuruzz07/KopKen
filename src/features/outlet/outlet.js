export function parseTimeToMinutes(timeStr) {
    if (!timeStr) return 0;

    const clean = timeStr.toString().replace('.', ':').trim();
    const parts = clean.split(':');

    if (parts.length < 2) return 0;

    return (parseInt(parts[0], 10) || 0) * 60 +
           (parseInt(parts[1], 10) || 0);
}

export function isSignatureOutlet(outlet) {
    if (!outlet) return false;

    const cat = (outlet.category || '').toLowerCase();
    const name = (outlet.name || '').toLowerCase();

    return cat.includes('signature') ||
           /signature|heritage/i.test(name);
}

export function isOutletOpenNow(outlet, getWIBDate) {
    if (!outlet) return true;
    if (isSignatureOutlet(outlet)) return false;

    const statusLabel = (outlet.status_label || '').toUpperCase();
    const openStatus = (outlet.open_status || '').toUpperCase();

    if (statusLabel === 'CLOSED' || openStatus === 'CLOSED') return false;

    if (!outlet.open_time && !outlet.hours?.open_time) return false;

    const wib = getWIBDate();
    const curMin = wib.getHours() * 60 + wib.getMinutes();

    const openTimeStr =
        outlet.open_time ||
        outlet.hours?.open_time ||
        "00:01";

    const closeTimeStr =
        outlet.order_close_time ||
        outlet.real_close_time ||
        outlet.hours?.order_close_time ||
        "23:59";

    const openMin = parseTimeToMinutes(openTimeStr);
    const closeMin = parseTimeToMinutes(closeTimeStr);

    if (closeMin < openMin) {
        return curMin >= openMin || curMin < closeMin;
    }

    return curMin >= openMin && curMin < closeMin;
}

export function isMallOutlet(outlet) {
    if (!outlet) return false;

    const cat = (outlet.category || '').toLowerCase();
    const name = (outlet.name || '').toLowerCase();

    const pattern =
        /mall|plaza|tower|city|junction|avenue|walk|central park|grand indonesia|paskal|residence|hospital/i;

    return cat.includes('mall') || pattern.test(name);
}

export async function loadOutlets({
    fetchImpl = fetch,
    fallbackOutlets = []
} = {}) {
    let outlets = [];

    try {
        const response = await fetchImpl('./outlet.json');

        if (response.ok) {
            outlets = await response.json();
        }
    } catch (error) {
        // Keep existing fallback behavior.
    }

    if (!Array.isArray(outlets) || outlets.length === 0) {
        outlets = fallbackOutlets;
    }

    return outlets;
}

export function getSavedOutlet(storage = localStorage) {
    const savedOutletRaw =
        storage.getItem("bintang_selected_outlet") ||
        storage.getItem("selectedOutlet");

    if (!savedOutletRaw) return null;

    try {
        return JSON.parse(savedOutletRaw);
    } catch (error) {
        return null;
    }
}

export function saveSelectedOutlet(outlet, storage = localStorage) {
    if (!outlet) return;

    const serialized = JSON.stringify(outlet);

    storage.setItem("bintang_selected_outlet", serialized);
    storage.setItem("selectedOutlet", serialized);
}

export function findOutletById(outlets, outletId) {
    if (!Array.isArray(outlets)) return null;

    return outlets.find(outlet => outlet.id === outletId) || null;
}

export function searchOutlets(outlets, query, limit = 15) {
    if (!Array.isArray(outlets)) return [];

    const normalizedQuery = String(query || '').trim().toLowerCase();

    if (!normalizedQuery) return [];

    return outlets
        .filter(outlet =>
            (outlet.name && outlet.name.toLowerCase().includes(normalizedQuery)) ||
            (outlet.address && outlet.address.toLowerCase().includes(normalizedQuery))
        )
        .slice(0, limit);
}

window.BintangOutlet = {
    parseTimeToMinutes,
    isSignatureOutlet,
    isOutletOpenNow,
    isMallOutlet,
    loadOutlets,
    getSavedOutlet,
    saveSelectedOutlet,
    findOutletById,
    searchOutlets
};
