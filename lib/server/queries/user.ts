import { supabase } from "@/lib/server/supabase";
import { FetchedUser, UpdateUser } from "@/types/User";
import { Session } from "@supabase/supabase-js";
export const fetchUserInfo = async (session: Session): Promise<FetchedUser> => {
  const { data, error, status } = await supabase
    .from("profiles")
    .select(`id,full_name,avatar_url,phone`)
    .eq("id", session?.user.id)
    .single();
  return { data, error };
};

export const updateUserInfo = async (
  updates: UpdateUser,
  id: string
): Promise<FetchedUser> => {
  const { error } = await supabase.from("profiles").upsert(updates);
  console.log(error);
  const { data, status } = await supabase
    .from("profiles")
    .select(`id,full_name,avatar_url,phone`)
    .eq("id", id)
    .single();
  return { error, data };
};
