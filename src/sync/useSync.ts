import { useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import { enviarPendientes, contarPendientes } from "./envio";
import { useStatus } from "../store/status";

export function useSync() {
  const setOnline = useStatus((s) => s.setOnline);
  const setPending = useStatus((s) => s.setPending);

  useEffect(() => {
    const refreshPending = async () => {
      try {
        setPending(await contarPendientes());
      } catch {
        setPending(0);
      }
    };

    refreshPending();

    const unsub = NetInfo.addEventListener(async (state) => {
      const online = !!(state.isConnected && state.isInternetReachable);
      setOnline(online);
      if (online) {
        await enviarPendientes();
      }
      await refreshPending();
    });

    return () => unsub();
  }, [setOnline, setPending]);
}
