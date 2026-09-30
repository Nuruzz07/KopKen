function getWIBDate() {
    const now = new Date();

    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utc + (7 * 60 * 60000));
}

function isMidnightHour() {
    const wib = getWIBDate();
    return wib.getHours() === 0;
}

function checkNightHours() {
    const wib = getWIBDate();
    const hour = wib.getHours();

    return hour >= 23 || hour < 6;
}

window.BintangTime = {
    getWIBDate,
    isMidnightHour,
    checkNightHours
};
