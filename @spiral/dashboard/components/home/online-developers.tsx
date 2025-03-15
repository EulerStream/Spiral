"use client";

import {useCallback, useEffect, useState} from "react";
import {discordGuildId} from "@/config/landing";

export default function OnlineDevelopers(
    {guildId}: { guildId: string }
) {
  const [jsonData, setJsonData] = useState<Record<string, any> | null>(null);

  const fetchGuildData = useCallback(async () => {
    const data = await fetch(`https://discord.com/api/guilds/${guildId}/widget.json`);
    return await data.json();
  }, [guildId]);

  useEffect(() => {
    fetchGuildData().then(data => setJsonData(data)).catch(console.warn);
  }, []);

  return <>Join {jsonData?.presence_count ? jsonData.presence_count.toLocaleString() + ' online community ' : 'a community of thousands of '}developers on</>

}