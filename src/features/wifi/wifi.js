(function () {
    function getDailyWifiPassword({ getWIBDate, wifiPasswords }) {
        const now = getWIBDate();
        const dayNum = now.getDate();
        return wifiPasswords[dayNum] || "TemanKenangan#01";
    }

    window.BintangWifi = {
        getDailyWifiPassword
    };
})();
