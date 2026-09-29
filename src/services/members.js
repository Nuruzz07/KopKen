import { supabaseClient } from "../../core/supabase.js";

async function saveMember({ memberCode, customerName, customerPhone, outletName }) {
  if (!memberCode || memberCode.length < 2) return null;

  const { data, error } = await supabaseClient
    .from("members")
    .upsert({
      member_code: memberCode,
      customer_name: customerName,
      customer_phone: customerPhone,
      favorite_outlet_name: outletName || ""
    }, { onConflict: "member_code" })
    .select()
    .single();

  if (error) throw error;

  localStorage.setItem("bintang_member_session", JSON.stringify({
    code: memberCode,
    name: customerName,
    phone: customerPhone,
    outlet: outletName || ""
  }));

  return data;
}

function getMemberSession() {
  try {
    return JSON.parse(localStorage.getItem("bintang_member_session") || "null");
  } catch {
    return null;
  }
}

function clearMemberSession() {
  localStorage.removeItem("bintang_member_session");
}

export { saveMember, getMemberSession, clearMemberSession };
