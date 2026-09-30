(function () {
    const SCHEDULE_BUSY = [
        { day: 2, start: "07:00", end: "08:40" },
        { day: 2, start: "14:20", end: "16:00" },
        { day: 4, start: "08:40", end: "10:20" },
        { day: 4, start: "16:10", end: "17:50" }
    ];

    function checkAdminSchedule(date = new Date()) {
        const day = date.getDay();
        const currentMinutes = date.getHours() * 60 + date.getMinutes();

        const busy = SCHEDULE_BUSY.find(slot => {
            if (slot.day !== day) return false;

            const [startHour, startMinute] = slot.start.split(":").map(Number);
            const [endHour, endMinute] = slot.end.split(":").map(Number);

            const start = startHour * 60 + startMinute;
            const end = endHour * 60 + endMinute;

            return currentMinutes >= start && currentMinutes < end;
        });

        if (!busy) {
            return {
                isBusy: false,
                availableAt: null
            };
        }

        return {
            isBusy: true,
            availableAt: busy.end
        };
    }

    function getScheduleBusy() {
        return SCHEDULE_BUSY.slice();
    }

    window.BintangAdmin = {
        checkAdminSchedule,
        getScheduleBusy
    };
})();
