(function () {
    async function updateStoreStatus({
        supabaseClient,
        newStatus,
        onStatusChange,
        onError
    }) {
        const isOnline = newStatus === "online";
        const statusLabel = isOnline ? "online" : "busy";

        try {
            const { error } = await supabaseClient
                .from("store_settings")
                .upsert({
                    id: "main",
                    is_online: isOnline,
                    status_label: statusLabel,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;

            if (onStatusChange) onStatusChange(statusLabel);

            return {
                ok: true,
                status: statusLabel
            };
        } catch (error) {
            if (onStatusChange) onStatusChange(statusLabel);
            if (onError) onError(error);

            return {
                ok: false,
                status: statusLabel,
                error
            };
        }
    }

    async function fetchStoreStatus({
        supabaseClient,
        onStatusChange
    }) {
        try {
            const { data, error } = await supabaseClient
                .from("store_settings")
                .select("*")
                .eq("id", "main")
                .single();

            if (error) throw error;

            const status = data?.is_online === false ? "busy" : "online";

            if (onStatusChange) onStatusChange(status);

            return {
                ok: true,
                status,
                data
            };
        } catch (error) {
            if (onStatusChange) onStatusChange("online");

            return {
                ok: false,
                status: "online",
                error
            };
        }
    }

    function subscribeStoreStatus({
        supabaseClient,
        onStatusChange
    }) {
        return supabaseClient
            .channel("public:store_settings")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "store_settings"
                },
                payload => {
                    const status =
                        payload?.new?.is_online === false
                            ? "busy"
                            : "online";

                    if (onStatusChange) {
                        onStatusChange(status, payload);
                    }
                }
            )
            .subscribe();
    }

    window.BintangStoreStatus = {
        updateStoreStatus,
        fetchStoreStatus,
        subscribeStoreStatus
    };
})();
