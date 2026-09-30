const APP_CONFIG = {
  brand: {
    name: "Bintang Store",
    kopkenName: "Kopi Kenangan"
  },

  routes: {
    home: "/",
    digital: "/digital",
    kopken: "/kopken",
    orders: "/orders",
    account: "/account",
    support: "/support"
  },

  features: {
    realtimeOrders: true,
    digitalWarranty: true,
    reviews: true,
    refunds: true
  },

  scheduleBusy: [
    { day: 2, start: "07:00", end: "08:40" },
    { day: 2, start: "14:20", end: "16:00" },
    { day: 4, start: "08:40", end: "10:20" },
    { day: 4, start: "16:10", end: "17:50" }
  ],

  supabase: {
    url: "https://axaoagzveujcgoxybdmp.supabase.co",
    publishableKey: "sb_publishable_GQ19XRT7yWIBido0iXJvCQ_ybZ_I7ju"
  }
}
};

export { APP_CONFIG };
